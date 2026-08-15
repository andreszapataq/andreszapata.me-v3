"use client";

import { useSyncExternalStore } from "react";

/**
 * Los avisos que apartaste de la pantalla sin darlos por atendidos.
 *
 * Ocultar y hecho son cosas distintas a propósito: hecho dice «esto ya lo hice»
 * y vacía el paso en la tabla; ocultar dice «ahora no, déjame ver la lista» y no
 * sale de la pestaña. Por eso esto vive en memoria y no en la base ni en
 * localStorage: si recargas, los avisos vuelven, porque una recarga es empezar a
 * mirar de nuevo.
 *
 * Que no haya un ocultar permanente es la decisión, no un pendiente: un paso que
 * no puedes hacer hoy se reprograma, y así queda escrito cuándo lo retomas.
 *
 * Es un módulo y no un contexto porque los dos que lo leen —el toaster, montado
 * en el layout, y el número del encabezado, que pinta la lista— son hermanos,
 * no padre e hijo. Un proveedor tendría que envolver a los dos para no ganar
 * nada. Es el mismo patrón con el que task-toasts lee el reloj.
 */
let hidden: ReadonlySet<number> = new Set();

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getHidden = () => hidden;

// En el servidor no hay nada oculto todavía. Constante y no `new Set()` porque
// useSyncExternalStore compara por identidad: una instancia nueva en cada
// lectura sería un cambio perpetuo.
const NOTHING: ReadonlySet<number> = new Set();
const getServerHidden = () => NOTHING;

export function hideAlert(id: number) {
  if (hidden.has(id)) return;
  hidden = new Set(hidden).add(id);
  emit();
}

export function showHiddenAlerts() {
  if (hidden.size === 0) return;
  hidden = NOTHING;
  emit();
}

/**
 * Suelta los que ya no existen. Un aviso oculto puede desaparecer por detrás
 * —reprogramas el paso siguiente desde la pantalla del negocio— y sin esto el
 * número seguiría contándolo: lo presionarías y no volvería nada.
 */
export function pruneHiddenAlerts(live: ReadonlySet<number>) {
  if (hidden.size === 0) return;
  const kept = new Set([...hidden].filter((id) => live.has(id)));
  if (kept.size === hidden.size) return;
  hidden = kept;
  emit();
}

export function useHiddenAlerts() {
  return useSyncExternalStore(subscribe, getHidden, getServerHidden);
}

/**
 * El número teal que se acumula sobre la palabra «crm», como un exponente.
 *
 * Va ahí y no abajo con los avisos porque el encabezado ya es donde viven las
 * cuentas del CRM —pendientes para hoy, vencidas, propuestas que cambiaron— y
 * una más no estrena superficie.
 *
 * Solo en el listado: dentro de un negocio no hay dónde recuperarlos hasta
 * volver. Es a propósito, porque el título «crm» solo existe aquí; en las demás
 * pantallas la palabra es un enlace de vuelta y colgarle un botón encima
 * mezclaría dos cosas que no se parecen.
 */
export function HiddenAlertsBadge() {
  const hiddenNow = useHiddenAlerts();
  if (hiddenNow.size === 0) return null;

  const label =
    hiddenNow.size === 1 ? "1 aviso oculto" : `${hiddenNow.size} avisos ocultos`;

  return (
    <button
      type="button"
      onClick={showHiddenAlerts}
      title={`mostrar ${label}`}
      aria-label={`mostrar ${label}`}
      className="crm-mono ml-0.5 px-1 align-super text-sm text-crm-accent crm-tap"
    >
      {hiddenNow.size}
    </button>
  );
}
