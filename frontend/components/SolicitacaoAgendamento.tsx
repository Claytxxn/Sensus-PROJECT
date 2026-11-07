"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CircleCheck,
  Clock,
  GraduationCap,
  IdCard,
  Info,
  Link2,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { DIAS_SEMANA, REQUISITO_INFO, proximasDatas, type Especialista } from "@/lib/data";

const fmtDia = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
const fmtCompleto = (d: Date) =>
  d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

export default function SolicitacaoAgendamento({ e }: { e: Especialista }) {
  // Calculado só no cliente para evitar divergência de datas entre servidor e navegador
  const [datas, setDatas] = useState<Date[]>([]);
  useEffect(() => setDatas(proximasDatas(e, 8)), [e]);
  const [data, setData] = useState<Date | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [primeiraVez, setPrimeiraVez] = useState<"sim" | "nao">("sim");
  const [obs, setObs] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const online = e.modalidade === "online";
  const req = REQUISITO_INFO[e.requisito];
  const precisaTriagem = e.requisito === "triagem" && primeiraVez === "sim";
  const podeEnviar = e.requisito === "edital" ? true : Boolean(data && hora);

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!podeEnviar) return;
    setEnviando(true);
    // Simulação — sem back-end
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  };

  if (enviado) {
    return (
      <div className="container-sensus py-16">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sensus-50">
            <CircleCheck className="size-9 text-sensus-700" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-sensus-700">Solicitação enviada!</h1>
          <p className="mt-3 text-ink-soft">
            {e.requisito === "edital"
              ? "Sua manifestação de interesse no grupo foi registrada. Avisaremos quando o edital de inscrição abrir."
              : "Sua solicitação foi recebida pela equipe da clínica. Você receberá a confirmação por e-mail em até 48h úteis."}
          </p>

          {data && hora && (
            <dl className="mx-auto mt-8 grid max-w-md gap-3 rounded-xl bg-cream p-5 text-left text-sm">
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Serviço</dt><dd className="font-medium">{e.servico}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Data</dt><dd className="font-medium capitalize">{fmtCompleto(data)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Horário</dt><dd className="font-medium">{hora}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Modalidade</dt><dd className="font-medium">{online ? "Online (vídeo)" : "Presencial"}</dd></div>
            </dl>
          )}

          {precisaTriagem ? (
            <div className="mt-8 rounded-xl border border-sand-200 bg-sand-100/60 p-5 text-left">
              <p className="flex items-center gap-2 font-semibold text-sand-800">
                <Info className="size-5" /> Próximo passo: triagem
              </p>
              <p className="mt-1 text-sm text-sand-800">
                Este atendimento requer triagem prévia. Preencha o formulário para que possamos confirmar seu horário.
              </p>
              <Link href={`/triagem?especialista=${e.id}`} className="btn-primary mt-4">
                Preencher Triagem <Send className="size-4" />
              </Link>
            </div>
          ) : (
            <Link href="/" className="btn-primary mt-8">Voltar aos agendamentos</Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-sensus py-12">
      <Link href="/" className="btn-ghost -ml-4">
        <ArrowLeft className="size-4" /> Voltar aos horários
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={enviar} className="card p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-sensus-700">Solicitação de Agendamento</h1>
          <p className="mt-2 text-ink-soft">
            {e.requisito === "edital"
              ? "Este grupo funciona por edital. Registre seu interesse e escolha, se quiser, um encontro de acolhimento."
              : "Escolha a data e o horário de sua preferência. A equipe confirmará a disponibilidade."}
          </p>

          {/* Datas */}
          <fieldset className="mt-9">
            <legend className="label flex items-center gap-2 text-base">
              <CalendarCheck className="size-5 text-sensus-700" /> 1. Escolha a data
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {datas.map((d) => {
                const ativo = data?.getTime() === d.getTime();
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => {
                      setData(d);
                      setHora(null);
                    }}
                    aria-pressed={ativo}
                    className={`rounded-xl border px-3 py-3 text-center transition ${
                      ativo
                        ? "border-sensus-700 bg-sensus-700 text-white shadow"
                        : "border-line bg-white hover:border-sensus-400 hover:bg-sensus-50"
                    }`}
                  >
                    <span className={`block text-xs ${ativo ? "text-sensus-100" : "text-ink-soft"}`}>
                      {DIAS_SEMANA[d.getDay()].replace("-feira", "")}
                    </span>
                    <span className="block text-lg font-semibold">{fmtDia(d)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Horários */}
          <fieldset className="mt-8" disabled={!data}>
            <legend className="label flex items-center gap-2 text-base">
              <Clock className="size-5 text-sensus-700" /> 2. Escolha o horário
            </legend>
            {data ? (
              <div className="flex flex-wrap gap-3">
                {e.horas.map((h, i) => {
                  // simula alguns horários ocupados de forma determinística
                  const ocupado = (data.getDate() + i) % 4 === 0;
                  const ativo = hora === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setHora(h)}
                      aria-pressed={ativo}
                      className={`min-w-24 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                        ocupado
                          ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 line-through"
                          : ativo
                            ? "border-sensus-700 bg-sensus-700 text-white"
                            : "border-line bg-white hover:border-sensus-400 hover:bg-sensus-50"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">Selecione uma data para ver os horários.</p>
            )}
          </fieldset>

          {/* Informações */}
          <fieldset className="mt-8">
            <legend className="label text-base">3. Informações adicionais</legend>
            <p className="mb-3 text-sm text-ink-soft">É seu primeiro atendimento na clínica?</p>
            <div className="flex gap-3">
              {(["sim", "nao"] as const).map((v) => (
                <label
                  key={v}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm transition ${
                    primeiraVez === v ? "border-sensus-700 bg-sensus-50 text-sensus-700" : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    name="primeira"
                    value={v}
                    checked={primeiraVez === v}
                    onChange={() => setPrimeiraVez(v)}
                    className="accent-sensus-700"
                  />
                  {v === "sim" ? "Sim" : "Não, já sou paciente"}
                </label>
              ))}
            </div>

            <label htmlFor="obs" className="label mt-6">Observações (opcional)</label>
            <textarea
              id="obs"
              rows={3}
              value={obs}
              onChange={(ev) => setObs(ev.target.value)}
              placeholder="Alguma necessidade de acessibilidade ou informação que queira compartilhar?"
              className="input resize-y"
            />
          </fieldset>

          {precisaTriagem && (
            <div className="mt-6 flex gap-3 rounded-xl border border-sand-200 bg-sand-100/60 p-4 text-sm text-sand-800">
              <Sparkles className="mt-0.5 size-5 shrink-0" />
              <p>
                Após enviar, você será direcionado(a) à <strong>Triagem Inteligente</strong> — leva cerca de 3 minutos e
                ajuda a equipe a preparar seu atendimento.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center">
            <Link href="/" className="btn-ghost justify-center">
              <ArrowLeft className="size-4" /> Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={!podeEnviar || enviando}>
              {enviando ? "Enviando…" : e.requisito === "edital" ? "Registrar Interesse" : "Solicitar Agendamento"}
              {!enviando && <Send className="size-4" />}
            </button>
          </div>
        </form>

        {/* Resumo */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-7">
            <span className={`badge ${online ? "badge-online" : "badge-presencial"}`}>
              {online ? "Online · Vídeo" : "Presencial"}
            </span>
            <h2 className="mt-4 text-xl font-semibold">{e.servico}</h2>
            <p className="mt-1 text-sm text-ink-soft">{e.abordagem}</p>

            <ul className="mt-5 space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5"><IdCard className="size-4 text-ink-soft" /> {e.supervisor}</li>
              {e.estagiario && (
                <li className="flex items-center gap-2.5"><GraduationCap className="size-4 text-ink-soft" /> {e.estagiario}</li>
              )}
              <li className="flex items-center gap-2.5">
                {online ? <Link2 className="size-4 text-ink-soft" /> : <MapPin className="size-4 text-ink-soft" />} {e.local}
              </li>
              <li className={`flex items-center gap-2.5 ${req.tom === "ok" ? "text-sensus-700" : "text-sand-700"}`}>
                <Info className="size-4" /> {req.texto}
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {e.temas.map((t) => (
                <span key={t} className="rounded-full bg-cream px-3 py-1 text-xs text-ink-soft">{t}</span>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-sensus-50 p-4 text-sm">
              <p className="font-semibold text-sensus-800">Sua escolha</p>
              <p className="mt-1 capitalize text-sensus-700">{data ? fmtCompleto(data) : "Data não selecionada"}</p>
              <p className="text-sensus-700">{hora ?? "Horário não selecionado"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
