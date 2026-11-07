// Lógica da Triagem Inteligente (executada no navegador, sem back-end).
import { ESPECIALISTAS, type Especialista, type Modalidade } from "./data";

export type Periodo = "Manhã" | "Tarde" | "Noite";
export type Risco = "nao" | "as-vezes" | "frequente";

export interface DadosTriagem {
  nome: string;
  email: string;
  telefone: string;
  curso: string;
  motivo: string;
  temas: string[];
  intensidade: number; // 1–5
  duracao: string;
  terapiaAntes: "sim" | "nao" | "";
  sono: "sim" | "nao" | "";
  risco: Risco;
  modalidade: Modalidade | "indiferente";
  periodos: Periodo[];
  consentimento: boolean;
}

export const TRIAGEM_INICIAL: DadosTriagem = {
  nome: "",
  email: "",
  telefone: "",
  curso: "",
  motivo: "",
  temas: [],
  intensidade: 3,
  duracao: "",
  terapiaAntes: "",
  sono: "",
  risco: "nao",
  modalidade: "indiferente",
  periodos: [],
  consentimento: false,
};

const PALAVRAS_TEMA: Record<string, string[]> = {
  Ansiedade: ["ansied", "ansios", "nervos", "panico", "pânico", "preocup", "aperto no peito"],
  Depressão: ["depress", "triste", "desanim", "vazio", "sem vontade", "choro", "chorando"],
  Estresse: ["estress", "sobrecarg", "cansad", "esgotad", "burnout", "pressao", "pressão"],
  "Vida Acadêmica": ["prova", "faculdade", "curso", "tcc", "estud", "nota", "semestre", "professor", "estágio", "estagio", "carreira"],
  Relacionamentos: ["namor", "termin", "familia", "família", "amig", "relacion", "briga", "pais"],
  Autoestima: ["autoestima", "inseguran", "insegur", "não sou capaz", "nao sou capaz", "me comparo", "aparência"],
  Luto: ["luto", "faleceu", "perdi", "morte de", "falecimento"],
  Sono: ["insonia", "insônia", "dormir", "sono", "pesadelo"],
};

const PALAVRAS_RISCO = [
  "suicid", "me matar", "tirar minha vida", "não quero viver", "nao quero viver", "me machucar",
  "me cortar", "acabar com tudo", "melhor morto", "melhor morta", "sumir para sempre",
];

const norm = (s: string) => s.toLowerCase();

/** Sugere temas a partir do texto livre do motivo da consulta. */
export function detectarTemas(texto: string): string[] {
  const t = norm(texto);
  return Object.entries(PALAVRAS_TEMA)
    .filter(([, palavras]) => palavras.some((p) => t.includes(p)))
    .map(([tema]) => tema);
}

export function textoIndicaRisco(texto: string) {
  const t = norm(texto);
  return PALAVRAS_RISCO.some((p) => t.includes(p));
}

export type Prioridade = "urgente" | "alta" | "rotina";

export function calcularPrioridade(d: DadosTriagem): Prioridade {
  if (d.risco === "frequente" || textoIndicaRisco(d.motivo)) return "urgente";
  if (d.risco === "as-vezes" || d.intensidade >= 4 || (d.sono === "sim" && d.intensidade >= 3)) return "alta";
  return "rotina";
}

export const PRIORIDADE_INFO: Record<Prioridade, { titulo: string; texto: string; classe: string }> = {
  urgente: {
    titulo: "Prioridade urgente",
    texto: "Sua solicitação será encaminhada imediatamente ao plantão psicológico. Se estiver em perigo agora, ligue 188 (CVV) ou 192 (SAMU).",
    classe: "border-alert-600/30 bg-alert-50 text-alert-600",
  },
  alta: {
    titulo: "Prioridade alta",
    texto: "Vamos priorizar seu contato. A equipe deve retornar em até 24h úteis.",
    classe: "border-sand-200 bg-sand-100/60 text-sand-800",
  },
  rotina: {
    titulo: "Atendimento de rotina",
    texto: "Sua solicitação entra na fila regular. O retorno ocorre em até 48h úteis.",
    classe: "border-sensus-200 bg-sensus-50 text-sensus-800",
  },
};

function periodoDe(h: string): Periodo {
  const hora = Number(h.slice(0, 2));
  return hora < 12 ? "Manhã" : hora < 18 ? "Tarde" : "Noite";
}

/** Ordena os atendimentos disponíveis pela compatibilidade com as respostas. */
export function recomendar(d: DadosTriagem, limite = 3): { e: Especialista; pontos: number; motivos: string[] }[] {
  const prioridade = calcularPrioridade(d);
  return ESPECIALISTAS.map((e) => {
    let pontos = 0;
    const motivos: string[] = [];

    const temasComuns = e.temas.filter((t) => d.temas.includes(t));
    if (temasComuns.length) {
      pontos += temasComuns.length * 3;
      motivos.push(`Trabalha com ${temasComuns.join(", ").toLowerCase()}`);
    }
    if (d.modalidade === "indiferente" || d.modalidade === e.modalidade) {
      pontos += 2;
      if (d.modalidade !== "indiferente") motivos.push(e.modalidade === "online" ? "Atendimento por vídeo" : "Atendimento presencial");
    } else {
      pontos -= 3;
    }
    const periodos = new Set(e.horas.map(periodoDe));
    const compat = d.periodos.filter((p) => periodos.has(p));
    if (compat.length) {
      pontos += 2;
      motivos.push(`Horários de ${compat.join("/").toLowerCase()}`);
    }
    if (prioridade !== "rotina" && e.requisito === "pronto") {
      pontos += 4;
      motivos.push("Pronto atendimento disponível");
    }
    if (e.requisito === "edital") pontos -= 1;
    if (d.temas.includes("Vida Acadêmica") && e.servico === "Apoio Acadêmico") pontos += 2;

    return { e, pontos, motivos };
  })
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite);
}
