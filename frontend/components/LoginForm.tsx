"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { emailValido } from "@/lib/data";

export default function LoginForm() {
  const router = useRouter();
  const equipe = useSearchParams().get("perfil") === "equipe";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const entrar = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!emailValido(email) || senha.length < 6) {
      setErro("Verifique seu e-mail e senha (mínimo de 6 caracteres).");
      return;
    }
    setErro("");
    setEnviando(true);
    // Simulação — sem back-end
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <>
      <div className="flex rounded-full bg-cream p-1 text-sm" role="tablist" aria-label="Tipo de acesso">
        <Link href="/login" role="tab" aria-selected={!equipe}
          className={`flex-1 rounded-full py-2 text-center font-medium transition ${!equipe ? "bg-white text-sensus-700 shadow-sm" : "text-ink-soft"}`}>
          Paciente
        </Link>
        <Link href="/login?perfil=equipe" role="tab" aria-selected={equipe}
          className={`flex-1 rounded-full py-2 text-center font-medium transition ${equipe ? "bg-white text-sensus-700 shadow-sm" : "text-ink-soft"}`}>
          Equipe
        </Link>
      </div>

      <h1 className="mt-8 text-3xl font-bold text-sensus-700">{equipe ? "Portal da Equipe" : "Login do Paciente"}</h1>
      <p className="mt-2 text-ink-soft">
        {equipe ? "Acesso para estagiários, supervisores e recepção." : "Que bom ter você aqui. Entre para acompanhar seus atendimentos."}
      </p>

      <form onSubmit={entrar} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="label">{equipe ? "E-mail institucional" : "E-mail"}</label>
          <input id="email" type="email" autoComplete="email" className="input" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={equipe ? "nome.sobrenome@universidade.edu.br" : "joao.silva@universidade.edu.br"} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="senha" className="text-sm font-medium">Senha</label>
            <a href="#" className="text-sm text-sensus-700 hover:underline">Esqueci minha senha</a>
          </div>
          <PasswordInput id="senha" autoComplete="current-password" value={senha}
            onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" invalid={!!erro} />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} className="size-4 accent-sensus-700" />
          Manter conectado
        </label>

        {erro && <p role="alert" className="rounded-lg bg-alert-50 px-4 py-3 text-sm text-alert-600">{erro}</p>}

        <button type="submit" className="btn-primary w-full py-3.5" disabled={enviando}>
          {enviando ? "Entrando…" : <>Entrar <LogIn className="size-4" /></>}
        </button>
      </form>

      {!equipe && (
        <p className="mt-8 text-center text-sm text-ink-soft">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-sensus-700 hover:underline">Cadastre-se</Link>
        </p>
      )}
    </>
  );
}
