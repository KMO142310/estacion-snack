import type { Metadata } from "next";
import AssistantChat from "@/components/admin/AssistantChat";

export const metadata: Metadata = {
  title: "Asistente · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AsistentePage() {
  return <AssistantChat />;
}
