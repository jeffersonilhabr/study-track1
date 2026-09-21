/**
 * studytrack.ts
 * -------------
 * Este arquivo é o "coração" do StudyTrack.
 * Aqui ficam os tipos de dados, as matérias cadastradas e todas as
 * funções que leem e salvam as tarefas no localStorage do navegador.
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

// Matérias fictícias iniciais do sistema.
export const MATERIAS: string[] = [
  "Estruturas de Dados",
  "Programação em C",
  "HTML e CSS",
  "JavaScript",
  "Banco de Dados",
];

// Nome da "gaveta" onde salvamos as tarefas no navegador.
const CHAVE_STORAGE = "studytrack-tarefas";

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
  const salvo = localStorage.getItem(CHAVE_STORAGE);
  if (!salvo) {
    const iniciais = tarefasIniciais();
    salvarTarefas(iniciais);
    return iniciais;
  }
  try {
    return JSON.parse(salvo) as Tarefa[];
  } catch {
    // Se o conteúdo salvo estiver corrompido, começamos do zero.
    return [];
  }
}

/** Salva a lista completa de tarefas no navegador. */
export function salvarTarefas(tarefas: Tarefa[]): void {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}

/** Formata uma data "AAAA-MM-DD" para o padrão brasileiro "DD/MM/AAAA". */
export function formatarData(data: string): string {
  if (!data) return "Sem prazo";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
