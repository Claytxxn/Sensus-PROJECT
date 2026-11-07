import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  ChevronRight,
  CloudRain,
  Ellipsis,
  Feather,
  Frown,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Sofa,
  Target,
  User,
  Users,
} from "lucide-react";
import Illustration from "@/components/Illustration";

export const metadata: Metadata = { title: "Serviços" };

const TIPOS = [
  { icon: User, titulo: "Atendimento Individual", texto: "Acompanhamento psicológico personalizado, focado nas suas necessidades e objetivos.", cta: "Agendar", href: "/" },
  { icon: Users, titulo: "Terapia em Grupo", texto: "Espaço de troca e acolhimento para lidar com temas em comum (ex.: ansiedade, adaptação acadêmica).", cta: "Ver Grupos", href: "/agendamento/grupo-martins" },
  { icon: Laptop, titulo: "Atendimento Online", texto: "Consultas por videochamada, com a mesma qualidade e sigilo do presencial.", cta: "Agendar Online", href: "/agendamento/apoio-ricardo" },
  { icon: HeartHandshake, titulo: "Apoio Acadêmico", texto: "Suporte psicológico voltado aos desafios da vida universitária (rotina, estresse, ansiedade e desempenho).", cta: "Saiba Mais", href: "/agendamento/academico-juliana" },
];

const DEMANDAS = [
  { icon: Brain, label: "Ansiedade" },
  { icon: Frown, label: "Depressão" },
  { icon: Target, label: "Estresse" },
  { icon: GraduationCap, label: "Vida Acadêmica" },
  { icon: Users, label: "Relacionamentos" },
  { icon: Feather, label: "Autoestima" },
  { icon: CloudRain, label: "Luto" },
  { icon: Ellipsis, label: "Outros Temas" },
];

export default function ServicosPage() {
  return (
    <>
      <section className="container-sensus grid items-center gap-12 pt-14 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold text-sensus-700 sm:text-5xl">Nossos Serviços</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Atendimentos psicológicos especializados, com acolhimento, ética e foco no seu bem-estar emocional e acadêmico.
          </p>
          <Link href="/" className="btn-primary mt-8 px-10">Agendar Consulta</Link>
        </div>
        <Illustration icon={Sofa} label="Sala de atendimento acolhedora" className="h-72 lg:h-80" />
      </section>

      <section className="container-sensus mt-16">
        <h2 className="section-title">Tipos de Atendimento</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {TIPOS.map(({ icon: Icon, titulo, texto, cta, href }) => (
            <article key={titulo} className="card flex gap-5 p-6">
              <Icon className="size-9 shrink-0 text-sensus-700" strokeWidth={1.5} />
              <div>
                <h3 className="text-lg font-semibold">{titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{texto}</p>
                <Link href={href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sensus-700 hover:underline">
                  {cta} <ChevronRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-sensus mt-16">
        <h2 className="section-title">Principais Demandas Atendidas</h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {DEMANDAS.map(({ icon: Icon, label }) => (
            <div key={label} className="card flex flex-col items-center gap-3 px-3 py-5 text-center">
              <Icon className="size-7 text-sensus-700" strokeWidth={1.5} />
              <span className="text-sm text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
