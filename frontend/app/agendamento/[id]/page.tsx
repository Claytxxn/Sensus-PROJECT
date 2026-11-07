import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPECIALISTAS, getEspecialista } from "@/lib/data";
import SolicitacaoAgendamento from "@/components/SolicitacaoAgendamento";

export function generateStaticParams() {
  return ESPECIALISTAS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = getEspecialista(id);
  return { title: e ? `Agendar — ${e.servico}` : "Agendamento" };
}

export default async function AgendamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const especialista = getEspecialista(id);
  if (!especialista) notFound();
  return <SolicitacaoAgendamento e={especialista} />;
}
