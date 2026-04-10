-- ============================================================
-- Estación Snack — RLS hardening, audit log, access tokens
-- Migration: 0002_rls_hardening.sql
--
-- Threat model assumed:
--   * SUPABASE_SERVICE_ROLE_KEY may already be compromised. Every
--     privileged operation must be auditable so a filtration is
--     observable post hoc.
--   * /pedido/[id] links are forwarded over WhatsApp, stored in
--     browser history on shared machines, and leaked via Referer
--     headers. Token-in-URL is treated as a secret with TTL, not
--     as a capability URL.
--   * Anon/authenticated roles must not be able to enumerate,
--     read, or tamper with orders, order_items, customers, or
--     stock_reservations directly.
--
-- Mitigations introduced here, with references:
--   [CWE-639] IDOR on /pedido/[id]         -> access_token + TTL + app-layer timingSafeEqual
--   [CWE-208] timing side-channel          -> timing-safe compare in Node, never in SQL
--   [CVE-2018-1058] search_path hijacking  -> SET search_path on every SECURITY DEFINER fn
--   [CWE-778] insufficient logging         -> append-only audit_log + immutability trigger
--   [OWASP ASVS v4.0.3 §4.2.1]             -> default-deny RLS on all sensitive tables
--   [OWASP ASVS v4.0.3 §3.4]               -> token entropy (256 bits, base64url)
--   [NIST SP 800-63B §5.1.1.2]             -> token entropy floor (112 bits) — we exceed 2x
--   [NIST SP 800-92 §4.2]                  -> append-only audit
--   [GDPR art. 5(1)(c)]                    -> PII minimization — phone masked, ip hashed
--
-- Idempotent: safe to run multiple times against any environment.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- Section 0 — base64url helper (Postgres has no native one)
-- ------------------------------------------------------------
create or replace function fn_b64url(p_bytes bytea)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  -- Standard base64 -> url-safe: '+' -> '-', '/' -> '_', strip '=' padding.
  select rtrim(translate(encode(p_bytes, 'base64'), '+/', '-_'), '=')
$$;

comment on function fn_b64url(bytea) is
  'base64url encoder (RFC 4648 §5). Used to generate url-safe tokens '
  'without padding. search_path pinned per CVE-2018-1058.';

-- ------------------------------------------------------------
-- Section 1 — audit_log (general, append-only)
-- ------------------------------------------------------------
create table if not exists audit_log (
  id            bigserial primary key,
  at            timestamptz not null default now(),
  actor         text not null,   -- 'anon' | 'cron' | 'user:<uuid>' | 'service'
  action        text not null,   -- e.g. 'order.place', 'reservations.release'
  target_table  text,
  target_id     text,
  meta          jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_log_at     on audit_log(at desc);
create index if not exists idx_audit_log_action on audit_log(action);
create index if not exists idx_audit_log_target on audit_log(target_table, target_id);

alter table audit_log enable row level security;

drop policy if exists audit_log_deny_all on audit_log;
create policy audit_log_deny_all on audit_log
  for all
  using (false)
  with check (false);

comment on policy audit_log_deny_all on audit_log is
  'Default-deny baseline. audit_log is writable only via SECURITY DEFINER '
  'helpers (fn_audit_write and the business RPCs that call audit_log '
  'directly) and readable only by service_role / admins (Bloque 6). '
  'Mitigates: tamper/read of the audit trail. Ref: NIST SP 800-92 §4.2, '
  'OWASP ASVS §7.1, CWE-778.';

-- Immutability trigger — fires BEFORE UPDATE OR DELETE at statement
-- level. Even service_role cannot modify audit rows once written. The
-- only way to "rewrite history" is a privileged `DISABLE TRIGGER`, which
-- is itself auditable via pg_event_trigger infrastructure.
create or replace function fn_audit_log_immutable()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception 'audit_log is append-only (NIST SP 800-92 §4.2, CWE-778)'
    using errcode = 'insufficient_privilege';
end;
$$;

drop trigger if exists trg_audit_log_no_modify on audit_log;
create trigger trg_audit_log_no_modify
  before update or delete on audit_log
  for each statement
  execute function fn_audit_log_immutable();

comment on trigger trg_audit_log_no_modify on audit_log is
  'Append-only guarantee: blocks UPDATE and DELETE from all roles, '
  'including service_role. Disabling this trigger is itself a '
  'suspicious event to monitor. Ref: NIST SP 800-92 §4.2.';

-- Helper callable from anon-facing code paths so we can write audit
-- rows without granting INSERT directly on audit_log.
create or replace function fn_audit_write(
  p_actor        text,
  p_action       text,
  p_target_table text,
  p_target_id    text,
  p_meta         jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  insert into audit_log (actor, action, target_table, target_id, meta)
  values (p_actor, p_action, p_target_table, p_target_id, p_meta);
$$;

revoke all on function fn_audit_write(text, text, text, text, jsonb) from public;
grant execute on function fn_audit_write(text, text, text, text, jsonb) to anon;
grant execute on function fn_audit_write(text, text, text, text, jsonb) to authenticated;

comment on function fn_audit_write(text, text, text, text, jsonb) is
  'SECURITY DEFINER helper. Grants anon/authenticated the ability to '
  'append to audit_log without giving them direct INSERT. Caller must '
  'never pass raw PII in p_meta — hash or truncate first.';

-- ------------------------------------------------------------
-- Section 2 — audit_log_order_views (view tracking, hashed PII)
-- ------------------------------------------------------------
create table if not exists audit_log_order_views (
  id              bigserial primary key,
  at              timestamptz not null default now(),
  order_id        uuid not null,
  ip_hash         text,            -- sha256(pepper || ip); pepper from env
  user_agent_hash text,            -- sha256(pepper || user_agent)
  referer_host    text             -- parsed host only, never full URL
);

create index if not exists idx_order_views_order on audit_log_order_views(order_id, at desc);

alter table audit_log_order_views enable row level security;

drop policy if exists order_views_deny_all on audit_log_order_views;
create policy order_views_deny_all on audit_log_order_views
  for all
  using (false)
  with check (false);

comment on policy order_views_deny_all on audit_log_order_views is
  'Default-deny. Writable only via fn_log_order_view. IP is never stored '
  'raw — hashed server-side with a pepper so we can detect repeated '
  'access from the same origin without retaining PII. '
  'Ref: GDPR art. 5(1)(c) minimization, NIST SP 800-92 §4.2.';

drop trigger if exists trg_order_views_no_modify on audit_log_order_views;
create trigger trg_order_views_no_modify
  before update or delete on audit_log_order_views
  for each statement
  execute function fn_audit_log_immutable();

create or replace function fn_log_order_view(
  p_order_id        uuid,
  p_ip_hash         text,
  p_user_agent_hash text,
  p_referer_host    text
)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  insert into audit_log_order_views (order_id, ip_hash, user_agent_hash, referer_host)
  values (p_order_id, p_ip_hash, p_user_agent_hash, p_referer_host);
$$;

revoke all on function fn_log_order_view(uuid, text, text, text) from public;
grant execute on function fn_log_order_view(uuid, text, text, text) to anon;

comment on function fn_log_order_view(uuid, text, text, text) is
  'SECURITY DEFINER append to audit_log_order_views. Caller must hash '
  'ip + user_agent with a server-side pepper before calling.';

-- ------------------------------------------------------------
-- Section 3 — orders: access_token + TTL, default-deny
-- ------------------------------------------------------------
-- Add token column with unique default per row. For an existing
-- production table Postgres rewrites the table so every row gets
-- its own value (gen_random_bytes is VOLATILE). For a fresh table
-- there are no existing rows and it's metadata-only.
alter table orders
  add column if not exists access_token text not null
  default fn_b64url(gen_random_bytes(32));

alter table orders
  add column if not exists access_token_expires_at timestamptz not null
  default now() + interval '30 days';

create index if not exists idx_orders_access_token on orders(access_token);

drop policy if exists orders_deny_all on orders;
create policy orders_deny_all on orders
  for all
  using (false)
  with check (false);

comment on policy orders_deny_all on orders is
  'Default-deny. No role except service_role can read or write orders '
  'directly. /pedido/[id] reads orders through the Next.js server '
  'component (service_role), validates the access_token in Node with '
  'crypto.timingSafeEqual, and masks PII before rendering. Admin pages '
  'also use service_role until admins table lands in Bloque 6. '
  'Mitigates: CWE-639 IDOR, CWE-200 PII exposure. '
  'Ref: OWASP ASVS §4.2.1, §3.4, §8.3.';

drop policy if exists order_items_deny_all on order_items;
create policy order_items_deny_all on order_items
  for all
  using (false)
  with check (false);

comment on policy order_items_deny_all on order_items is
  'Default-deny. Same reasoning as orders_deny_all — order_items are '
  'only accessed through the app server. Ref: OWASP ASVS §4.2.1.';

-- Admin helper: rotate the token (called on order terminal transitions
-- to limit the reuse window of a shared link). Only callable with
-- elevated privilege; NOT granted to anon/authenticated.
create or replace function fn_rotate_order_access_token(p_order_id uuid)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_token text;
begin
  v_token := fn_b64url(gen_random_bytes(32));
  update orders
    set access_token = v_token,
        access_token_expires_at = now() + interval '30 days'
    where id = p_order_id;
  return v_token;
end;
$$;

revoke all on function fn_rotate_order_access_token(uuid) from public;
-- Intentionally no GRANT EXECUTE to anon/authenticated. Only
-- service_role (bypass RLS) reaches this via admin-actions.

comment on function fn_rotate_order_access_token(uuid) is
  'Rotate the access_token on terminal state transitions (delivered/'
  'cancelled). Shrinks the reuse window of any leaked link. Callable '
  'only from server-side admin code paths. Ref: least-privilege temporal.';

-- ------------------------------------------------------------
-- Section 4 — customers: default-deny
-- ------------------------------------------------------------
drop policy if exists customers_deny_all on customers;
create policy customers_deny_all on customers
  for all
  using (false)
  with check (false);

comment on policy customers_deny_all on customers is
  'Default-deny. Customer rows are only written via fn_place_order '
  '(SECURITY DEFINER upsert) and only read by admins via service_role. '
  'Mitigates: PII dump via anon enumeration (CWE-200). '
  'Ref: OWASP ASVS §4.2.1, GDPR art. 5(1)(c).';

-- ------------------------------------------------------------
-- Section 5 — products: keep public read, writes are admin-only
-- ------------------------------------------------------------
drop policy if exists products_public_read on products;
create policy products_public_read on products
  for select
  to anon, authenticated
  using (true);

comment on policy products_public_read on products is
  'Public catalogue read. Products are inherently public data. '
  'This is a PERMISSIVE policy and only covers SELECT.';

-- Belt & suspenders: a FOR ALL USING false documents the default-deny
-- posture for INSERT/UPDATE/DELETE. SELECT is still allowed because
-- permissive policies OR-combine, so (true OR false) = true for SELECT.
drop policy if exists products_deny_writes on products;
create policy products_deny_writes on products
  for all
  using (false)
  with check (false);

comment on policy products_deny_writes on products is
  'Explicit default-deny marker for writes. Postgres OR-combines '
  'permissive policies, so SELECT remains open via products_public_read '
  'while INSERT/UPDATE/DELETE have no allowing policy and are denied. '
  'service_role bypasses RLS for admin catalogue edits. '
  'Ref: OWASP ASVS §4.2.1.';

-- ------------------------------------------------------------
-- Section 6 — stock_reservations: revoke direct client access
-- ------------------------------------------------------------
-- The prior migration exposed stock_reservations with USING (true) on
-- select/insert/delete, which allowed any anon to enumerate and even
-- delete other sessions' reservations (cart griefing / stock DoS).
drop policy if exists "reservations_insert_anon"    on stock_reservations;
drop policy if exists "reservations_select_session" on stock_reservations;
drop policy if exists "reservations_delete_session" on stock_reservations;
drop policy if exists reservations_deny_all         on stock_reservations;

create policy reservations_deny_all on stock_reservations
  for all
  using (false)
  with check (false);

comment on policy reservations_deny_all on stock_reservations is
  'Default-deny. All reservation ops flow through SECURITY DEFINER '
  'RPCs (fn_reserve_stock, fn_place_order, fn_release_expired_reservations) '
  'which enforce session isolation internally. Closes the prior bug where '
  'anon could SELECT/DELETE any session''s reservations. '
  'Mitigates: CWE-284 improper access control, stock denial. '
  'Ref: OWASP ASVS §4.2.1.';

-- ------------------------------------------------------------
-- Section 7 — SECURITY DEFINER functions: pin search_path (CVE-2018-1058)
--
-- We re-define the three existing functions with
--   SET search_path = public, pg_temp
-- to close the search_path hijacking attack, and add audit logging.
-- ------------------------------------------------------------

create or replace function fn_reserve_stock(
  p_session_id text,
  p_product_id uuid,
  p_qty        numeric
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_stock          numeric;
  v_reserved_other numeric;
  v_available      numeric;
begin
  -- Defensive validation. Matches app-layer Zod from Bloque 5.
  if p_qty < 0 or p_qty > 1000 then
    raise exception 'Cantidad inválida';
  end if;

  select stock_kg into v_stock
    from products
    where id = p_product_id
    for update;

  if not found then
    return false;
  end if;

  select coalesce(sum(qty), 0) into v_reserved_other
    from stock_reservations
    where product_id = p_product_id
      and session_id <> p_session_id
      and expires_at > now();

  v_available := v_stock - v_reserved_other;
  if v_available < p_qty then
    return false;
  end if;

  delete from stock_reservations
    where product_id = p_product_id and session_id = p_session_id;

  if p_qty > 0 then
    insert into stock_reservations (product_id, session_id, qty, expires_at)
    values (p_product_id, p_session_id, p_qty, now() + interval '15 minutes');
  end if;

  return true;
end;
$$;

create or replace function fn_release_expired_reservations()
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  delete from stock_reservations
    where expires_at <= now();
  get diagnostics v_count = row_count;

  -- Telemetry independent of application logs. Audit log is append-only
  -- so the cron's behaviour over time is tamper-evident.
  insert into audit_log (actor, action, target_table, target_id, meta)
  values ('cron', 'reservations.release', 'stock_reservations', null,
          jsonb_build_object('released', v_count));

  return v_count;
end;
$$;

create or replace function fn_place_order(
  p_session_id     text,
  p_customer_name  text,
  p_customer_phone text,
  p_items          jsonb,
  p_notes          text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id       uuid;
  v_customer_id    uuid;
  v_subtotal       int := 0;
  v_item           jsonb;
  v_product_id     uuid;
  v_qty            numeric;
  v_price          int;
  v_name           text;
  v_stock          numeric;
  v_reserved_other numeric;
  v_available      numeric;
  v_item_sub       int;
  v_item_count     int;
begin
  v_item_count := coalesce(jsonb_array_length(p_items), 0);
  if v_item_count = 0 or v_item_count > 50 then
    raise exception 'Lista de items inválida';
  end if;

  delete from stock_reservations where expires_at <= now();

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty        := (v_item->>'qty')::numeric;

    if v_qty <= 0 or v_qty > 1000 then
      raise exception 'Cantidad inválida';
    end if;

    select stock_kg, price, name
      into v_stock, v_price, v_name
      from products
      where id = v_product_id
      for update;

    if not found then
      raise exception 'Producto no encontrado';
    end if;

    select coalesce(sum(qty), 0) into v_reserved_other
      from stock_reservations
      where product_id = v_product_id
        and session_id <> p_session_id
        and expires_at > now();

    v_available := v_stock - v_reserved_other;
    if v_available < v_qty then
      raise exception 'Stock insuficiente';
    end if;

    update products set stock_kg = stock_kg - v_qty where id = v_product_id;

    v_item_sub := (v_price * v_qty)::int;
    v_subtotal := v_subtotal + v_item_sub;
  end loop;

  insert into customers (phone, name, first_order_at, last_order_at, total_orders)
  values (p_customer_phone, p_customer_name, now(), now(), 1)
  on conflict (phone) do update
    set name          = excluded.name,
        last_order_at = now(),
        total_orders  = customers.total_orders + 1,
        total_spent   = customers.total_spent + v_subtotal
  returning id into v_customer_id;

  insert into orders (customer_id, customer_name, customer_phone, status,
                      subtotal, shipping, total, notes, whatsapp_sent_at)
  values (v_customer_id, p_customer_name, p_customer_phone,
          'pending_whatsapp', v_subtotal, 0, v_subtotal, p_notes, now())
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty        := (v_item->>'qty')::numeric;

    select price, name into v_price, v_name
      from products where id = v_product_id;

    insert into order_items (order_id, product_id, product_name, qty, unit_price, subtotal)
    values (v_order_id, v_product_id, v_name, v_qty, v_price, (v_price * v_qty)::int);
  end loop;

  delete from stock_reservations where session_id = p_session_id;

  -- Audit: order creation. Never store raw phone or notes in meta.
  insert into audit_log (actor, action, target_table, target_id, meta)
  values ('anon', 'order.place', 'orders', v_order_id::text,
          jsonb_build_object(
            'subtotal', v_subtotal,
            'items',    v_item_count
          ));

  return v_order_id;
end;
$$;

-- ------------------------------------------------------------
-- Section 8 — GRANT EXECUTE on the anon-facing public API surface
-- ------------------------------------------------------------
revoke all on function fn_reserve_stock(text, uuid, numeric)              from public;
grant  execute on function fn_reserve_stock(text, uuid, numeric)          to anon;

revoke all on function fn_place_order(text, text, text, jsonb, text)      from public;
grant  execute on function fn_place_order(text, text, text, jsonb, text)  to anon;

revoke all on function fn_release_expired_reservations()                  from public;
grant  execute on function fn_release_expired_reservations()              to anon;

commit;
