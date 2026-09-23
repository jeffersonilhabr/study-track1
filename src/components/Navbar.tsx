/**
 * Navbar — barra de navegação no topo de todas as páginas.
 * Mostra o nome do sistema e os links: Dashboard, Tarefas e Matérias.
 */
import { Link } from "@tanstack/react-router";
import { BookOpenCheck } from "lucide-react";

const links = [
  { para: "/", rotulo: "Dashboard" },
  { para: "/tarefas", rotulo: "Tarefas" },
  { para: "/materias", rotulo: "Matérias" },
  { para: "/exercicios", rotulo: "Exercícios" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenCheck className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold">StudyTrack</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.para}
              to={link.para}
              // A página ativa fica destacada para o usuário saber onde está.
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: link.para === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.rotulo}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
