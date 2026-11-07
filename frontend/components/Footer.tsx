import Link from "next/link";
import Logo from "./Logo";

const LINKS = [
  { href: "#", label: "Política de Privacidade" },
  { href: "#", label: "Termos de Serviço" },
  { href: "/recursos#emergencia", label: "Contatos de Emergência" },
  { href: "/clinica#equipe", label: "Diretório da Equipe" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-mist">
      <div className="container-sensus flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Logo />
          <p className="max-w-md text-xs font-medium text-ink-soft">
            © {new Date().getFullYear()} Clínica Universitária de Psicologia. Comprometidos com o bem-estar mental e a
            excelência acadêmica.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Rodapé">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-xs font-medium text-ink hover:text-sensus-700">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
