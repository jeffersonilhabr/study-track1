/**
 * studytrack.ts
 * -------------
 * Este arquivo é o "coração" do StudyTrack.
 * Aqui ficam os tipos de dados e todas as funções que leem e salvam
 * as informações no localStorage do navegador.
 *
 * localStorage é uma memória simples do navegador: os dados continuam
 * salvos mesmo depois de fechar e abrir a página.
 */

// Uma tarefa de estudo tem estas informações:
export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  materia: string;
  prazo: string; // data no formato "AAAA-MM-DD" (vem do input type="date")
  concluida: boolean;
}

// Matérias sugeridas quando o usuário abre o app pela primeira vez.
export const MATERIAS_INICIAIS: string[] = [
  "Estruturas de Dados",
  "Programação em C",
  "HTML e CSS",
  "JavaScript",
  "Banco de Dados",
];

// Compatibilidade com o código antigo (lista fixa de matérias).
export const MATERIAS = MATERIAS_INICIAIS;

// Nomes das "gavetas" onde salvamos as informações no navegador.
const CHAVE_TAREFAS = "studytrack-tarefas";
const CHAVE_MATERIAS = "studytrack-materias";
const CHAVE_PONTOS = "studytrack-pontos";

/** Só existe navegador no lado do cliente — no servidor não há localStorage. */
function temNavegador(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Lê um valor salvo em JSON; devolve o padrão se não existir ou estiver inválido. */
function ler<T>(chave: string, padrao: T): T {
  if (!temNavegador()) return padrao;
  const salvo = localStorage.getItem(chave);
  if (!salvo) return padrao;
  try {
    return JSON.parse(salvo) as T;
  } catch {
    return padrao;
  }
}

/** Salva qualquer valor em JSON no navegador. */
function salvar(chave: string, valor: unknown): void {
  if (!temNavegador()) return;
  localStorage.setItem(chave, JSON.stringify(valor));
}

// Tarefas de exemplo, usadas apenas na primeira vez que o usuário abre o app.
function tarefasIniciais(): Tarefa[] {
  return [
    {
      id: crypto.randomUUID(),
      titulo: "Revisar listas encadeadas",
      descricao: "Refazer os exercícios 3 e 4 da apostila.",
      materia: "Estruturas de Dados",
      prazo: "2026-09-25",
      concluida: false,
    },
    {
      id: crypto.randomUUID(),
      titulo: "Praticar ponteiros em C",
      descricao: "Escrever um programa que troca dois valores usando ponteiros.",
      materia: "Programação em C",
      prazo: "2026-09-28",
      concluida: false,
    },
    {
      id: crypto.randomUUID(),
      titulo: "Montar portfólio com Flexbox",
      descricao: "Criar a página inicial do portfólio pessoal.",
      materia: "HTML e CSS",
      prazo: "2026-09-20",
      concluida: true,
    },
  ];
}

/** Lê as tarefas salvas no navegador. Se não existir nada, cria os exemplos. */
export function carregarTarefas(): Tarefa[] {
  if (!temNavegador()) return [];
  const salvo = localStorage.getItem(CHAVE_TAREFAS);
  if (!salvo) {
    const iniciais = tarefasIniciais();
    salvarTarefas(iniciais);
    return iniciais;
  }
  return ler<Tarefa[]>(CHAVE_TAREFAS, []);
}

/** Salva a lista completa de tarefas no navegador. */
export function salvarTarefas(tarefas: Tarefa[]): void {
  salvar(CHAVE_TAREFAS, tarefas);
}

/** Lê as matérias salvas. Na primeira vez, usa a lista sugerida. */
export function carregarMaterias(): string[] {
  if (!temNavegador()) return [];
  const salvo = localStorage.getItem(CHAVE_MATERIAS);
  if (!salvo) {
    salvarMaterias(MATERIAS_INICIAIS);
    return MATERIAS_INICIAIS;
  }
  return ler<string[]>(CHAVE_MATERIAS, []);
}

/** Salva a lista de matérias no navegador. */
export function salvarMaterias(materias: string[]): void {
  salvar(CHAVE_MATERIAS, materias);
}

/** Quantos pontos o usuário já ganhou resolvendo exercícios. */
export function carregarPontos(): number {
  return ler<number>(CHAVE_PONTOS, 0);
}

/** Salva a pontuação do usuário. */
export function salvarPontos(pontos: number): void {
  salvar(CHAVE_PONTOS, pontos);
}

/** Formata uma data "AAAA-MM-DD" para o padrão brasileiro "DD/MM/AAAA". */
export function formatarData(data: string): string {
  if (!data) return "Sem prazo";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
