"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CRM_BASE } from "@/lib/crm/route";
import { VIEWS, type View } from "@/lib/crm/views";

/** Lo que se espera a que dejes de teclear antes de ir por los resultados. */
const DEBOUNCE_MS = 250;

/**
 * La fila de cortes del listado, que se convierte en el campo de búsqueda.
 *
 * Es la misma línea, no una barra nueva: un cuadro de búsqueda fijo arriba
 * ocuparía lugar todo el tiempo para algo que se usa de vez en cuando.
 */
export default function SearchRow({
  view,
  query,
}: {
  view: View;
  query: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(query !== "");
  const [text, setText] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Los resultados los arma el servidor, así que buscar es navegar. `replace` y
  // no `push` para que volver atrás salga del CRM en un toque y no deshaga la
  // búsqueda letra por letra.
  useEffect(() => {
    const value = text.trim();
    if (value === query) return;

    const timer = setTimeout(() => {
      router.replace(
        value === "" ? CRM_BASE : `${CRM_BASE}?q=${encodeURIComponent(value)}`,
        { scroll: false }
      );
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [text, query, router]);

  /**
   * `flushSync` para que el campo exista y reciba el foco dentro del mismo
   * gesto que lo pidió: en Safari de iOS el teclado solo sube si el foco
   * ocurre ahí mismo, y con el renderizado normal de React llegaría tarde.
   */
  const openSearch = () => {
    flushSync(() => setOpen(true));
    inputRef.current?.focus();
  };

  const closeSearch = () => {
    setOpen(false);
    setText("");
    if (query !== "") router.replace(CRM_BASE, { scroll: false });
  };

  if (open) {
    return (
      <form
        // Enter no envía nada —los resultados ya están— pero baja el teclado,
        // que es lo que uno quiere después de escribir.
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current?.blur();
        }}
        className="crm-mono mt-8 flex items-baseline gap-3 text-sm"
      >
        <span className="shrink-0 text-crm-faint">buscar</span>

        <input
          ref={inputRef}
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeSearch();
          }}
          placeholder="cliente o nota…"
          aria-label="Buscar en el CRM"
          enterKeyHint="search"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          // `crm-mono` deja el campo en 1rem: por debajo de 16px, Safari de iOS
          // hace zoom sobre la página al enfocarlo.
          className="crm-field crm-mono min-w-0 flex-1"
        />

        <button
          type="button"
          onClick={closeSearch}
          className="shrink-0 text-crm-faint crm-tap"
        >
          cancelar
        </button>
      </form>
    );
  }

  return (
    <nav className="crm-mono mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
      {VIEWS.map((option, i) => (
        <span key={option} className="flex items-baseline gap-3">
          {i > 0 && <span className="text-crm-line">·</span>}
          <Link
            href={option === "abiertas" ? CRM_BASE : `${CRM_BASE}?ver=${option}`}
            className={
              option === view
                ? "text-crm-text underline decoration-crm-accent underline-offset-4"
                : "text-crm-faint hover:text-crm-dim"
            }
          >
            {option}
          </Link>
        </span>
      ))}

      <span className="flex items-baseline gap-3">
        <span className="text-crm-line">·</span>
        <button
          type="button"
          onClick={openSearch}
          className="text-crm-faint hover:text-crm-dim"
        >
          buscar
        </button>
      </span>
    </nav>
  );
}
