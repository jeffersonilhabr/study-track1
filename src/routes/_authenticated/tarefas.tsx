/**
 * Tarefas — página com a lista completa de tarefas e os filtros
 * por status (todas, pendentes, concluídas) e por matéria.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CartaoTarefa } from "@/components/CartaoTarefa";
import { FormularioTarefa } from "@/components/FormularioTarefa";
import { useTarefas } from "@/hooks/use-tarefas";
import { useMaterias } from "@/hooks/use-materias";
import type { Tarefa } from "@/lib/studytrack";

export const Route = createFileRoute("/_authenticated/tarefas")({
  head: () => ({
    meta: [
      { title: "Tarefas — StudyTrack" },
      { name: "description", content: "Gerencie suas tarefas de estudo: criar, editar, concluir e excluir." },
      { property: "og:title", content: "Tarefas — StudyTrack" },
      { property: "og:description", content: "Gerencie suas tarefas de estudo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaTarefas,
});

type FiltroStatus = "todas" | "pendentes" | "concluidas";

function PaginaTarefas() {
  const { tarefas, adicionarTarefa, editarTarefa, excluirTarefa, alternarConcluida } = useTarefas();
  const { materias } = useMaterias();
  const [formAberto, setFormAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

  // Filtros escolhidos pelo usuário.
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todas");
  const [filtroMateria, setFiltroMateria] = useState<string>("todas");

  // Aplica os dois filtros sobre a lista completa.
  const tarefasFiltradas = tarefas.filter((t) => {
    const passaStatus =
      filtroStatus === "todas" ||
      (filtroStatus === "pendentes" && !t.concluida) ||
      (filtroStatus === "concluidas" && t.concluida);
    const passaMateria = filtroMateria === "todas" || t.materia === filtroMateria;
    return passaStatus && passaMateria;
  });

  function salvar(dados: Omit<Tarefa, "id">) {
    if (tarefaEditando) editarTarefa(tarefaEditando.id, dados);
    else adicionarTarefa(dados);
  }

  const botoesStatus: { valor: FiltroStatus; rotulo: string }[] = [
    { valor: "todas", rotulo: "Todas" },
    { valor: "pendentes", rotulo: "Pendentes" },
    { valor: "concluidas", rotulo: "Concluídas" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="fade-up flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="mt-1 text-muted-foreground">Gerencie suas tarefas de estudo.</p>
          </div>
          <button
            onClick={() => {
              setTarefaEditando(null);
              setFormAberto(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Nova tarefa
          </button>
        </div>

        {/* Filtros */}
        <div className="fade-up mt-6 flex flex-wrap items-center gap-2">
          {botoesStatus.map((botao) => (
            <button
              key={botao.valor}
              onClick={() => setFiltroStatus(botao.valor)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filtroStatus === botao.valor
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {botao.rotulo}
            </button>
          ))}

          {/* Filtro por matéria */}
          <select
            value={filtroMateria}
            onChange={(e) => setFiltroMateria(e.target.value)}
            className="ml-auto rounded-full border bg-card px-4 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todas">Todas as matérias</option>
            {materias.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Lista filtrada */}
        <div className="mt-6 space-y-3">
          {tarefasFiltradas.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
              Nenhuma tarefa encontrada com esses filtros.
            </p>
          ) : (
            tarefasFiltradas.map((tarefa) => (
              <CartaoTarefa
                key={tarefa.id}
                tarefa={tarefa}
                aoAlternar={alternarConcluida}
                aoEditar={(t) => {
                  setTarefaEditando(t);
                  setFormAberto(true);
                }}
                aoExcluir={excluirTarefa}
              />
            ))
          )}
        </div>
      </main>

      <FormularioTarefa
        aberto={formAberto}
        tarefaEditando={tarefaEditando}
        aoFechar={() => setFormAberto(false)}
        aoSalvar={salvar}
      />
    </div>
  );
}
