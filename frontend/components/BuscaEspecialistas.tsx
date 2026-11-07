"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, SearchX } from "lucide-react";
import EspecialistaCard from "./EspecialistaCard";
import { ESPECIALISTAS, TIPOS_SERVICO, textoDisponibilidade, type Modalidade } from "@/lib/data";

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function BuscaEspecialistas() {
  const [tipo, setTipo] = useState<string>("todos");
  const [modalidade, setModalidade] = useState<"todas" | Modalidade>("todas");
  const [busca, setBusca] = useState("");

  const resultados = useMemo(() => {
    const termos = normalizar(busca).split(/[\s,]+/).filter(Boolean);
    return ESPECIALISTAS.filter((e) => {
      if (tipo !== "todos" && e.servico !== tipo) return false;
      if (modalidade !== "todas" && e.modalidade !== modalidade) return false;
      if (!termos.length) return true;
      const alvo = normalizar(
        [e.servico, e.supervisor, e.estagiario, e.local, e.abordagem, e.temas.join(" "), textoDisponibilidade(e)].join(" ")
      );
      return termos.every((t) => alvo.includes(t));
    });
  }, [tipo, modalidade, busca]);

  const limpar = () => {
    setTipo("todos");
    setModalidade("todas");
    setBusca("");
  };

  return (
    <>
      <section className="container-sensus mt-16 scroll-mt-28" id="busca" aria-labelledby="busca-titulo">
        <div className="card p-6 sm:p-9">
          <h2 id="busca-titulo" className="text-2xl font-semibold text-sensus-700">
            Encontre um Horário
          </h2>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="tipo" className="label-caps">Tipo de Serviço</label>
              <div className="relative">
                <select id="tipo" value={tipo} onChange={(ev) => setTipo(ev.target.value)} className="input appearance-none bg-cream pr-10">
                  <option value="todos">Todos os serviços</option>
                  {TIPOS_SERVICO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
              </div>
            </div>

            <div>
              <span id="modalidade-label" className="label-caps">Modalidade</span>
              <div role="radiogroup" aria-labelledby="modalidade-label" className="grid grid-cols-3 rounded-lg border border-line bg-cream p-1">
                {([
                  ["todas", "Todas"],
                  ["presencial", "Presencial"],
                  ["online", "Vídeo"],
                ] as const).map(([valor, rotulo]) => (
                  <button
                    key={valor}
                    type="button"
                    role="radio"
                    aria-checked={modalidade === valor}
                    onClick={() => setModalidade(valor)}
                    className={`rounded-md py-2.5 text-[15px] font-medium transition ${
                      modalidade === valor ? "bg-sensus-700 text-white shadow-sm" : "text-ink-soft hover:bg-white"
                    }`}
                  >
                    {rotulo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="disp" className="label-caps">Disponibilidade / Busca</label>
              <div className="relative">
                <input
                  id="disp"
                  type="search"
                  value={busca}
                  onChange={(ev) => setBusca(ev.target.value)}
                  placeholder="Ex: Terça-feira, Manhã, Ansiedade"
                  className="input bg-cream pr-11"
                />
                <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-sensus mt-16" aria-labelledby="horarios-titulo" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="horarios-titulo" className="section-title">Horários Disponíveis</h2>
          <span className="rounded-full bg-mist px-4 py-1 text-xs font-medium text-ink">
            Mostrando {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        {resultados.length ? (
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resultados.map((e) => (
              <EspecialistaCard key={e.id} e={e} />
            ))}
          </div>
        ) : (
          <div className="card mt-7 flex flex-col items-center gap-3 px-6 py-14 text-center">
            <SearchX className="size-10 text-sensus-300" />
            <p className="font-medium text-ink">Nenhum horário encontrado com esses filtros.</p>
            <button type="button" onClick={limpar} className="btn-ghost">Limpar filtros</button>
          </div>
        )}
      </section>
    </>
  );
}
