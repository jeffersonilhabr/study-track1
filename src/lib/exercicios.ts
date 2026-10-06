/**
 * exercicios.ts
 * -------------
 * Banco de exercícios de múltipla escolha do StudyTrack.
 *
 * Cada exercício tem: enunciado, alternativas, índice da resposta correta,
 * uma explicação e quantos pontos vale.
 */

export interface Exercicio {
  id: string;
  materia: string;
  pergunta: string;
  alternativas: string[];
  correta: number; // posição da alternativa certa (começa em 0)
  explicacao: string;
  pontos: number;
}

const BANCO: Exercicio[] = [
  {
    id: "ed-1",
    materia: "Estruturas de Dados",
    pergunta: "Em uma pilha (stack), qual é a ordem de saída dos elementos?",
    alternativas: [
      "O primeiro que entra é o primeiro que sai (FIFO)",
      "O último que entra é o primeiro que sai (LIFO)",
      "Sai sempre o menor elemento",
      "A ordem é aleatória",
    ],
    correta: 1,
    explicacao: "Pilha é LIFO: o último elemento empilhado é o primeiro a ser retirado.",
    pontos: 10,
  },
  {
    id: "ed-2",
    materia: "Estruturas de Dados",
    pergunta: "Qual estrutura funciona como uma fila de banco?",
    alternativas: ["Pilha", "Fila", "Árvore binária", "Grafo"],
    correta: 1,
    explicacao: "A fila (queue) é FIFO: quem chega primeiro é atendido primeiro.",
    pontos: 10,
  },
  {
    id: "c-1",
    materia: "Programação em C",
    pergunta: "O que o operador & faz em C quando usado antes de uma variável?",
    alternativas: [
      "Multiplica o valor por dois",
      "Devolve o endereço de memória da variável",
      "Converte o valor para texto",
      "Apaga a variável",
    ],
    correta: 1,
    explicacao: "&variavel devolve o endereço de memória, muito usado com ponteiros e scanf.",
    pontos: 10,
  },
  {
    id: "c-2",
    materia: "Programação em C",
    pergunta: "Qual comando imprime texto na tela em C?",
    alternativas: ["console.log()", "print()", "printf()", "echo"],
    correta: 2,
    explicacao: "Em C usamos printf(), da biblioteca stdio.h.",
    pontos: 10,
  },
  {
    id: "html-1",
    materia: "HTML e CSS",
    pergunta: "Qual propriedade CSS deixa os itens de um contêiner lado a lado com Flexbox?",
    alternativas: [
      "display: block",
      "display: flex",
      "position: absolute",
      "float: center",
    ],
    correta: 1,
    explicacao: "display: flex ativa o Flexbox e alinha os filhos em uma linha por padrão.",
    pontos: 10,
  },
  {
    id: "html-2",
    materia: "HTML e CSS",
    pergunta: "Qual tag HTML cria um link para outra página?",
    alternativas: ["<link>", "<a>", "<href>", "<url>"],
    correta: 1,
    explicacao: "A tag <a href=\"...\"> cria links navegáveis.",
    pontos: 10,
  },
  {
    id: "js-1",
    materia: "JavaScript",
    pergunta: "Qual palavra-chave cria uma variável que NÃO pode ser reatribuída?",
    alternativas: ["var", "let", "const", "static"],
    correta: 2,
    explicacao: "const cria uma constante: o valor não pode ser reatribuído depois.",
    pontos: 10,
  },
  {
    id: "js-2",
    materia: "JavaScript",
    pergunta: "O que o método array.filter() devolve?",
    alternativas: [
      "Um novo array só com os itens que passam no teste",
      "O primeiro item encontrado",
      "A quantidade de itens",
      "O array original modificado",
    ],
    correta: 0,
    explicacao: "filter() cria um novo array com os itens em que a função devolve true.",
    pontos: 10,
  },
  {
    id: "bd-1",
    materia: "Banco de Dados",
    pergunta: "Qual comando SQL busca dados de uma tabela?",
    alternativas: ["INSERT", "SELECT", "UPDATE", "DELETE"],
    correta: 1,
    explicacao: "SELECT é o comando de consulta: SELECT * FROM alunos;",
    pontos: 10,
  },
  {
    id: "bd-2",
    materia: "Banco de Dados",
    pergunta: "O que é uma chave primária (primary key)?",
    alternativas: [
      "Uma senha de acesso ao banco",
      "Um campo que identifica cada linha de forma única",
      "O primeiro campo criado na tabela",
      "Um índice para deixar a busca mais rápida apenas",
    ],
    correta: 1,
    explicacao: "A chave primária identifica cada registro de forma única na tabela.",
    pontos: 10,
  },
  {
    id: "html-3",
    materia: "HTML e CSS",
    pergunta: "Qual tag usamos para o título principal de uma página?",
    alternativas: ["<titulo>", "<h1>", "<topo>", "<p>"],
    correta: 1,
    explicacao: "<h1> é o título mais importante da página (os níveis vão de <h1> até <h6>).",
    pontos: 10,
  },
  {
    id: "html-4",
    materia: "HTML e CSS",
    pergunta: "Qual atributo da tag <img> define o caminho da imagem?",
    alternativas: ["href", "link", "src", "path"],
    correta: 2,
    explicacao: "O atributo src (source) aponta para o arquivo da imagem, ex.: <img src=\"foto.png\">.",
    pontos: 10,
  },
  {
    id: "css-1",
    materia: "HTML e CSS",
    pergunta: "No box model do CSS, o que é o padding?",
    alternativas: [
      "O espaço interno entre a borda e o conteúdo",
      "A margem entre elementos vizinhos",
      "A cor de fundo do elemento",
      "A espessura da borda",
    ],
    correta: 0,
    explicacao: "Padding é o espaço interno do elemento; margin é o espaço externo entre elementos.",
    pontos: 10,
  },
  {
    id: "css-2",
    materia: "HTML e CSS",
    pergunta: 'Como selecionamos em CSS um elemento com id="menu"?',
    alternativas: [".menu { }", "*menu { }", "#menu { }", "@menu { }"],
    correta: 2,
    explicacao: "O # seleciona por id; o ponto (.) seleciona por classe.",
    pontos: 10,
  },
];

// Exercícios genéricos de estudo, usados para matérias que o usuário criou
// e que ainda não têm perguntas próprias no banco.
function exerciciosGenericos(materia: string): Exercicio[] {
  return [
    {
      id: `gen-1-${materia}`,
      materia,
      pergunta: `Qual é a melhor forma de fixar o conteúdo de ${materia}?`,
      alternativas: [
        "Ler o material uma única vez",
        "Praticar com exercícios e revisar em intervalos",
        "Deixar tudo para a véspera da prova",
        "Assistir vídeos sem anotar nada",
      ],
      correta: 1,
      explicacao: "Prática + revisão espaçada é a técnica com melhores resultados.",
      pontos: 5,
    },
    {
      id: `gen-2-${materia}`,
      materia,
      pergunta: `Você travou em um exercício de ${materia}. Qual é o melhor próximo passo?`,
      alternativas: [
        "Desistir do assunto",
        "Copiar a resposta pronta sem entender",
        "Voltar ao conceito base e tentar um exemplo menor",
        "Pular para outra matéria e não voltar mais",
      ],
      correta: 2,
      explicacao: "Quebrar o problema em partes menores costuma destravar o raciocínio.",
      pontos: 5,
    },
    {
      id: `gen-3-${materia}`,
      materia,
      pergunta: `Ao estudar ${materia}, o que ajuda mais a manter o ritmo?`,
      alternativas: [
        "Sessões curtas e frequentes com metas claras",
        "Uma maratona de 8 horas por mês",
        "Estudar sem nenhum plano",
        "Só estudar quando estiver inspirado",
      ],
      correta: 0,
      explicacao: "Constância vence intensidade: pouco por dia rende mais do que maratonas.",
      pontos: 5,
    },
  ];
}

/** Devolve os exercícios de uma matéria (usa os genéricos se não houver específicos). */
export function exerciciosDaMateria(materia: string): Exercicio[] {
  const especificos = BANCO.filter((e) => e.materia === materia);
  return especificos.length > 0 ? especificos : exerciciosGenericos(materia);
}

/** Embaralha uma lista (usado para sortear a ordem dos exercícios). */
export function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}
