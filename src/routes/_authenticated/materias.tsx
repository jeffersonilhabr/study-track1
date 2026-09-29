/**
 * Matérias — página onde o usuário cadastra as matérias que está estudando
 * e vê o progresso das tarefas em cada uma.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTarefas } from "@/hooks/use-tarefas";
import { useMaterias } from "@/hooks/use-materias";

export const Route = createFileRoute("/_authenticated/materias")({
  head: () => ({
    meta: [
      { title: "Matérias — StudyTrack" },
      { name: "description", content: "Cadastre as matérias que você estuda e acompanhe o progresso de cada uma." },
      { property: "og:title", content: "Matérias — StudyTrack" },
      { property: "og:description", content: "Cadastre suas matérias e veja o progresso em cada uma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaMaterias,
});

function PaginaMaterias() {
  const { tarefas } = useTarefas();
  const { materias, adicionarMateria, removerMateria } = useMaterias();
  const [nova, setNova] = useState("");

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    adicionarMateria(nova);
    setNova("");
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="fade-up">
          <h1 className="text-3xl font-bold">Matérias</h1>
          <p className="mt-1 text-muted-foreground">
            Cadastre o que você está estudando e acompanhe o progresso em cada matéria.
          </p>
        </div>

        {/* Formulário para adicionar uma matéria */}
        <form
          onSubmit={enviar}
          className="fade-up mt-6 flex flex-wrap gap-2 rounded-xl border bg-card p-4 shadow-sm"
        >
          <input
            value={nova}
            onChange={(e) => setNova(e.target.value)}
            placeholder="Ex: Matemática Discreta"
            className="min-w-48 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Adicionar matéria
          </button>
        </form>

        {materias.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
            Nenhuma matéria cadastrada ainda. Adicione a primeira acima!
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materias.map((materia) => {
              // Conta as tarefas dessa matéria.
              const daMateria = tarefas.filter((t) => t.materia === materia);
              const feitas = daMateria.filter((t) => t.concluida).length;
              const percentual =
                daMateria.length === 0 ? 0 : Math.round((feitas / daMateria.length) * 100);

              return (
                <div key={materia} className="fade-up rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <BookOpen className="size-5" />
                    </span>
                    <h2 className="flex-1 text-lg font-semibold leading-tight">{materia}</h2>
                    <button
                      onClick={() => removerMateria(materia)}
                      aria-label={`Remover ${materia}`}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {daMateria.length === 0
                      ? "Nenhuma tarefa ainda"
                      : `${feitas} de ${daMateria.length} tarefas concluídas`}
                  </p>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="progress-fill h-full rounded-full bg-primary"
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
