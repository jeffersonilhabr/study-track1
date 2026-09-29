/**
 * Dashboard — página inicial do StudyTrack.
 * Mostra as estatísticas gerais e a lista de tarefas recentes.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookCopy, CircleDashed, CheckCircle2, TrendingUp, Plus, Trophy } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CartaoEstatistica } from "@/components/CartaoEstatistica";
import { CartaoTarefa } from "@/components/CartaoTarefa";
import { FormularioTarefa } from "@/components/FormularioTarefa";
import { useTarefas } from "@/hooks/use-tarefas";
import { useMaterias } from "@/hooks/use-materias";
import { usePontos } from "@/hooks/use-pontos";
import type { Tarefa } from "@/lib/studytrack";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "StudyTrack — Organize seus estudos" },
      { name: "description", content: "Dashboard do StudyTrack: acompanhe suas matérias e tarefas de estudo." },
      { property: "og:title", content: "StudyTrack — Organize seus estudos" },
      { property: "og:description", content: "Acompanhe suas matérias e tarefas de estudo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tarefas, adicionarTarefa, editarTarefa, excluirTarefa, alternarConcluida } = useTarefas();
  const { materias } = useMaterias();
  const { pontos } = usePontos();
  const [formAberto, setFormAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

  // Cálculos das estatísticas exibidas nos cards.
  const pendentes = tarefas.filter((t) => !t.concluida).length;
  const concluidas = tarefas.length - pendentes;
  const percentual = tarefas.length === 0 ? 0 : Math.round((concluidas / tarefas.length) * 100);

  function salvar(dados: Omit<Tarefa, "id">) {
    if (tarefaEditando) editarTarefa(tarefaEditando.id, dados);
    else adicionarTarefa(dados);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Saudação */}
        <section className="fade-up">
          <h1 className="text-3xl font-bold sm:text-4xl">Olá! 👋</h1>
          <p className="mt-2 text-muted-foreground">
            Organize seus estudos e acompanhe seu progresso.
          </p>
        </section>

        {/* Cards de estatísticas */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <CartaoEstatistica rotulo="matérias" valor={materias.length} icone={BookCopy} />
          <CartaoEstatistica rotulo="tarefas pendentes" valor={pendentes} icone={CircleDashed} />
          <CartaoEstatistica rotulo="tarefas concluídas" valor={concluidas} icone={CheckCircle2} />
          <CartaoEstatistica rotulo="concluído" valor={`${percentual}%`} icone={TrendingUp} />
          <CartaoEstatistica rotulo="pontos" valor={pontos} icone={Trophy} />
        </section>

        {/* Barra de progresso geral */}
        <section className="fade-up mt-6 rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Progresso geral</span>
            <span className="text-muted-foreground">{percentual}% concluído</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="progress-fill h-full rounded-full bg-primary" style={{ width: `${percentual}%` }} />
          </div>
        </section>

        {/* Lista de tarefas */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Tarefas de estudo</h2>
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

          {tarefas.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
              Nenhuma tarefa ainda. Clique em "+ Nova tarefa" para começar!
            </p>
          ) : (
            <div className="space-y-3">
              {/* Mostramos apenas as 5 mais recentes; a lista completa fica em /tarefas */}
              {tarefas.slice(-5).reverse().map((tarefa) => (
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
              ))}
            </div>
          )}

          {tarefas.length > 5 && (
            <Link
              to="/tarefas"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Ver todas as tarefas →
            </Link>
          )}
        </section>
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
