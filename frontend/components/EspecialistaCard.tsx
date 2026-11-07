import Link from "next/link";
import {
  User,
  Users,
  Video,
  IdCard,
  GraduationCap,
  MapPin,
  Link2,
  Info,
  CircleCheck,
  CalendarDays,
} from "lucide-react";
import { REQUISITO_INFO, textoDisponibilidade, type Especialista } from "@/lib/data";

export default function EspecialistaCard({ e }: { e: Especialista }) {
  const online = e.modalidade === "online";
  const grupo = e.servico === "Terapia em Grupo";
  const TopIcon = online ? Video : grupo ? Users : User;
  const req = REQUISITO_INFO[e.requisito];

  return (
    <article className="card flex flex-col p-7 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(11,79,108,0.25)]">
      <div className="flex items-start justify-between">
        <span className={`badge ${online ? "badge-online" : "badge-presencial"}`}>
          {online ? "Online" : "Presencial"}
        </span>
        <TopIcon className="size-6 text-sensus-700" aria-hidden />
      </div>

      <h3 className="mt-4 text-2xl font-semibold text-ink">{e.servico}</h3>
      <p className="mt-2 leading-relaxed text-ink-soft">{e.descricao}</p>

      <ul className="mt-6 space-y-2 text-[15px] text-ink">
        <li className="flex items-center gap-2.5">
          <IdCard className="size-4 shrink-0 text-ink-soft" aria-hidden />
          Supervisão: {e.supervisor}
        </li>
        {e.estagiario && (
          <li className="flex items-center gap-2.5">
            <GraduationCap className="size-4 shrink-0 text-ink-soft" aria-hidden />
            Estagiário(a): {e.estagiario}
          </li>
        )}
        <li className="flex items-center gap-2.5">
          {online ? (
            <Link2 className="size-4 shrink-0 text-ink-soft" aria-hidden />
          ) : (
            <MapPin className="size-4 shrink-0 text-ink-soft" aria-hidden />
          )}
          {e.local}
        </li>
        <li className="flex items-center gap-2.5">
          <CalendarDays className="size-4 shrink-0 text-ink-soft" aria-hidden />
          {textoDisponibilidade(e)}
        </li>
        <li className={`flex items-center gap-2.5 ${req.tom === "ok" ? "text-sensus-700" : "text-sand-700"}`}>
          {req.tom === "ok" ? (
            <CircleCheck className="size-4 shrink-0" aria-hidden />
          ) : (
            <Info className="size-4 shrink-0" aria-hidden />
          )}
          {req.texto}
        </li>
      </ul>

      <div className="mt-auto pt-8">
        <Link href={`/agendamento/${e.id}`} className="btn-outline w-full">
          {e.requisito === "edital" ? "Ver Detalhes" : "Selecionar Horário"}
        </Link>
      </div>
    </article>
  );
}
