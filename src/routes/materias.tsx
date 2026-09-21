/**
 * Matérias — página que mostra as matérias cadastradas e,
 * para cada uma, quantas tarefas estão pendentes e concluídas.
 */
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTarefas } from "@/hooks/use-tarefas";
import { MATERIAS } from "@/lib/studytrack";

export const Route = createFileRoute("/materias")({
  head: () => ({
    meta: [
      { title: "Matérias — StudyTrack" },
      { name: "description", content: "Veja suas matérias cadastradas e o progresso em cada uma." },
      { property: "og:title", content: "Matérias — StudyTrack" },
      { property: "og:description", content: "Veja suas matérias e o progresso em cada uma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaMaterias,
});

function PaginaMaterias() {
  const { tarefas } = useTarefas();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="fade-up">
          <h1 className="text-3xl font-bold">Matérias</h1>
          <p className="mt-1 text-muted-foreground">
            Suas matérias cadastradas e o progresso em cada uma.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAS.map((materia) => {
            // Conta as tarefas dessa matéria.
            const daMateria = tarefas.filter((t) => t.materia === materia);
            const feitas = daMateria.filter((t) => t.concluida).length;
            const percentual =
              daMateria.length === 0 ? 0 : Math.round((feitas / daMateria.length) * 100);

            return (
              <div key={materia} className="fade-up rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <BookOpen className="size-5" />
                  </span>
                  <h2 className="text-lg font-semibold leading-tight">{materia}</h2>
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
      </main>
    </div>
  );
}
