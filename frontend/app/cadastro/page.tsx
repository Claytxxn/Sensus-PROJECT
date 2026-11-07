import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import CadastroForm from "@/components/CadastroForm";

export const metadata: Metadata = { title: "Cadastro" };

export default function CadastroPage() {
  return (
    <AuthShell>
      <CadastroForm />
    </AuthShell>
  );
}
