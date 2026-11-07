import { HeartHandshake, ShieldCheck, Video } from "lucide-react";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-sensus py-12 sm:py-16">
      <div className="card mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-[1fr_1.15fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-sensus-700 p-10 text-white lg:flex">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-sensus-600" />
          <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-sensus-800" />
          <div className="relative">
            <p className="text-sm font-bold tracking-[0.2em] text-sensus-100">SENSUS</p>
            <h2 className="mt-6 text-3xl font-bold leading-tight">Um espaço seguro para cuidar de você.</h2>
            <p className="mt-4 text-sensus-100">
              Acompanhe seus agendamentos, preencha sua triagem e acesse conteúdos de apoio em um só lugar.
            </p>
          </div>
          <ul className="relative mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3"><ShieldCheck className="size-5 text-sensus-200" /> Sigilo profissional e LGPD</li>
            <li className="flex items-center gap-3"><Video className="size-5 text-sensus-200" /> Atendimento presencial ou por vídeo</li>
            <li className="flex items-center gap-3"><HeartHandshake className="size-5 text-sensus-200" /> Equipe supervisionada (CRP ativo)</li>
          </ul>
        </aside>
        <div className="p-7 sm:p-12">{children}</div>
      </div>
    </div>
  );
}
