/**
 * Exercícios — página onde o usuário pratica com exercícios de múltipla escolha.
 * Agora com suporte completo de Inteligência Artificial:
 * 1. Desafio Diário com IA: sugestões de exercícios inéditos e rotativos todos os dias.
 * 2. Gerador com IA: crie questões personalizadas sob demanda para qualquer matéria.
 * 3. Tutor IA com Dica: receba dicas pedagógicas socráticas sem entregar a resposta.
 * 4. Explicação com IA: entenda detalhadamente cada alternativa e tire suas dúvidas.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Trophy,
  Check,
  X,
  RotateCcw,
  Lightbulb,
  Bot,
  Flame,
  Calendar,
  Loader2,
  HelpCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/Navbar";
import { useMaterias } from "@/hooks/use-materias";
import { usePontos } from "@/hooks/use-pontos";
import { useDesafioDiario } from "@/hooks/use-desafio-diario";
import {
  embaralhar,
  exerciciosDaMateria,
  obterExerciciosDoDia,
  type Exercicio,
} from "@/lib/exercicios";
import { formatarData } from "@/lib/studytrack";

export const Route = createFileRoute("/_authenticated/exercicios")({
  head: () => ({
    meta: [
      { title: "Exercícios com IA — StudyTrack" },
      {
        name: "description",
        content: "Pratique com exercícios gerados por IA, desafios diários e explicações passo a passo.",
      },
      { property: "og:title", content: "Exercícios com IA — StudyTrack" },
      { property: "og:description", content: "Pratique com exercícios e ganhe pontos com apoio de IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaginaExercicios,
});

async function chamarApiExercicios(acao: "gerar" | "dica" | "explicar", dados: unknown) {
  const resp = await fetch("/api/exercicios-ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acao, dados }),
  });
  if (!resp.ok) {
    throw new Error("Erro na comunicação com a IA");
  }
  return resp.json();
}

function PaginaExercicios() {
  const { materias } = useMaterias();
  const { pontos, ganharPontos } = usePontos();
  const { hoje, concluidoHoje, streak, concluirDesafio } = useDesafioDiario();

  const [materia, setMateria] = useState("");
  const [lista, setLista] = useState<Exercicio[]>([]);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [pontosDaRodada, setPontosDaRodada] = useState(0);
  const [ehDesafioDiario, setEhDesafioDiario] = useState(false);
  const [bonusDesafioGanho, setBonusDesafioGanho] = useState(0);

  // Estados de IA
  const [carregandoGeracao, setCarregandoGeracao] = useState(false);
  const [carregandoDica, setCarregandoDica] = useState(false);
  const [dica, setDica] = useState<string | null>(null);
  const [carregandoExplicacao, setCarregandoExplicacao] = useState(false);
  const [explicacaoIA, setExplicacaoIA] = useState<string | null>(null);

  const materiaSelecionada = materia || materias[0] || "";
  const exercicio = lista[indice];
  const terminou = lista.length > 0 && indice >= lista.length;

  /** Inicia o Desafio Diário sugerido para a data de hoje */
  async function iniciarDesafioDiario() {
    if (!materiaSelecionada) return;
    setCarregandoGeracao(true);
    setEhDesafioDiario(true);
    setBonusDesafioGanho(0);

    try {
      // Tenta obter questões inéditas de hoje geradas via IA
      const res = await chamarApiExercicios("gerar", {
        materia: materiaSelecionada,
        quantidade: 3,
        dia: hoje,
      });

      if (res.exercicios && res.exercicios.length > 0) {
        setLista(res.exercicios);
      } else {
        setLista(obterExerciciosDoDia(materiaSelecionada, hoje));
      }
    } catch {
      // Fallback determinístico da data caso falhe a conexão
      setLista(obterExerciciosDoDia(materiaSelecionada, hoje));
    } finally {
      setCarregandoGeracao(false);
      resetarRodada();
    }
  }

  /** Gera novos exercícios usando a IA sob demanda */
  async function gerarComIA() {
    if (!materiaSelecionada) return;
    setCarregandoGeracao(true);
    setEhDesafioDiario(false);
    setBonusDesafioGanho(0);

    try {
      const res = await chamarApiExercicios("gerar", {
        materia: materiaSelecionada,
        quantidade: 3,
      });

      if (res.exercicios && res.exercicios.length > 0) {
        setLista(res.exercicios);
      } else {
        setLista(embaralhar(exerciciosDaMateria(materiaSelecionada)).slice(0, 3));
      }
    } catch {
      setLista(embaralhar(exerciciosDaMateria(materiaSelecionada)).slice(0, 3));
    } finally {
      setCarregandoGeracao(false);
      resetarRodada();
    }
  }

  /** Puxa questões do banco tradicional */
  function pedirExerciciosPadrao() {
    if (!materiaSelecionada) return;
    setEhDesafioDiario(false);
    setBonusDesafioGanho(0);
    setLista(embaralhar(exerciciosDaMateria(materiaSelecionada)));
    resetarRodada();
  }

  function resetarRodada() {
    setIndice(0);
    setEscolha(null);
    setRespondida(false);
    setAcertos(0);
    setPontosDaRodada(0);
    setDica(null);
    setExplicacaoIA(null);
  }

  /** Solicita uma dica da IA sem revelar a resposta */
  async function pedirDica() {
    if (!exercicio || carregandoDica) return;
    setCarregandoDica(true);
    try {
      const res = await chamarApiExercicios("dica", {
        materia: exercicio.materia,
        pergunta: exercicio.pergunta,
        alternativas: exercicio.alternativas,
      });
      setDica(res.dica || "Analise com atenção os conceitos fundamentais da matéria.");
    } catch {
      setDica("Concentre-se nas palavras-chave do enunciado para descartar opções improváveis.");
    } finally {
      setCarregandoDica(false);
    }
  }

  /** Solicita uma explicação aprofundada da IA */
  async function pedirExplicacaoIA() {
    if (!exercicio || carregandoExplicacao) return;
    setCarregandoExplicacao(true);
    try {
      const res = await chamarApiExercicios("explicar", {
        materia: exercicio.materia,
        pergunta: exercicio.pergunta,
        alternativas: exercicio.alternativas,
        correta: exercicio.correta,
        escolhaUsuario: escolha,
      });
      setExplicacaoIA(res.explicacao || exercicio.explicacao);
    } catch {
      setExplicacaoIA(exercicio.explicacao);
    } finally {
      setCarregandoExplicacao(false);
    }
  }

  /** Confere a resposta escolhida e soma pontos se estiver certa */
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
    const proximoIndice = indice + 1;
    if (proximoIndice >= lista.length && ehDesafioDiario && !concluidoHoje) {
      // Concluiu o desafio diário!
      const bonus = 25;
      concluirDesafio(bonus);
      ganharPontos(bonus);
      setBonusDesafioGanho(bonus);
    }

    setIndice(proximoIndice);
    setEscolha(null);
    setRespondida(false);
    setDica(null);
    setExplicacaoIA(null);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Cabeçalho */}
        <div className="fade-up flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Exercícios com IA</h1>
            <p className="mt-1 text-muted-foreground">
              Desafios diários, questões inéditas com IA e explicações passo a passo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20"
              title="Ofensiva de estudos: responda ao desafio diário para manter sua sequência!"
            >
              <Flame className="size-4 fill-amber-500 text-amber-500" />
              {streak} {streak === 1 ? "dia" : "dias"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning px-4 py-1.5 text-sm font-semibold text-warning-foreground shadow-sm">
              <Trophy className="size-4" />
              {pontos} pontos
            </span>
          </div>
        </div>

        {/* Banner do Desafio Diário */}
        <section className="fade-up mt-6 rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="size-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Desafio do Dia • {formatarData(hoje)}
                </span>
              </div>
              <h2 className="text-lg font-bold">Questões sugeridas para hoje</h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Resolva o trio de questões diárias para ganhar <strong className="text-foreground">+25 pontos bônus</strong> e manter sua ofensiva ativa.
              </p>
            </div>

            <div className="shrink-0">
              {concluidoHoje ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-success/15 px-4 py-2.5 text-sm font-semibold text-success border border-success/30">
                  <Check className="size-4 stroke-[3]" />
                  Desafio Concluído!
                </div>
              ) : (
                <button
                  onClick={iniciarDesafioDiario}
                  disabled={carregandoGeracao || materias.length === 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-transform active:scale-95 hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
                >
                  {carregandoGeracao && ehDesafioDiario ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Iniciar Desafio Diário
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Escolha da Matéria e Modos de Prática */}
        <section className="fade-up mt-6 rounded-xl border bg-card p-5 shadow-sm">
          {materias.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Cadastre uma matéria na aba “Matérias” para começar a praticar.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Matéria para praticar</label>
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

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={gerarComIA}
                  disabled={carregandoGeracao}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {carregandoGeracao && !ehDesafioDiario ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Gerar novas questões com IA
                </button>

                <button
                  onClick={pedirExerciciosPadrao}
                  disabled={carregandoGeracao}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                >
                  <RotateCcw className="size-4" />
                  Banco de questões rápidas
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Exercício Atual */}
        {exercicio && !terminou && (
          <section className="fade-up mt-6 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  Questão {indice + 1} de {lista.length}
                </span>
                <span>•</span>
                <span>{exercicio.materia}</span>
                {ehDesafioDiario && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    Desafio Diário
                  </span>
                )}
              </div>
              <span className="font-semibold text-primary">+{exercicio.pontos} pontos</span>
            </div>

            <h2 className="mt-4 text-xl font-semibold leading-relaxed">{exercicio.pergunta}</h2>

            {/* Alternativas */}
            <div className="mt-5 space-y-2.5">
              {exercicio.alternativas.map((alternativa, i) => {
                const certa = i === exercicio.correta;
                const marcada = i === escolha;
                let estilo = "border bg-background hover:bg-accent/60";
                if (respondida && certa) estilo = "border-success bg-success/15 text-success font-medium";
                else if (respondida && marcada)
                  estilo = "border-destructive bg-destructive/10 text-destructive";
                else if (marcada) estilo = "border-primary bg-primary/10 text-primary font-medium";

                return (
                  <button
                    key={i}
                    disabled={respondida}
                    onClick={() => setEscolha(i)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3.5 text-left text-sm transition-all ${estilo}`}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold opacity-75">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{alternativa}</span>
                    {respondida && certa && <Check className="size-4 shrink-0 text-success" />}
                    {respondida && marcada && !certa && <X className="size-4 shrink-0 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {/* Dica da IA */}
            {dica && (
              <div className="fade-up mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-foreground">
                <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
                  <Lightbulb className="size-4" />
                  Dica do Tutor IA:
                </div>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{dica}</p>
              </div>
            )}

            {/* Explicação da IA */}
            {explicacaoIA && (
              <div className="fade-up mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Bot className="size-4" />
                  Explicação Detalhada da IA:
                </div>
                <div className="prose prose-sm dark:prose-invert mt-2 max-w-none text-muted-foreground">
                  <ReactMarkdown>{explicacaoIA}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Feedback padrão rápido após responder */}
            {respondida && !explicacaoIA && (
              <div className="mt-4 rounded-xl bg-muted/60 p-3.5 text-sm">
                <p className="font-semibold">
                  {escolha === exercicio.correta
                    ? `🎉 Resposta Correta! (+${exercicio.pontos} pontos)`
                    : "❌ Não foi dessa vez."}
                </p>
                <p className="mt-1 text-muted-foreground">{exercicio.explicacao}</p>
              </div>
            )}

            {/* Barra de Ações: Dica, Responder, Explicar, Próxima */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div className="flex items-center gap-2">
                {!respondida && (
                  <button
                    onClick={pedirDica}
                    disabled={carregandoDica || dica !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-accent disabled:opacity-50"
                  >
                    {carregandoDica ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Lightbulb className="size-3.5" />
                    )}
                    {dica ? "Dica visualizada" : "Pedir dica à IA"}
                  </button>
                )}

                {respondida && !explicacaoIA && (
                  <button
                    onClick={pedirExplicacaoIA}
                    disabled={carregandoExplicacao}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent disabled:opacity-50"
                  >
                    {carregandoExplicacao ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Bot className="size-3.5" />
                    )}
                    Explicar passo a passo com IA
                  </button>
                )}
              </div>

              <div>
                {!respondida ? (
                  <button
                    onClick={responder}
                    disabled={escolha === null}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Responder
                  </button>
                ) : (
                  <button
                    onClick={proximo}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {indice + 1 === lista.length ? "Ver resultado" : "Próxima questão →"}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Resultado Final da Rodada */}
        {terminou && (
          <section className="fade-up mt-6 rounded-2xl border bg-card p-8 text-center shadow-sm">
            <Trophy className="mx-auto size-12 text-primary" />
            <h2 className="mt-3 text-2xl font-bold">Rodada Concluída!</h2>
            <p className="mt-2 text-muted-foreground">
              Você acertou <strong className="text-foreground">{acertos}</strong> de{" "}
              <strong className="text-foreground">{lista.length}</strong> questões e conquistou{" "}
              <strong className="text-primary font-bold">+{pontosDaRodada} pontos</strong>.
            </p>

            {bonusDesafioGanho > 0 && (
              <div className="mx-auto mt-4 max-w-sm rounded-xl bg-amber-500/10 p-3 text-sm font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                🔥 Desafio Diário Completado! +{bonusDesafioGanho} pontos bônus adicionados!
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={gerarComIA}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Sparkles className="size-4" />
                Gerar mais questões com IA
              </button>
              <button
                onClick={pedirExerciciosPadrao}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <RotateCcw className="size-4" />
                Praticar do banco
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
