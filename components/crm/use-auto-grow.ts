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

    // scrollHeight mide el contenido sin contar el borde, pero la altura que le
    // asignamos sí lo incluye (box-sizing: border-box). Sin compensar esa
    // diferencia el campo queda un pixel corto y el navegador lo da por
    // scrolleable: en el móvil, cada campo se traga el gesto de la página y
    // arrastrar solo funciona por los bordes de la pantalla.
    const borde = area.offsetHeight - area.clientHeight;
    area.style.height = `${area.scrollHeight + borde}px`;

    // Y por si la altura de línea deja fracciones sueltas al redondear: un
    // campo que crece con su contenido nunca tiene nada que desplazar.
    area.style.overflowY = "hidden";
  }, [value]);

  return ref;
}
