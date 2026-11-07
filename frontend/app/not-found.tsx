import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-sensus flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-bold text-sensus-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-sensus-700">Página não encontrada</h1>
      <p className="mt-2 text-ink-soft">O conteúdo que você procura não existe ou foi movido.</p>
      <Link href="/" className="btn-primary mt-8">Voltar ao início</Link>
    </div>
  );
}
