# StudyTrack 📚

Sistema simples de organização e acompanhamento de estudos, criado como projeto de aprendizado de programação.

## Objetivo

Ajudar estudantes a visualizar suas matérias, organizar tarefas de estudo e acompanhar o próprio progresso — com um código simples, comentado e fácil de entender para quem está começando.

## Funcionalidades atuais

- **Dashboard**: mensagem de boas-vindas, quantidade de matérias, tarefas pendentes, tarefas concluídas, percentual geral de progresso e lista das tarefas recentes.
- **Cadastro de tarefas**: formulário com título, descrição, matéria, data de prazo e status (Pendente / Concluída).
- **Lista de tarefas**: cada tarefa mostra título, matéria, prazo e status, com botões para concluir, editar e excluir.
- **Matérias**: página com as matérias cadastradas e o progresso em cada uma.
- **Filtros**: por status (Todas / Pendentes / Concluídas) e por matéria.
- **Armazenamento**: as tarefas são salvas no `localStorage` do navegador — você pode fechar e abrir a página sem perder nada.

## Tecnologias utilizadas

- **React** — construção da interface com componentes
- **TypeScript** — JavaScript com tipos, para deixar o código mais seguro
- **Tailwind CSS** — estilização moderna e responsiva
- **TanStack Router** — navegação entre as páginas
- **localStorage** — armazenamento local das tarefas (sem backend nesta versão)

## Estrutura do projeto

```
StudyTrack/
├── src/
│   ├── components/        # Componentes reutilizáveis (Navbar, cards, formulário)
│   ├── hooks/             # Lógica de estado (useTarefas)
│   ├── lib/               # Dados e funções principais (studytrack.ts)
│   ├── routes/            # Páginas (Dashboard, Tarefas, Matérias)
│   └── styles.css         # Sistema de design (cores, fontes)
├── public/
└── README.md
```

## Como o código está organizado

- `src/lib/studytrack.ts` — tipos de dados, lista de matérias e funções que leem/salvam no `localStorage`.
- `src/hooks/use-tarefas.ts` — hook que gerencia a lista de tarefas (adicionar, editar, excluir, concluir).
- `src/components/` — cada componente tem uma responsabilidade só: `Navbar` (navegação), `CartaoEstatistica` (números do dashboard), `CartaoTarefa` (uma tarefa), `FormularioTarefa` (criar/editar).
- `src/routes/` — uma página por arquivo: `index.tsx` (Dashboard), `tarefas.tsx`, `materias.tsx`.

## Próximas funcionalidades possíveis

- Banco de dados e login de usuários (backend)
- Cadastro e remoção de matérias
- Ordenação de tarefas por prazo
- Lembretes e notificações de prazos próximos
- Modo escuro
- Gráficos de progresso por semana
