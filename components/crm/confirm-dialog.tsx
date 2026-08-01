"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * Confirmación destructiva dentro de un <form action={...}>.
 *
 * Usa el <dialog> nativo en vez de un diálogo portalizado a propósito: al
 * quedarse en el mismo árbol que el form, confirmar sigue siendo un submit
 * normal y useFormStatus sigue viendo el envío. Un portal rompería las dos
 * cosas y habría que reponerlas a mano con useTransition.
 *
 * Ojo: el <dialog> no puede contener un <form> propio (anidarlos es inválido);
 * por eso los botones de adentro son controles sueltos del form de afuera.
 */
export default function ConfirmDialog({
  children,
  title,
  detail,
  confirmLabel,
  pendingLabel,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  title: string;
  detail?: string;
  confirmLabel: string;
  pendingLabel: string;
  className?: string;
  ariaLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { pending } = useFormStatus();
  // Cada nota de la bitácora monta su propia hoja: el id no puede ser fijo.
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      // showModal() manda el foco al primer elemento enfocable, que sería
      // «cancelar»: se vería preseleccionado con su anillo azul. El foco tiene
      // que entrar igual (si no, teclado y lectores de pantalla se quedan
      // afuera), así que lo recibe el contenido, que no es accionable. De paso
      // Enter no dispara nada, que es lo que uno quiere en un borrado.
      contentRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }

    // showModal() bloquea el clic detrás, pero no el scroll: en el iPhone la
    // página se sigue moviendo bajo la hoja si no lo frenamos aquí.
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Si la acción termina sin navegar (borrar una nota revalida y ya), cerramos
  // la hoja al soltar el pending. Cuando sí navega, esto no alcanza a correr.
  // Se ajusta durante el render, no en un efecto: así no hay un paso pintado
  // con la hoja abierta y la acción ya terminada (mismo criterio que
  // useFieldState con lastProp).
  const [wasPending, setWasPending] = useState(false);
  if (wasPending !== pending) {
    setWasPending(pending);
    if (!pending) setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        className="crm-dialog crm-page"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        // Esc mientras se borra dejaría la hoja cerrada sobre una acción en
        // curso, sin nada que le diga al usuario que todavía está pasando algo.
        onCancel={(e) => {
          if (pending) e.preventDefault();
        }}
        // El clic en el backdrop apunta al propio <dialog>: el contenido está
        // en un <div> hijo, así que cualquier clic dentro no llega hasta aquí.
        onClick={(e) => {
          if (e.target === dialogRef.current && !pending) setOpen(false);
        }}
      >
        {/* tabIndex -1: recibe el foco al abrir, pero no entra en el recorrido
            del tabulador. Sin anillo porque no es un control, y porque no se
            puede llegar aquí tabulando: la hoja misma ya es la señal. */}
        <div
          ref={contentRef}
          tabIndex={-1}
          className="min-h-0 overflow-y-auto px-6 pt-6 pb-5 focus:outline-none"
        >
          <p id={titleId} className="font-medium">
            {title}
          </p>
          {detail && (
            <p className="mt-1 whitespace-pre-wrap text-crm-dim">{detail}</p>
          )}
        </div>

        <div className="crm-mono flex shrink-0 items-baseline justify-between border-t border-crm-line px-6 py-4 text-sm">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className="py-1 text-crm-faint crm-tap disabled:border-b-transparent"
          >
            cancelar
          </button>

          {/* Sin .crm-tap: su hover es teal y le quitaría el rojo justo al
              control que tiene que seguir leyéndose como destructivo. */}
          <button
            type="submit"
            disabled={pending}
            className="border-b border-dashed border-crm-red/45 py-1 text-crm-red transition-colors hover:border-crm-red focus-visible:border-crm-red disabled:border-transparent disabled:text-crm-faint"
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
