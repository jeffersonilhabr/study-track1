/**
 * Exercícios — página onde o usuário pede exercícios de uma matéria,
 * responde às perguntas e ganha pontos a cada acerto.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Trophy, Check, X, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useMaterias } from "@/hooks/use-materias";
import { usePontos } from "@/hooks/use-pontos";
import { embaralhar, exerciciosDaMateria, type Exercicio } from "@/lib/exercicios";

export const Route = createFileRoute("/exercicios")({
  head: () => ({
    meta: [
      { title: "Exercícios — StudyTrack" },
      {
        name: "description",
        content: "Peça exercícios de prática por matéria, responda e ganhe pontos no StudyTrack.",
      },
      { property: "og:title", content: "Exercícios — StudyTrack" },
      { property: "og:description", content: "Pratique com exercícios e ganhe pontos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaExercicios,
});

function PaginaExercicios() {
  const { materias } = useMaterias();
  const { pontos, ganharPontos } = usePontos();

  const [materia, setMateria] = useState("");
  const [lista, setLista] = useState<Exercicio[]>([]);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [pontosDaRodada, setPontosDaRodada] = useState(0);

  const materiaSelecionada = materia || materias[0] || "";
  const exercicio = lista[indice];
  const terminou = lista.length > 0 && indice >= lista.length;

  /** Sorteia uma nova lista de exercícios da matéria escolhida. */
  function pedirExercicios() {
    if (!materiaSelecionada) return;
    setLista(embaralhar(exerciciosDaMateria(materiaSelecionada)));
    setIndice(0);
    setEscolha(null);
    setRespondida(false);
    setAcertos(0);
    setPontosDaRodada(0);
  }

  /** Confere a resposta escolhida e soma pontos se estiver certa. */
  function responder() {
    if (escolha === null || !exercicio || respondida) return;
    setRespondida(true);
    if (escolha === exercicio.correta) {
      setAcertos((a) => a + 1);
      setPontosDaRodada((p) => p + exercicio.pontos);
      ganharPontos(exercicio.pontos);
    }
  }

  function proximo() {
    setIndice((i) => i + 1);
    setEscolha(null);
    setRespondida(false);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="fade-up flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Exercícios</h1>
            <p className="mt-1 text-muted-foreground">
              Escolha uma matéria, peça exercícios e ganhe pontos a cada acerto.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-warning px-4 py-2 text-sm font-semibold text-warning-foreground">
            <Trophy className="size-4" />
            {pontos} pontos
          </span>
        </div>

        {/* Escolha da matéria */}
        <section className="fade-up mt-6 rounded-xl border bg-card p-5 shadow-sm">
          {materias.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Cadastre uma matéria na aba “Matérias” para começar a praticar.
            </p>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-48 flex-1">
                <label className="mb-1 block text-sm font-medium">Matéria</label>
                <select
                  value={materiaSelecionada}
                  onChange={(e) => setMateria(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {materias.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={pedirExercicios}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Sparkles className="size-4" />
                Solicitar exercícios
              </button>
            </div>
          )}
        </section>

        {/* Exercício atual */}
        {exercicio && (
          <section className="fade-up mt-6 rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Questão {indice + 1} de {lista.length} · {exercicio.materia} ·{" "}
              {exercicio.pontos} pontos
            </p>
            <h2 className="mt-2 text-xl font-semibold">{exercicio.pergunta}</h2>

            <div className="mt-4 space-y-2">
              {exercicio.alternativas.map((alternativa, i) => {
                const certa = i === exercicio.correta;
                const marcada = i === escolha;
                let estilo = "border bg-background hover:bg-accent";
                if (respondida && certa) estilo = "border bg-success text-success-foreground";
                else if (respondida && marcada)
                  estilo = "border bg-destructive/10 text-destructive";
                else if (marcada) estilo = "border-primary bg-accent text-accent-foreground";

                return (
                  <button
                    key={i}
                    disabled={respondida}
                    onClick={() => setEscolha(i)}
                    className={`flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${estilo}`}
                  >
                    {respondida && certa && <Check className="size-4 shrink-0" />}
                    {respondida && marcada && !certa && <X className="size-4 shrink-0" />}
                    <span>{alternativa}</span>
                  </button>
                );
              })}
            </div>

            {respondida && (
              <p className="mt-4 rounded-lg bg-muted p-3 text-sm">
                {escolha === exercicio.correta
                  ? `Correto! +${exercicio.pontos} pontos. `
                  : "Não foi dessa vez. "}
                {exercicio.explicacao}
              </p>
            )}

            <div className="mt-4">
              {!respondida ? (
                <button
                  onClick={responder}
                  disabled={escolha === null}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Responder
                </button>
              ) : (
                <button
                  onClick={proximo}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {indice + 1 === lista.length ? "Ver resultado" : "Próxima questão"}
                </button>
              )}
            </div>
          </section>
        )}

        {/* Resultado final da rodada */}
        {terminou && (
          <section className="fade-up mt-6 rounded-xl border bg-card p-6 text-center shadow-sm">
            <Trophy className="mx-auto size-10 text-primary" />
            <h2 className="mt-3 text-2xl font-semibold">Rodada concluída!</h2>
            <p className="mt-2 text-muted-foreground">
              Você acertou {acertos} de {lista.length} e ganhou {pontosDaRodada} pontos.
            </p>
            <button
              onClick={pedirExercicios}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="size-4" />
              Praticar de novo
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
