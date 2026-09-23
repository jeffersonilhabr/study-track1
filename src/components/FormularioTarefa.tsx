/**
 * FormularioTarefa — formulário para criar ou editar uma tarefa.
 * É exibido dentro de uma janela (modal) sobre a página.
 */
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { type Tarefa } from "@/lib/studytrack";
import { useMaterias } from "@/hooks/use-materias";

interface Props {
  aberto: boolean;
  tarefaEditando: Tarefa | null; // null = criando uma nova tarefa
  aoFechar: () => void;
  aoSalvar: (dados: Omit<Tarefa, "id">) => void;
}

export function FormularioTarefa({ aberto, tarefaEditando, aoFechar, aoSalvar }: Props) {
  const { materias } = useMaterias();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [materia, setMateria] = useState<string>("");
  const [prazo, setPrazo] = useState("");
  const [concluida, setConcluida] = useState(false);

  // Quando o formulário abre, preenche os campos (edição) ou limpa (nova tarefa).
  useEffect(() => {
    if (aberto) {
      setTitulo(tarefaEditando?.titulo ?? "");
      setDescricao(tarefaEditando?.descricao ?? "");
      setMateria(tarefaEditando?.materia ?? materias[0] ?? "");
      setPrazo(tarefaEditando?.prazo ?? "");
      setConcluida(tarefaEditando?.concluida ?? false);
    }
  }, [aberto, tarefaEditando]);

  if (!aberto) return null;

  function enviar(evento: React.FormEvent) {
    evento.preventDefault(); // impede a página de recarregar
    if (!titulo.trim()) return;
    aoSalvar({ titulo: titulo.trim(), descricao: descricao.trim(), materia, prazo, concluida });
    aoFechar();
  }

  const campo =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="fade-up w-full max-w-md rounded-xl border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {tarefaEditando ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <button
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-md p-1 text-muted-foreground hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Título da tarefa</label>
            <input
              className={campo}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Estudar capítulo 4"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              className={campo}
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes da tarefa (opcional)"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Matéria</label>
              <select
                className={campo}
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
              >
                {MATERIAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Data de prazo</label>
              <input
                type="date"
                className={campo}
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className={campo}
              value={concluida ? "concluida" : "pendente"}
              onChange={(e) => setConcluida(e.target.value === "concluida")}
            >
              <option value="pendente">Pendente</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {tarefaEditando ? "Salvar alterações" : "Adicionar tarefa"}
          </button>
        </form>
      </div>
    </div>
  );
}
