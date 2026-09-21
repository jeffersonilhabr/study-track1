/**
 * CartaoTarefa — mostra uma tarefa na lista, com botões para
 * concluir, editar e excluir.
 */
import { Check, Pencil, Trash2, CalendarDays } from "lucide-react";
import { formatarData, type Tarefa } from "@/lib/studytrack";

interface Props {
  tarefa: Tarefa;
  aoAlternar: (id: string) => void;
  aoEditar: (tarefa: Tarefa) => void;
  aoExcluir: (id: string) => void;
}

export function CartaoTarefa({ tarefa, aoAlternar, aoEditar, aoExcluir }: Props) {
  return (
    <div className="fade-up flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
      {/* Botão redondo que marca/desmarca a tarefa como concluída */}
      <button
        onClick={() => aoAlternar(tarefa.id)}
        aria-label="Marcar como concluída"
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          tarefa.concluida
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
      >
        {tarefa.concluida && <Check className="size-4" />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-medium ${
            tarefa.concluida ? "text-muted-foreground line-through" : ""
          }`}
        >
          {tarefa.titulo}
        </p>
        {tarefa.descricao && (
          <p className="mt-0.5 text-sm text-muted-foreground">{tarefa.descricao}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            {tarefa.materia}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatarData(tarefa.prazo)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 font-medium ${
              tarefa.concluida
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }`}
          >
            {tarefa.concluida ? "Concluída" : "Pendente"}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => aoEditar(tarefa)}
          aria-label="Editar tarefa"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={() => aoExcluir(tarefa.id)}
          aria-label="Excluir tarefa"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
