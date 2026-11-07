"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  HeartHandshake,
  Lock,
  Phone,
  Send,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { TEMAS, emailValido, getEspecialista, mascaraTelefone } from "@/lib/data";
import {
  PRIORIDADE_INFO,
  TRIAGEM_INICIAL,
  calcularPrioridade,
  detectarTemas,
  recomendar,
  textoIndicaRisco,
  type DadosTriagem,
  type Periodo,
} from "@/lib/triagem";

const ETAPAS = ["Seus dados", "Sobre a consulta", "Bem-estar", "Revisão"];

type Erros = Partial<Record<keyof DadosTriagem, string>>;

export default function TriagemForm() {
  const params = useSearchParams();
  const especialista = getEspecialista(params.get("especialista") ?? "");

  const [etapa, setEtapa] = useState(0);
  const [d, setD] = useState<DadosTriagem>(TRIAGEM_INICIAL);
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const set = <K extends keyof DadosTriagem>(k: K, v: DadosTriagem[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setErros((prev) => ({ ...prev, [k]: undefined }));
  };
  const toggle = <T,>(lista: T[], item: T) => (lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item]);

  const temasSugeridos = useMemo(
    () => detectarTemas(d.motivo).filter((t) => !d.temas.includes(t)),
    [d.motivo, d.temas]
  );
  const riscoTexto = textoIndicaRisco(d.motivo);
  const mostrarApoio = d.risco !== "nao" || riscoTexto;
  const prioridade = calcularPrioridade(d);
  const recomendacoes = useMemo(() => recomendar(d), [d]);

  function validar(passo: number): boolean {
    const e: Erros = {};
    if (passo === 0) {
      if (d.nome.trim().split(/\s+/).length < 2) e.nome = "Informe seu nome completo.";
      if (!emailValido(d.email)) e.email = "Informe um e-mail válido.";
      if (d.telefone.replace(/\D/g, "").length < 10) e.telefone = "Informe um telefone com DDD.";
      if (!d.curso.trim()) e.curso = "Informe seu curso ou vínculo.";
    }
    if (passo === 1) {
      if (d.motivo.trim().length < 10) e.motivo = "Conte um pouco mais (mínimo de 10 caracteres).";
      if (!d.duracao) e.duracao = "Selecione uma opção.";
    }
    if (passo === 2) {
      if (!d.sono) e.sono = "Selecione uma opção.";
      if (!d.periodos.length) e.periodos = "Escolha ao menos um período.";
    }
    if (passo === 3 && !d.consentimento) e.consentimento = "É necessário concordar para enviar.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  const avancar = () => {
    if (!validar(etapa)) return;
    setEtapa((s) => Math.min(s + 1, ETAPAS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const voltar = () => setEtapa((s) => Math.max(s - 1, 0));

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (etapa < ETAPAS.length - 1) return avancar();
    if (!validar(3)) return;
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  if (enviado) {
    const info = PRIORIDADE_INFO[prioridade];
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sensus-50">
          <CircleCheck className="size-9 text-sensus-700" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-sensus-700">Obrigado, {d.nome.split(" ")[0]}!</h1>
        <p className="mt-3 text-ink-soft">
          Recebemos sua triagem. Um(a) profissional da equipe vai analisar suas respostas com todo o cuidado e entrará em
          contato pelo e-mail <strong>{d.email}</strong>.
        </p>
        <div className={`mt-6 rounded-xl border p-4 text-left text-sm ${info.classe}`}>
          <p className="font-semibold">{info.titulo}</p>
          <p className="mt-1">{info.texto}</p>
        </div>
        <Link href="/" className="btn-primary mt-8">Voltar ao início</Link>
      </div>
    );
  }

  const erro = (k: keyof DadosTriagem) =>
    erros[k] ? <p className="mt-1.5 text-sm text-alert-600" role="alert">{erros[k]}</p> : null;

  return (
    <form onSubmit={enviar} noValidate className="card mx-auto max-w-3xl p-6 sm:p-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold leading-tight text-sensus-700 sm:text-4xl">
          Formulário de Pré-Agendamento / Triagem
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-soft">
          Bem-vindo(a). Por favor, dedique um momento para nos fornecer algumas informações básicas para que possamos nos
          preparar melhor para sua consulta e apoiar seu bem-estar.
        </p>
        {especialista && (
          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-sensus-50 px-4 py-1.5 text-sm text-sensus-700">
            <Sparkles className="size-4" /> Triagem para: {especialista.servico} · {especialista.supervisor}
          </p>
        )}
      </header>

      {/* Indicador de etapas */}
      <ol className="mt-9 grid grid-cols-4 gap-2" aria-label="Etapas da triagem">
        {ETAPAS.map((nome, i) => (
          <li key={nome} className="flex flex-col gap-2" aria-current={i === etapa ? "step" : undefined}>
            <div className={`h-1.5 rounded-full transition ${i <= etapa ? "bg-sensus-700" : "bg-zinc-200"}`} />
            <span className={`hidden text-xs font-medium sm:block ${i <= etapa ? "text-sensus-700" : "text-ink-soft"}`}>
              {i + 1}. {nome}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-ink-soft sm:hidden">Etapa {etapa + 1} de {ETAPAS.length}: {ETAPAS[etapa]}</p>

      <div className="mt-8 space-y-6">
        {/* ETAPA 1 — Dados */}
        {etapa === 0 && (
          <>
            <div>
              <label htmlFor="nome" className="label">Nome Completo</label>
              <input id="nome" className={`input ${erros.nome ? "input-error" : ""}`} placeholder="João da Silva"
                value={d.nome} onChange={(e) => set("nome", e.target.value)} autoComplete="name" />
              {erro("nome")}
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="label">E-mail Institucional/Pessoal</label>
                <input id="email" type="email" className={`input ${erros.email ? "input-error" : ""}`}
                  placeholder="joao.silva@universidade.edu.br" value={d.email}
                  onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                {erro("email")}
              </div>
              <div>
                <label htmlFor="tel" className="label">Número de Telefone</label>
                <input id="tel" type="tel" inputMode="numeric" className={`input ${erros.telefone ? "input-error" : ""}`}
                  placeholder="(11) 90000-0000" value={d.telefone}
                  onChange={(e) => set("telefone", mascaraTelefone(e.target.value))} autoComplete="tel" />
                {erro("telefone")}
              </div>
            </div>
            <div>
              <label htmlFor="curso" className="label">Curso Universitário / Vínculo</label>
              <input id="curso" className={`input ${erros.curso ? "input-error" : ""}`} placeholder="ex: Psicologia, 3º Ano"
                value={d.curso} onChange={(e) => set("curso", e.target.value)} />
              {erro("curso")}
            </div>
          </>
        )}

        {/* ETAPA 2 — Consulta */}
        {etapa === 1 && (
          <>
            <div>
              <label htmlFor="motivo" className="label">Motivo da Consulta</label>
              <textarea id="motivo" rows={5} className={`input resize-y ${erros.motivo ? "input-error" : ""}`}
                placeholder="Descreva brevemente o que te traz aqui hoje..." value={d.motivo}
                onChange={(e) => set("motivo", e.target.value)} />
              {erro("motivo")}
              <p className="mt-1.5 text-sm text-ink-soft">Suas informações são mantidas estritamente confidenciais.</p>

              {temasSugeridos.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-sensus-50 p-3 text-sm">
                  <Sparkles className="size-4 text-sensus-700" />
                  <span className="text-sensus-800">Identificamos possíveis temas:</span>
                  {temasSugeridos.map((t) => (
                    <button key={t} type="button" onClick={() => set("temas", [...d.temas, t])}
                      className="rounded-full border border-sensus-300 bg-white px-3 py-0.5 text-sensus-700 hover:bg-sensus-100">
                      + {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <fieldset>
              <legend className="label">Quais temas se relacionam com o que você está vivendo? (opcional)</legend>
              <div className="flex flex-wrap gap-2">
                {TEMAS.map((t) => {
                  const ativo = d.temas.includes(t);
                  return (
                    <button key={t} type="button" aria-pressed={ativo} onClick={() => set("temas", toggle(d.temas, t))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                        ativo ? "border-sensus-700 bg-sensus-700 text-white" : "border-line bg-white hover:bg-sensus-50"
                      }`}>
                      {ativo && <Check className="size-3.5" />} {t}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="intensidade" className="label">
                O quanto isso tem afetado sua rotina? <span className="font-semibold text-sensus-700">{d.intensidade}/5</span>
              </label>
              <input id="intensidade" type="range" min={1} max={5} step={1} value={d.intensidade}
                onChange={(e) => set("intensidade", Number(e.target.value))} className="w-full accent-sensus-700" />
              <div className="flex justify-between text-xs text-ink-soft"><span>Pouco</span><span>Muito</span></div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="duracao" className="label">Há quanto tempo?</label>
                <select id="duracao" className={`input ${erros.duracao ? "input-error" : ""}`} value={d.duracao}
                  onChange={(e) => set("duracao", e.target.value)}>
                  <option value="">Selecione…</option>
                  <option>Menos de 1 mês</option>
                  <option>De 1 a 6 meses</option>
                  <option>Mais de 6 meses</option>
                  <option>Mais de 1 ano</option>
                </select>
                {erro("duracao")}
              </div>
              <fieldset>
                <legend className="label">Já fez acompanhamento psicológico?</legend>
                <div className="flex gap-2">
                  {(["sim", "nao"] as const).map((v) => (
                    <button key={v} type="button" aria-pressed={d.terapiaAntes === v} onClick={() => set("terapiaAntes", v)}
                      className={`flex-1 rounded-lg border py-3 text-sm transition ${
                        d.terapiaAntes === v ? "border-sensus-700 bg-sensus-50 font-medium text-sensus-700" : "border-line bg-white"
                      }`}>
                      {v === "sim" ? "Sim" : "Não"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </>
        )}

        {/* ETAPA 3 — Bem-estar */}
        {etapa === 2 && (
          <>
            <fieldset>
              <legend className="label">Seu sono ou apetite mudaram nas últimas semanas?</legend>
              <div className="flex gap-2">
                {(["sim", "nao"] as const).map((v) => (
                  <button key={v} type="button" aria-pressed={d.sono === v} onClick={() => set("sono", v)}
                    className={`flex-1 rounded-lg border py-3 text-sm transition ${
                      d.sono === v ? "border-sensus-700 bg-sensus-50 font-medium text-sensus-700" : "border-line bg-white"
                    }`}>
                    {v === "sim" ? "Sim" : "Não"}
                  </button>
                ))}
              </div>
              {erro("sono")}
            </fieldset>

            <fieldset>
              <legend className="label">
                Nas últimas duas semanas, você teve pensamentos de se machucar ou de que seria melhor não estar vivo(a)?
              </legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {([
                  ["nao", "Não"],
                  ["as-vezes", "Às vezes"],
                  ["frequente", "Com frequência"],
                ] as const).map(([v, r]) => (
                  <button key={v} type="button" aria-pressed={d.risco === v} onClick={() => set("risco", v)}
                    className={`rounded-lg border py-3 text-sm transition ${
                      d.risco === v ? "border-sensus-700 bg-sensus-50 font-medium text-sensus-700" : "border-line bg-white"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
                <Lock className="size-3.5" /> Essa pergunta nos ajuda a priorizar quem precisa de cuidado mais rápido.
              </p>
            </fieldset>

            {mostrarApoio && <ApoioImediato />}

            <fieldset>
              <legend className="label">Modalidade preferida</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {([
                  ["presencial", "Presencial"],
                  ["online", "Online (vídeo)"],
                  ["indiferente", "Tanto faz"],
                ] as const).map(([v, r]) => (
                  <button key={v} type="button" aria-pressed={d.modalidade === v} onClick={() => set("modalidade", v)}
                    className={`rounded-lg border py-3 text-sm transition ${
                      d.modalidade === v ? "border-sensus-700 bg-sensus-50 font-medium text-sensus-700" : "border-line bg-white"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label">Períodos em que você pode ser atendido(a)</legend>
              <div className="flex flex-wrap gap-2">
                {(["Manhã", "Tarde", "Noite"] as Periodo[]).map((p) => {
                  const ativo = d.periodos.includes(p);
                  return (
                    <button key={p} type="button" aria-pressed={ativo} onClick={() => set("periodos", toggle(d.periodos, p))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm transition ${
                        ativo ? "border-sensus-700 bg-sensus-700 text-white" : "border-line bg-white hover:bg-sensus-50"
                      }`}>
                      {ativo && <Check className="size-3.5" />} {p}
                    </button>
                  );
                })}
              </div>
              {erro("periodos")}
            </fieldset>
          </>
        )}

        {/* ETAPA 4 — Revisão */}
        {etapa === 3 && (
          <>
            {mostrarApoio && <ApoioImediato />}

            <div className={`rounded-xl border p-5 ${PRIORIDADE_INFO[prioridade].classe}`}>
              <p className="font-semibold">{PRIORIDADE_INFO[prioridade].titulo}</p>
              <p className="mt-1 text-sm">{PRIORIDADE_INFO[prioridade].texto}</p>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-sensus-700">
                <Sparkles className="size-5" /> Atendimentos recomendados para você
              </h2>
              <p className="mt-1 text-sm text-ink-soft">Com base nas suas respostas. A equipe fará a confirmação final.</p>
              <ul className="mt-4 space-y-3">
                {recomendacoes.map(({ e, motivos }, i) => (
                  <li key={e.id} className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="badge bg-sensus-700 text-white">Melhor opção</span>}
                        <span className={`badge ${e.modalidade === "online" ? "badge-online" : "badge-presencial"}`}>
                          {e.modalidade === "online" ? "Online" : "Presencial"}
                        </span>
                      </div>
                      <p className="mt-1.5 font-semibold">{e.servico} · {e.supervisor}</p>
                      {motivos.length > 0 && <p className="text-sm text-ink-soft">{motivos.join(" · ")}</p>}
                    </div>
                    <Link href={`/agendamento/${e.id}`} className="text-sm font-medium text-sensus-700 hover:underline">
                      Ver horários →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid gap-x-6 gap-y-3 rounded-xl bg-cream p-5 text-sm sm:grid-cols-2">
              <Resumo t="Nome" v={d.nome} />
              <Resumo t="E-mail" v={d.email} />
              <Resumo t="Telefone" v={d.telefone} />
              <Resumo t="Curso / Vínculo" v={d.curso} />
              <Resumo t="Temas" v={d.temas.join(", ") || "—"} />
              <Resumo t="Impacto na rotina" v={`${d.intensidade}/5 · ${d.duracao}`} />
              <Resumo t="Modalidade" v={{ presencial: "Presencial", online: "Online (vídeo)", indiferente: "Tanto faz" }[d.modalidade]} />
              <Resumo t="Períodos" v={d.periodos.join(", ")} />
            </dl>

            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={d.consentimento} onChange={(e) => set("consentimento", e.target.checked)}
                className="mt-0.5 size-4 accent-sensus-700" />
              <span>
                Autorizo o uso dessas informações pela equipe da clínica-escola, sob sigilo profissional e conforme a LGPD,
                para fins de triagem e agendamento.
              </span>
            </label>
            {erro("consentimento")}
          </>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6">
        {etapa === 0 ? (
          <Link href="/" className="btn-ghost"><ArrowLeft className="size-4" /> Voltar</Link>
        ) : (
          <button type="button" onClick={voltar} className="btn-ghost"><ArrowLeft className="size-4" /> Voltar</button>
        )}
        {etapa < ETAPAS.length - 1 ? (
          <button type="button" onClick={avancar} className="btn-primary">
            Continuar <ArrowRight className="size-4" />
          </button>
        ) : (
          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Enviando…" : "Enviar Solicitação"} {!enviando && <Send className="size-4" />}
          </button>
        )}
      </div>
    </form>
  );
}

function Resumo({ t, v }: { t: string; v: string }) {
  return (
    <div>
      <dt className="text-ink-soft">{t}</dt>
      <dd className="font-medium break-words">{v}</dd>
    </div>
  );
}

function ApoioImediato() {
  return (
    <div className="rounded-xl border border-alert-600/30 bg-alert-50 p-5 text-sm text-ink" role="note">
      <p className="flex items-center gap-2 font-semibold text-alert-600">
        <TriangleAlert className="size-5" /> Você não está sozinho(a)
      </p>
      <p className="mt-2">
        Obrigado por compartilhar. Se você estiver em risco agora, procure ajuda imediatamente — esses serviços são
        gratuitos e funcionam 24h:
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="tel:188" className="inline-flex items-center gap-2 rounded-full bg-alert-600 px-4 py-2 font-semibold text-white">
          <Phone className="size-4" /> CVV · 188
        </a>
        <a href="tel:192" className="inline-flex items-center gap-2 rounded-full border border-alert-600 px-4 py-2 font-semibold text-alert-600">
          <Phone className="size-4" /> SAMU · 192
        </a>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-ink-soft">
          <HeartHandshake className="size-4" /> Sua triagem terá prioridade
        </span>
      </div>
    </div>
  );
}
