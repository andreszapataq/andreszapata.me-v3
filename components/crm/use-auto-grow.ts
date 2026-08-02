"use client";

import { useEffect, useRef } from "react";

/**
 * Un textarea que crece con lo que tiene escrito: nada de texto recortado a
 * una línea ni de barras de scroll dentro de un campo que se lee como texto.
 */
export function useAutoGrow(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const area = ref.current;
    if (!area) return;
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`;
  }, [value]);

  return ref;
}
