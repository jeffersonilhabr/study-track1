/**
 * Página inicial pública — apresenta o StudyTrack e convida a entrar.
 * Quem já está logado vai direto para o Dashboard.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenCheck, ListChecks, Trophy, BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyTrack — Organize seus estudos" },
      {
        name: "description",
        content: "Organize matérias, tarefas de estudo e pratique com exercícios que valem pontos.",
      },
      { property: "og:title", content: "StudyTrack — Organize seus estudos" },
      {
        property: "og:description",
        content: "Organize matérias, tarefas de estudo e pratique com exercícios que valem pontos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaInicial,
});

const recursos = [
  {
    icone: BookOpen,
    titulo: "Suas matérias",
    texto: "Cadastre o que você está estudando e acompanhe o progresso de cada uma.",
  },
  {
    icone: ListChecks,
    titulo: "Tarefas de estudo",
    texto: "Crie tarefas com prazo e status, e marque como concluídas ao terminar.",
  },
  {
    icone: Trophy,
    titulo: "Exercícios com pontos",
    texto: "Peça exercícios por matéria, responda e acumule pontos a cada acerto.",
  },
];

function PaginaInicial() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpenCheck className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold">StudyTrack</span>
          </span>
          <Link
            to="/auth"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16">
        <section className="fade-up max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Organize seus estudos e ganhe pontos praticando
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            O StudyTrack ajuda você a acompanhar matérias e tarefas, e a praticar com
            exercícios que valem pontos — tudo em um lugar simples.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Começar agora
          </Link>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {recursos.map((recurso) => (
            <div key={recurso.titulo} className="fade-up rounded-xl border bg-card p-5 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <recurso.icone className="size-5" />
              </span>
              <h2 className="mt-3 text-lg font-semibold">{recurso.titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{recurso.texto}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
