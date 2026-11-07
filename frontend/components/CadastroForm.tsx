"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, UserPlus } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { emailValido, mascaraCPF, mascaraTelefone } from "@/lib/data";

type Campos = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  nascimento: string;
  vinculo: string;
  curso: string;
  senha: string;
  confirmar: string;
  termos: boolean;
};

const INICIAL: Campos = {
  nome: "", email: "", cpf: "", telefone: "", nascimento: "", vinculo: "", curso: "", senha: "", confirmar: "", termos: false,
};

function forcaSenha(s: string) {
  let p = 0;
  if (s.length >= 8) p++;
  if (/[A-Z]/.test(s) && /[a-z]/.test(s)) p++;
  if (/\d/.test(s)) p++;
  if (/[^A-Za-z0-9]/.test(s)) p++;
  return p; // 0–4
}

export default function CadastroForm() {
  const [c, setC] = useState<Campos>(INICIAL);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);

  const set = <K extends keyof Campos>(k: K, v: Campos[K]) => {
    setC((p) => ({ ...p, [k]: v }));
    setErros((p) => ({ ...p, [k]: undefined }));
  };

  const forca = forcaSenha(c.senha);
  const corForca = ["bg-zinc-200", "bg-alert-600", "bg-sand-700", "bg-sensus-400", "bg-sensus-700"][forca];
  const rotuloForca = ["", "Fraca", "Razoável", "Boa", "Forte"][forca];

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof erros = {};
    if (c.nome.trim().split(/\s+/).length < 2) e.nome = "Informe nome e sobrenome.";
    if (!emailValido(c.email)) e.email = "E-mail inválido.";
    if (c.cpf.replace(/\D/g, "").length !== 11) e.cpf = "CPF deve ter 11 dígitos.";
    if (c.telefone.replace(/\D/g, "").length < 10) e.telefone = "Telefone com DDD.";
    if (!c.nascimento) e.nascimento = "Informe sua data de nascimento.";
    if (!c.vinculo) e.vinculo = "Selecione seu vínculo.";
    if (c.vinculo === "Estudante" && !c.curso.trim()) e.curso = "Informe seu curso.";
    if (forca < 2 || c.senha.length < 8) e.senha = "Use ao menos 8 caracteres, com letras e números.";
    if (c.confirmar !== c.senha) e.confirmar = "As senhas não coincidem.";
    if (!c.termos) e.termos = "Você precisa aceitar os termos.";
    setErros(e);
    if (Object.keys(e).length) return;
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setOk(true);
    }, 800);
  };

  if (ok) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-10 text-center">
        <CircleCheck className="size-14 text-sensus-700" />
        <h1 className="mt-5 text-3xl font-bold text-sensus-700">Conta criada!</h1>
        <p className="mt-2 max-w-sm text-ink-soft">
          Enviamos um link de confirmação para <strong>{c.email}</strong>. Depois de confirmar, você já pode agendar.
        </p>
        <Link href="/login" className="btn-primary mt-8">Ir para o login</Link>
      </div>
    );
  }

  const msg = (k: keyof Campos) => (erros[k] ? <p className="mt-1.5 text-sm text-alert-600" role="alert">{erros[k]}</p> : null);
  const cls = (k: keyof Campos) => `input ${erros[k] ? "input-error" : ""}`;

  return (
    <>
      <h1 className="text-3xl font-bold text-sensus-700">Criar conta</h1>
      <p className="mt-2 text-ink-soft">Cadastre-se para agendar e acompanhar seus atendimentos.</p>

      <form onSubmit={enviar} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="nome" className="label">Nome completo</label>
          <input id="nome" className={cls("nome")} autoComplete="name" placeholder="João da Silva"
            value={c.nome} onChange={(e) => set("nome", e.target.value)} />
          {msg("nome")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label">E-mail</label>
            <input id="email" type="email" className={cls("email")} autoComplete="email" placeholder="joao@email.com"
              value={c.email} onChange={(e) => set("email", e.target.value)} />
            {msg("email")}
          </div>
          <div>
            <label htmlFor="tel" className="label">Telefone</label>
            <input id="tel" type="tel" inputMode="numeric" className={cls("telefone")} placeholder="(11) 90000-0000"
              value={c.telefone} onChange={(e) => set("telefone", mascaraTelefone(e.target.value))} />
            {msg("telefone")}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cpf" className="label">CPF</label>
            <input id="cpf" inputMode="numeric" className={cls("cpf")} placeholder="000.000.000-00"
              value={c.cpf} onChange={(e) => set("cpf", mascaraCPF(e.target.value))} />
            {msg("cpf")}
          </div>
          <div>
            <label htmlFor="nasc" className="label">Data de nascimento</label>
            <input id="nasc" type="date" className={cls("nascimento")}
              value={c.nascimento} onChange={(e) => set("nascimento", e.target.value)} />
            {msg("nascimento")}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="vinculo" className="label">Vínculo com a universidade</label>
            <select id="vinculo" className={cls("vinculo")} value={c.vinculo} onChange={(e) => set("vinculo", e.target.value)}>
              <option value="">Selecione…</option>
              <option>Estudante</option>
              <option>Servidor(a) / Professor(a)</option>
              <option>Comunidade externa</option>
            </select>
            {msg("vinculo")}
          </div>
          {c.vinculo === "Estudante" && (
            <div>
              <label htmlFor="curso" className="label">Curso</label>
              <input id="curso" className={cls("curso")} placeholder="ex: Engenharia, 2º ano"
                value={c.curso} onChange={(e) => set("curso", e.target.value)} />
              {msg("curso")}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="senha" className="label">Senha</label>
          <PasswordInput id="senha" autoComplete="new-password" value={c.senha} invalid={!!erros.senha}
            onChange={(e) => set("senha", e.target.value)} placeholder="Mínimo de 8 caracteres" />
          {c.senha && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= forca ? corForca : "bg-zinc-200"}`} />
                ))}
              </div>
              <span className="text-xs text-ink-soft">{rotuloForca}</span>
            </div>
          )}
          {msg("senha")}
        </div>

        <div>
          <label htmlFor="confirmar" className="label">Confirmar senha</label>
          <PasswordInput id="confirmar" autoComplete="new-password" value={c.confirmar} invalid={!!erros.confirmar}
            onChange={(e) => set("confirmar", e.target.value)} placeholder="Repita a senha" />
          {msg("confirmar")}
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" checked={c.termos} onChange={(e) => set("termos", e.target.checked)} className="mt-0.5 size-4 accent-sensus-700" />
          <span>
            Li e aceito os <a href="#" className="text-sensus-700 underline">Termos de Serviço</a> e a{" "}
            <a href="#" className="text-sensus-700 underline">Política de Privacidade</a>.
          </span>
        </label>
        {msg("termos")}

        <button type="submit" className="btn-primary w-full py-3.5" disabled={enviando}>
          {enviando ? "Criando conta…" : <>Criar conta <UserPlus className="size-4" /></>}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-sensus-700 hover:underline">Entrar</Link>
      </p>
    </>
  );
}
