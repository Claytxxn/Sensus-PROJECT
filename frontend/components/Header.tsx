"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "/", label: "Agendamentos", match: ["/", "/agendamento", "/triagem"] },
  { href: "/servicos", label: "Serviços", match: ["/servicos"] },
  { href: "/clinica", label: "Nossa Clínica", match: ["/clinica"] },
  { href: "/recursos", label: "Recursos", match: ["/recursos"] },
];

function isActive(pathname: string, match: string[]) {
  return match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-cream/95 backdrop-blur">
      <div className="container-sensus flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {NAV.map((item) => {
            const active = isActive(pathname, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 pb-1 text-[17px] transition ${
                  active
                    ? "border-sensus-700 font-semibold text-sensus-700"
                    : "border-transparent text-ink hover:text-sensus-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/login" className="text-[15px] font-medium text-sensus-700 hover:underline">
            Login do Paciente
          </Link>
          <Link href="/login?perfil=equipe" className="btn-primary px-6 py-2.5 text-[15px] font-medium">
            Portal da Equipe
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-sensus-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-200 bg-cream lg:hidden">
          <nav className="container-sensus flex flex-col gap-1 py-4" aria-label="Navegação móvel">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 ${
                  isActive(pathname, item.match) ? "bg-sensus-50 font-semibold text-sensus-700" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-4">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost justify-center">
                Login do Paciente
              </Link>
              <Link href="/login?perfil=equipe" onClick={() => setOpen(false)} className="btn-primary">
                Portal da Equipe
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
