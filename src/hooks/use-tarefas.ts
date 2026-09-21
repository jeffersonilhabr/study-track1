/**
 * useTarefas — hook que gerencia a lista de tarefas.
 *
 * Um "hook" é uma função do React que guarda estado e lógica reutilizável.
 * Aqui centralizamos: carregar, adicionar, editar, excluir e concluir tarefas.
 * Toda mudança é salva automaticamente no localStorage.
 */
import { useState } from "react";
import {
  carregarTarefas,
  salvarTarefas,
  type Tarefa,
} from "@/lib/studytrack";

export function useTarefas() {
  // O estado começa com o que estiver salvo no navegador.
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => carregarTarefas());

  // Função auxiliar: atualiza o estado E salva no navegador ao mesmo tempo.
  function atualizar(novasTarefas: Tarefa[]) {
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  }

  function adicionarTarefa(tarefa: Omit<Tarefa, "id">) {
    atualizar([...tarefas, { ...tarefa, id: crypto.randomUUID() }]);
  }

  function editarTarefa(id: string, dados: Omit<Tarefa, "id">) {
    atualizar(tarefas.map((t) => (t.id === id ? { ...dados, id } : t)));
  }

  function excluirTarefa(id: string) {
    atualizar(tarefas.filter((t) => t.id !== id));
  }

  // Marca/desmarca a tarefa como concluída.
  function alternarConcluida(id: string) {
    atualizar(
      tarefas.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)),
    );
  }

  return { tarefas, adicionarTarefa, editarTarefa, excluirTarefa, alternarConcluida };
}
