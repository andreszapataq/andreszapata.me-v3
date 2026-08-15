"use client";

import { useEffect, useRef } from "react";

/** Deja el campo exactamente del alto de su contenido, sin tope. */
function ajustar(area: HTMLTextAreaElement) {
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
}

/**
 * Un textarea que crece con lo que tiene escrito: nada de texto recortado a
 * una línea ni de barras de scroll dentro de un campo que se lee como texto.
 */
export function useAutoGrow(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const area = ref.current;
    if (area) ajustar(area);
  }, [value]);

  /**
   * La altura queda fijada en píxeles, así que solo vale para el ancho con el
   * que se midió: al girar el teléfono el mismo texto ocupa más renglones y,
   * como el campo ya no puede desplazarse por dentro, lo que sobra quedaría
   * cortado sin manera de verlo. Se remide cuando cambia el ancho.
   */
  useEffect(() => {
    const area = ref.current;
    if (!area) return;

    // Solo el ancho: la altura también dispara al observador, y es justo lo que
    // acabamos de cambiar nosotros.
    let ancho = area.clientWidth;
    const observador = new ResizeObserver(() => {
      if (area.clientWidth === ancho) return;
      ancho = area.clientWidth;
      ajustar(area);
    });

    observador.observe(area);
    return () => observador.disconnect();
  }, []);

  return ref;
}
