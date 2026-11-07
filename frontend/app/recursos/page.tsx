import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  CirclePlay,
  FileText,
  Headset,
  ListChecks,
  Moon,
  Sunrise,
} from "lucide-react";
import Illustration from "@/components/Illustration";

export const metadata: Metadata = { title: "Recursos" };

const ARTIGOS = [
  { icon: Sunrise, tag: "Bem-estar", titulo: "Como reduzir a ansiedade no dia a dia", texto: "Dicas práticas para lidar com a ansiedade e manter o equilíbrio.", tone: "sand" as const },
  { icon: ListChecks, tag: "Vida Acadêmica", titulo: "Organização e rotina de estudos com saúde mental", texto: "Estratégias para conciliar estudos, prazos e bem-estar.", tone: "sensus" as const },
  { icon: Moon, tag: "Saúde Mental", titulo: "A importância do sono para o bem-estar emocional", texto: "Como a qualidade do sono influencia na sua saúde mental.", tone: "sky" as const },
];

const OUTROS = [
  { icon: FileText, titulo: "Materiais e Guias", texto: "Cartilhas, orientações e e-books", href: "#" },
  { icon: CirclePlay, titulo: "Vídeos Educativos", texto: "Palestras e conteúdos de psicoeducação", href: "#" },
  { icon: CircleHelp, titulo: "Perguntas Frequentes (FAQ)", texto: "Tire suas dúvidas sobre os atendimentos", href: "#" },
  { icon: Headset, titulo: "Contatos de Emergência", texto: "Serviços de apoio em situações de crise", href: "#emergencia" },
];

export default function RecursosPage() {
  return (
    <>
      <section className="container-sensus grid items-center gap-12 pt-14 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold text-sensus-700 sm:text-5xl">Recursos de Apoio</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Conteúdos, orientações e materiais para cuidar da sua saúde mental no dia a dia, com informação de qualidade e
            base científica.
          </p>
          <Link href="#destaques" className="btn-primary mt-8 px-10">Explorar Recursos</Link>
        </div>
        <Illustration icon={BookOpen} label="Materiais de estudo e apoio" className="h-72 lg:h-80" tone="sky" />
      </section>

      <section id="destaques" className="container-sensus mt-16 grid scroll-mt-28 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="section-title">Conteúdos em Destaque</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {ARTIGOS.map(({ icon, tag, titulo, texto, tone }) => (
              <article key={titulo} className="card flex flex-col overflow-hidden p-3">
                <Illustration icon={icon} label={tag} className="h-32 rounded-xl shadow-none" tone={tone} />
                <div className="flex flex-1 flex-col p-3">
                  <span className="badge badge-online w-fit">{tag}</span>
                  <h3 className="mt-2 font-semibold leading-snug">{titulo}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{texto}</p>
                  <a href="#" className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-sensus-700 hover:underline">
                    Ler artigo <ChevronRight className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:border-l lg:border-zinc-200 lg:pl-10">
          <h2 className="section-title">Outros Recursos</h2>
          <ul className="mt-6 space-y-3">
            {OUTROS.map(({ icon: Icon, titulo, texto, href }) => (
              <li key={titulo}>
                <a href={href} className="card flex items-center gap-4 p-4 transition hover:bg-sensus-50">
                  <Icon className="size-7 shrink-0 text-sensus-700" strokeWidth={1.5} />
                  <span className="flex-1">
                    <span className="block font-semibold">{titulo}</span>
                    <span className="block text-sm text-ink-soft">{texto}</span>
                  </span>
                  <ChevronRight className="size-5 text-ink-soft" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="emergencia" className="container-sensus mt-16 scroll-mt-28">
        <div className="rounded-2xl border border-alert-600/20 bg-alert-50 p-7">
          <h2 className="text-xl font-semibold text-alert-600">Contatos de Emergência (24h, gratuitos)</h2>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <li><strong>CVV — 188</strong><br />Apoio emocional e prevenção do suicídio</li>
            <li><strong>SAMU — 192</strong><br />Emergências médicas</li>
            <li><strong>CAPS da sua cidade</strong><br />Atendimento em saúde mental pelo SUS</li>
          </ul>
        </div>
      </section>
    </>
  );
}
