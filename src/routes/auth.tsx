/**
 * Auth — página de login do StudyTrack.
 * O usuário entra com a conta Google ou Apple e é levado ao Dashboard.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — StudyTrack" },
      { name: "description", content: "Entre no StudyTrack com sua conta Google ou Apple." },
      { property: "og:title", content: "Entrar — StudyTrack" },
      { property: "og:description", content: "Entre no StudyTrack com sua conta Google ou Apple." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaAuth,
});

type Provedor = "google" | "apple";

function PaginaAuth() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<Provedor | null>(null);
  const [erro, setErro] = useState("");

  async function entrar(provedor: Provedor) {
    setErro("");
    setCarregando(provedor);
    const resultado = await lovable.auth.signInWithOAuth(provedor, {
      redirect_uri: window.location.origin,
    });
    if (resultado.error) {
      setErro("Não foi possível entrar. Tente novamente.");
      setCarregando(null);
      return;
    }
    if (resultado.redirected) return; // o navegador vai para o provedor
    // Sessão criada: vai para o Dashboard.
    navigate({ to: "/dashboard" });
  }

  const botao =
    "flex w-full items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-60";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="fade-up w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpenCheck className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Entrar no StudyTrack</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use sua conta Google ou Apple para acessar seus estudos.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => entrar("google")}
            disabled={carregando !== null}
            className={botao}
          >
            {carregando === "google" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
            )}
            Continuar com Google
          </button>

          <button
            onClick={() => entrar("apple")}
            disabled={carregando !== null}
            className={botao}
          >
            {carregando === "apple" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.87 3.24-.82 1.4.11 2.45.66 3.14 1.67-2.88 1.72-2.41 5.52.48 6.64-.57 1.5-1.31 2.99-1.94 4.68ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"
                />
              </svg>
            )}
            Continuar com Apple
          </button>
        </div>

        {erro && (
          <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}
