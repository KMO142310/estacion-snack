-- Migration 0006: min_unit_kg per product
-- Adds the minimum purchase unit (in kg) per product.
-- Default: 1.0 kg (all products sold by the kilo).
-- Exception: Chuby Bardú can be purchased from 0.5 kg.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS min_unit_kg numeric(4,2) NOT NULL DEFAULT 1.0;

-- Chuby Bardú is the only product sold from 0.5 kg
UPDATE products SET min_unit_kg = 0.5 WHERE slug = 'chuby-bardu';
