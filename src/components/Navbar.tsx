/**
 * Navbar — barra de navegação no topo das páginas internas.
 * Mostra o nome do sistema, os links das páginas e o botão de sair.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpenCheck, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { para: "/dashboard", rotulo: "Dashboard" },
  { para: "/tarefas", rotulo: "Tarefas" },
  { para: "/materias", rotulo: "Matérias" },
  { para: "/exercicios", rotulo: "Exercícios" },
  { para: "/assistente", rotulo: "Assistente" },
] as const;

export function Navbar() {
  const navigate = useNavigate();

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
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
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.rotulo}
            </Link>
          ))}
          <button
            onClick={sair}
            aria-label="Sair"
            title="Sair"
            className="ml-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
          >
            <LogOut className="size-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}
