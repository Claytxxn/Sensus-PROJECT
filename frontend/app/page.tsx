import Link from "next/link";
import { CalendarCheck, ClipboardList } from "lucide-react";
import BuscaEspecialistas from "@/components/BuscaEspecialistas";

export default function HomePage() {
  return (
    <>
      <section className="container-sensus grid items-center gap-12 pt-14 lg:grid-cols-2 lg:pt-16">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] text-sensus-700 sm:text-5xl lg:text-[3.4rem]">
            Seu bem-estar mental em primeiro lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            A Clínica Universitária oferece suporte psicológico acessível, unindo excelência acadêmica e cuidado
            humanizado. Encontre o espaço seguro que você precisa para crescer.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="#busca" className="btn-primary px-12 py-4">Agendar Consulta</Link>
            <Link href="/triagem" className="btn-ghost px-6 py-4">
              <ClipboardList className="size-4" /> Fazer triagem
            </Link>
          </div>
        </div>

        {/* Mockup visual do portal de agendamento */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sand-100 via-cream to-sensus-100 p-6 shadow-[0_20px_50px_-20px_rgba(11,79,108,0.35)] sm:p-10">
          <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/50" />
          <div className="relative rounded-2xl bg-white p-5 shadow-lg sm:w-4/5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold tracking-[0.15em] text-sensus-700">SENSUS</span>
              <span className="text-[11px] text-ink-soft">Portal de Agendamento</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-ink">Agendar Nova Consulta</p>
            <div className="mt-3 space-y-2">
              <div className="h-8 rounded-md border border-zinc-200 bg-cream px-3 text-[11px] leading-8 text-ink-soft">Psicologia · Atendimento Individual</div>
              <div className="h-8 rounded-md border border-zinc-200 bg-cream px-3 text-[11px] leading-8 text-ink-soft">Profa. Dra. Elena Costa</div>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] text-ink-soft">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className={`rounded py-1 ${i === 9 ? "bg-sensus-700 font-semibold text-white" : "bg-cream"}`}>
                  {i + 8}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              {["10:00", "11:00", "14:00"].map((h, i) => (
                <span key={h} className={`rounded-md border px-2 py-1 text-[10px] ${i === 1 ? "border-sensus-700 text-sensus-700" : "border-zinc-200 text-ink-soft"}`}>{h}</span>
              ))}
            </div>
            <div className="mt-4 flex h-8 items-center justify-center gap-1.5 rounded-md bg-sensus-700 text-[11px] font-semibold text-white">
              <CalendarCheck className="size-3.5" /> Confirmar Agendamento
            </div>
          </div>
        </div>
      </section>

      <BuscaEspecialistas />
    </>
  );
}
