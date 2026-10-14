/**
 * exercicios-ia.server.ts
 * -----------------------
 * Módulo de inteligência artificial para exercícios de estudo (executa apenas no servidor).
 * Utiliza o gateway da Lovable AI (ou OpenAI) para:
 * 1. Gerar novos exercícios inéditos todos os dias por matéria.
 * 2. Fornecer dicas pedagógicas sem revelar a resposta antecipadamente.
 * 3. Gerar explicações didáticas detalhadas após a resposta do aluno.
 */
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
} from "./chat-run-id";
import { exerciciosDaMateria, type Exercicio } from "./exercicios";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODELO = "openai/gpt-6-astra";

function obterClientOpenAI(request?: Request) {
  const apiKey =
    process.env["LOVABLE_API_KEY"] ||
    process.env["OPENAI_API_KEY"] ||
    "";

  if (!apiKey) {
    return null;
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch(
    request ? getLovableAiGatewayRunId(request) : undefined,
  );

  return createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });
}

/**
 * Gera exercícios de múltipla escolha com IA para uma matéria específica.
 * Inclui fallback para o banco local caso a chave não esteja configurada.
 */
export async function gerarExerciciosComIA(
  materia: string,
  quantidade: number = 3,
  dia?: string,
  request?: Request,
): Promise<{ exercicios: Exercicio[]; geradoPorIA: boolean }> {
  const provider = obterClientOpenAI(request);

  if (!provider) {
    // Sem chave configurada no ambiente: usa o banco local inteligente
    return {
      exercicios: exerciciosDaMateria(materia).slice(0, quantidade),
      geradoPorIA: false,
    };
  }

  const promptSistema = `Você é um professor e elaborador de questões didáticas do StudyTrack para estudantes.
Crie exatamente ${quantidade} exercícios de múltipla escolha sobre a matéria "${materia}".
${dia ? `Data de referência do desafio diário: ${dia}. Garanta questões inéditas e variadas.` : ""}

Para cada questão, forneça:
- id: string única (ex: "ia-${Date.now()}-1")
- materia: "${materia}"
- pergunta: o enunciado claro e direto da questão
- alternativas: array com exatamente 4 opções de resposta
- correta: número de 0 a 3 indicando a posição da alternativa correta
- explicacao: uma breve explicação (1 a 3 frases) do porquê essa é a resposta correta
- pontos: sempre o valor numérico 10

Responda APENAS com um array JSON válido contendo os objetos das questões, sem markdown de bloco (\`\`\`json), sem textos extras.`;

  try {
    const { text } = await generateText({
      model: provider.languageModel(MODELO),
      system: promptSistema,
      prompt: `Gere ${quantidade} exercícios de múltipla escolha para a matéria "${materia}".`,
    });

    const jsonLimpo = text.replace(/```(?:json)?/gi, "").trim();
    const parsed = JSON.parse(jsonLimpo) as Exercicio[];

    if (Array.isArray(parsed) && parsed.length > 0) {
      const exerciciosValidados: Exercicio[] = parsed.map((item, idx) => ({
        id: item.id || `ia-${Date.now()}-${idx}`,
        materia: item.materia || materia,
        pergunta: item.pergunta,
        alternativas: Array.isArray(item.alternativas) ? item.alternativas.slice(0, 4) : [],
        correta: typeof item.correta === "number" ? item.correta : 0,
        explicacao: item.explicacao || "Explicação padrão da questão.",
        pontos: item.pontos || 10,
      }));

      return {
        exercicios: exerciciosValidados,
        geradoPorIA: true,
      };
    }
  } catch (erro) {
    console.error("[IA-Exercicios] Falha ao gerar via IA, usando fallback local:", erro);
  }

  return {
    exercicios: exerciciosDaMateria(materia).slice(0, quantidade),
    geradoPorIA: false,
  };
}

/**
 * Gera uma dica pedagógica socrática da IA para auxiliar na questão sem dar a resposta.
 */
export async function gerarDicaComIA(
  dados: {
    materia: string;
    pergunta: string;
    alternativas: string[];
  },
  request?: Request,
): Promise<string> {
  const provider = obterClientOpenAI(request);

  if (!provider) {
    return "Pense no conceito central desta matéria e elimine as opções que contrariam os fundamentos.";
  }

  const promptSistema = `Você é o tutor amigável do StudyTrack.
O aluno pediu uma dica para resolver a seguinte questão de ${dados.materia}:
Pergunta: "${dados.pergunta}"
Alternativas: ${JSON.stringify(dados.alternativas)}

REGRAS OBRIGATÓRIAS:
- NUNCA diga qual alternativa é a correta.
- NUNCA mencione letras ou números de alternativas.
- Dê apenas uma pista estimulante e acolhedora em 2 ou 3 frases curtas para que o aluno chegue à conclusão sozinho.`;

  try {
    const { text } = await generateText({
      model: provider.languageModel(MODELO),
      system: promptSistema,
      prompt: "Forneça uma dica didática para que eu consiga resolver essa questão.",
    });

    return text.trim();
  } catch (erro) {
    console.error("[IA-Dica] Erro ao gerar dica:", erro);
    return "Analise com calma o enunciado e relembre as regras fundamentais deste tópico!";
  }
}

/**
 * Gera uma explicação didática aprofundada da IA após o aluno responder a questão.
 */
export async function gerarExplicacaoComIA(
  dados: {
    materia: string;
    pergunta: string;
    alternativas: string[];
    correta: number;
    escolhaUsuario?: number;
  },
  request?: Request,
): Promise<string> {
  const provider = obterClientOpenAI(request);

  if (!provider) {
    return `A alternativa correta é: "${dados.alternativas[dados.correta]}".`;
  }

  const acertou = dados.escolhaUsuario === dados.correta;

  const promptSistema = `Você é o professor e tutor amigável do StudyTrack.
O aluno respondeu a questão de ${dados.materia}.
Pergunta: "${dados.pergunta}"
Alternativas: ${JSON.stringify(dados.alternativas)}
Alternativa correta: ${dados.correta} ("${dados.alternativas[dados.correta]}")
${dados.escolhaUsuario !== undefined ? `O aluno escolheu a alternativa ${dados.escolhaUsuario} ("${dados.alternativas[dados.escolhaUsuario]}"). Resultado: ${acertou ? "ACERTOU" : "ERROU"}.` : ""}

Instruções:
- Se ele acertou, parabenize brevemente e consolide o aprendizado com uma explicação clara e sucinta de por que a resposta está certa.
- Se ele errou, acolha com carinho, aponte a pegadinha ou onde a opção escolhida falha, e mostre o raciocínio correto passo a passo.
- Máximo 3 a 4 parágrafos curtos. Use formatação em markdown (negrito e listas se ajudar).`;

  try {
    const { text } = await generateText({
      model: provider.languageModel(MODELO),
      system: promptSistema,
      prompt: "Por favor, explique a resolução desta questão.",
    });

    return text.trim();
  } catch (erro) {
    console.error("[IA-Explicacao] Erro ao gerar explicação:", erro);
    return `A resposta correta é "${dados.alternativas[dados.correta]}".`;
  }
}
