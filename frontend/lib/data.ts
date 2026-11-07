// Dados mockados — somente front-end. Substituir por chamadas à API quando o back-end existir.

export type Modalidade = "presencial" | "online";

export type TipoServico =
  | "Atendimento Individual"
  | "Apoio Psicológico"
  | "Terapia em Grupo"
  | "Apoio Acadêmico";

export type Requisito = "triagem" | "pronto" | "edital";

export interface Especialista {
  id: string;
  servico: TipoServico;
  modalidade: Modalidade;
  descricao: string;
  supervisor: string;
  estagiario?: string;
  local: string;
  requisito: Requisito;
  /** Dias da semana (0 = domingo … 6 = sábado) em que há atendimento */
  dias: number[];
  /** Horários oferecidos nesses dias */
  horas: string[];
  abordagem: string;
  temas: string[];
}

export const TIPOS_SERVICO: TipoServico[] = [
  "Atendimento Individual",
  "Apoio Psicológico",
  "Terapia em Grupo",
  "Apoio Acadêmico",
];

export const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export const REQUISITO_INFO: Record<Requisito, { texto: string; tom: "aviso" | "ok" }> = {
  triagem: { texto: "Requer Triagem Prévia", tom: "aviso" },
  pronto: { texto: "Pronto Atendimento", tom: "ok" },
  edital: { texto: "Requer Inscrição no Edital", tom: "aviso" },
};

export const ESPECIALISTAS: Especialista[] = [
  {
    id: "individual-elena",
    servico: "Atendimento Individual",
    modalidade: "presencial",
    descricao: "Terapia focada no desenvolvimento pessoal e superação de desafios acadêmicos.",
    supervisor: "Dra. Elena Costa",
    estagiario: "Lucas M.",
    local: "Campus Central, Sala 304",
    requisito: "triagem",
    dias: [2, 4],
    horas: ["08:00", "09:00", "10:00", "11:00"],
    abordagem: "Terapia Cognitivo-Comportamental",
    temas: ["Ansiedade", "Estresse", "Vida Acadêmica"],
  },
  {
    id: "apoio-ricardo",
    servico: "Apoio Psicológico",
    modalidade: "online",
    descricao: "Sessões remotas para orientação breve e acolhimento emocional.",
    supervisor: "Dr. Ricardo S.",
    estagiario: "Ana R.",
    local: "Plataforma Virtual Segura",
    requisito: "pronto",
    dias: [1, 3, 5],
    horas: ["14:00", "15:00", "16:00", "17:00"],
    abordagem: "Plantão Psicológico / Escuta Qualificada",
    temas: ["Ansiedade", "Relacionamentos", "Autoestima"],
  },
  {
    id: "grupo-martins",
    servico: "Terapia em Grupo",
    modalidade: "presencial",
    descricao: "Grupos de vivência sobre ansiedade acadêmica e transição de carreira.",
    supervisor: "Profa. Martins",
    local: "Anexo Sul, Sala de Práticas A",
    requisito: "edital",
    dias: [3],
    horas: ["18:30"],
    abordagem: "Psicodrama e Grupos Operativos",
    temas: ["Ansiedade", "Vida Acadêmica"],
  },
  {
    id: "individual-paulo",
    servico: "Atendimento Individual",
    modalidade: "online",
    descricao: "Acompanhamento psicológico por videochamada, com a mesma qualidade e sigilo do presencial.",
    supervisor: "Dr. Paulo Henrique",
    estagiario: "Beatriz L.",
    local: "Plataforma Virtual Segura",
    requisito: "triagem",
    dias: [1, 2, 4],
    horas: ["19:00", "20:00"],
    abordagem: "Psicanálise",
    temas: ["Depressão", "Relacionamentos", "Autoestima"],
  },
  {
    id: "academico-juliana",
    servico: "Apoio Acadêmico",
    modalidade: "presencial",
    descricao: "Suporte voltado aos desafios da vida universitária: rotina, estresse, ansiedade e desempenho.",
    supervisor: "Profa. Juliana Prado",
    estagiario: "Rafael T.",
    local: "Campus Central, Sala 210",
    requisito: "pronto",
    dias: [1, 3],
    horas: ["10:00", "11:00", "13:30"],
    abordagem: "Orientação Psicopedagógica",
    temas: ["Vida Acadêmica", "Estresse"],
  },
  {
    id: "grupo-online-carla",
    servico: "Terapia em Grupo",
    modalidade: "online",
    descricao: "Rodas de conversa online sobre autocuidado, sono e equilíbrio emocional.",
    supervisor: "Dra. Carla Nunes",
    estagiario: "Mariana F.",
    local: "Plataforma Virtual Segura",
    requisito: "pronto",
    dias: [5],
    horas: ["17:00"],
    abordagem: "Terapia Humanista",
    temas: ["Estresse", "Depressão", "Autoestima"],
  },
];

export function getEspecialista(id: string) {
  return ESPECIALISTAS.find((e) => e.id === id);
}

export function textoDisponibilidade(e: Especialista) {
  const periodo = (h: string) => {
    const hora = Number(h.slice(0, 2));
    return hora < 12 ? "Manhã" : hora < 18 ? "Tarde" : "Noite";
  };
  const periodos = Array.from(new Set(e.horas.map(periodo)));
  return `${e.dias.map((d) => DIAS_SEMANA[d]).join(", ")} · ${periodos.join(", ")}`;
}

/** Próximas datas (a partir de amanhã) em que o especialista atende. */
export function proximasDatas(e: Especialista, quantidade = 8): Date[] {
  const datas: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (datas.length < quantidade) {
    d.setDate(d.getDate() + 1);
    if (e.dias.includes(d.getDay())) datas.push(new Date(d));
  }
  return datas;
}

export const TEMAS = ["Ansiedade", "Depressão", "Estresse", "Vida Acadêmica", "Relacionamentos", "Autoestima", "Luto", "Sono", "Outros"];

// Utilitários de formatação
export function mascaraTelefone(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : "";
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

export function mascaraCPF(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  return n
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
