/**
 * useMaterias — hook que gerencia a lista de matérias estudadas.
 * As matérias ficam salvas no localStorage do navegador.
 */
import { useEffect, useState } from "react";
import { carregarMaterias, salvarMaterias } from "@/lib/studytrack";

export function useMaterias() {
  const [materias, setMaterias] = useState<string[]>([]);

  // Carregamos depois que a página abre no navegador (o servidor não tem localStorage).
  useEffect(() => {
    setMaterias(carregarMaterias());
  }, []);

  function atualizar(novas: string[]) {
    setMaterias(novas);
    salvarMaterias(novas);
  }

  /** Adiciona uma matéria nova (ignora vazios e repetidos). */
  function adicionarMateria(nome: string) {
    const limpo = nome.trim();
    if (!limpo) return;
    if (materias.some((m) => m.toLowerCase() === limpo.toLowerCase())) return;
    atualizar([...materias, limpo]);
  }

  /** Remove uma matéria da lista. */
  function removerMateria(nome: string) {
    atualizar(materias.filter((m) => m !== nome));
  }

  return { materias, adicionarMateria, removerMateria };
}
