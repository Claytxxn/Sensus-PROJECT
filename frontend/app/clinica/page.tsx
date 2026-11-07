import type { Metadata } from "next";
import Link from "next/link";
import { Accessibility, Armchair, Building2, Check, DoorOpen, Eye, Gem, Monitor, Target, Users } from "lucide-react";
import Illustration from "@/components/Illustration";

export const metadata: Metadata = { title: "Nossa Clínica" };

const VALORES = ["Ética e sigilo profissional", "Acolhimento e respeito", "Compromisso com a comunidade", "Formação de qualidade", "Inclusão e diversidade"];

const ESTRUTURA = [
  { icon: DoorOpen, label: "Salas de atendimento individual" },
  { icon: Users, label: "Salas para terapia em grupo" },
  { icon: Monitor, label: "Atendimento presencial e online" },
  { icon: Accessibility, label: "Espaço acessível e acolhedor" },
];

export default function ClinicaPage() {
  return (
    <>
      <section className="container-sensus grid items-center gap-12 pt-14 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold text-sensus-700 sm:text-5xl">Nossa Clínica</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Conheça a Clínica Universitária de Psicologia: um espaço de formação, cuidado e promoção da saúde mental, que
            integra ensino, pesquisa e atendimento à comunidade.
          </p>
          <Link href="/" className="btn-primary mt-8 px-10">Agendar Consulta</Link>
        </div>
        <Illustration icon={Building2} label="Recepção da clínica-escola SENSUS" className="h-72 lg:h-80" tone="sand" />
      </section>

      <section className="container-sensus mt-16 grid gap-5 md:grid-cols-3">
        <article className="card p-7">
          <Target className="size-8 text-sensus-700" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold">Nossa Missão</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Promover saúde mental, acolhimento e desenvolvimento humano, articulando formação acadêmica e atendimento de
            qualidade à comunidade.
          </p>
        </article>
        <article className="card p-7">
          <Eye className="size-8 text-sensus-700" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold">Nossa Visão</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Ser referência em atendimento psicológico universitário, contribuindo para a formação de profissionais éticos e
            comprometidos.
          </p>
        </article>
        <article className="card p-7">
          <Gem className="size-8 text-sensus-700" strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-semibold">Nossos Valores</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {VALORES.map((v) => (
              <li key={v} className="flex items-center gap-2"><Check className="size-4 text-sensus-700" /> {v}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="container-sensus mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="section-title">Nossa Estrutura</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Illustration icon={Armchair} label="Sala de atendimento" className="h-56" tone="sand" />
            <ul className="card divide-y divide-zinc-100 p-2">
              {ESTRUTURA.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 px-4 py-3.5 text-sm">
                  <Icon className="size-5 text-sensus-700" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="equipe" className="scroll-mt-28 lg:border-l lg:border-zinc-200 lg:pl-10">
          <h2 className="section-title">Nossa Equipe</h2>
          <p className="mt-6 leading-relaxed text-ink-soft">
            Atendimentos realizados por estagiários do curso de Psicologia, com supervisão constante de professores
            psicólogos (CRP ativo), garantindo segurança, ética e qualidade.
          </p>
          <Link href="/" className="btn-outline mt-6 border-sensus-700 text-sensus-700">Conheça a Equipe</Link>
        </div>
      </section>
    </>
  );
}
