"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { crmPath } from "@/lib/crm/route";
import { relativeDays } from "@/lib/crm/format";
import type { TaskAlert } from "@/lib/crm/alerts";

/** Cuántos avisos se ven a la vez; el resto se resume en una línea. */
const MAX_VISIBLE = 3;

const SEEN_PREFIX = "crm:visto:";

/**
 * Clave de «ya vi esto». Lleva el día del paso y no el día en que se cerró el
 * aviso, y ahí está toda la diferencia: cerrar significa «visto para esta
 * fecha», no «no me molestes hoy». Una tarea vencida que no reprogramas se
 * queda callada —la lista la sigue marcando en ámbar— y en el momento en que
 * le pones fecha nueva la clave cambia y el aviso se re-arma solo.
 */
function seenKey(alert: TaskAlert): string {
  return `${SEEN_PREFIX}${alert.id}:${alert.next_step_at}`;
}

/**
 * Lee lo ya descartado y de paso barre lo que sobró: como cada clave lleva su
 * fecha, reprogramar deja atrás la anterior y nadie la volvería a consultar.
 */
function readSeen(alerts: TaskAlert[]): Set<string> {
  const live = new Set(alerts.map(seenKey));
  const seen = new Set<string>();

  try {
    const stale: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key === null || !key.startsWith(SEEN_PREFIX)) continue;
      if (live.has(key)) seen.add(key);
      else stale.push(key);
    }
    for (const key of stale) window.localStorage.removeItem(key);
  } catch {
    // Sin localStorage (incógnito, cuota llena) no hay nada descartado y se
    // muestran todos. Es el lado seguro del error para un recordatorio.
  }

  return seen;
}

/**
 * Lo que el CRM no puede saber hasta que corre en el teléfono: qué hora es y
 * qué avisos ya cerraste.
 *
 * Vive fuera de React porque eso es literalmente lo que es —el reloj y
 * localStorage—, y porque useSyncExternalStore es lo que deja que el servidor
 * pinte «nada» sin inventarse un estado que allá no existe. Es módulo y no
 * estado del componente porque el toaster está montado una sola vez, en el
 * layout del CRM.
 */
interface Reading {
  /** Epoch ms de la última lectura del reloj. 0 = todavía no se ha leído. */
  now: number;
  seen: ReadonlySet<string>;
}

const UNREAD: Reading = { now: 0, seen: new Set() };

let reading: Reading = UNREAD;
const listeners = new Set<() => void>();

function publish(next: Reading) {
  reading = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getReading = () => reading;
const getServerReading = () => UNREAD;

function dismiss(alert: TaskAlert) {
  const key = seenKey(alert);
  publish({ now: reading.now, seen: new Set(reading.seen).add(key) });

  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Si no se puede guardar, el aviso igual se cierra en esta sesión.
  }
}

/**
 * Los pasos siguientes que ya reclamaron su hora, apilados abajo.
 *
 * Vive en el layout y no en la lista para que sobreviva la navegación entre el
 * listado y un negocio: si se remontara en cada pantalla, volvería a aparecer
 * lo que acabas de cerrar.
 */
export default function TaskToasts({ alerts }: { alerts: TaskAlert[] }) {
  const { now, seen } = useSyncExternalStore(
    subscribe,
    getReading,
    getServerReading
  );

  // Primera lectura del reloj y de lo ya descartado. Es un efecto que escribe
  // en un sistema externo, no estado de React que se sincroniza solo.
  useEffect(() => {
    publish({ now: Date.now(), seen: readSeen(alerts) });
  }, [alerts]);

  useEffect(() => {
    if (now === 0) return;

    const read = () => publish({ now: Date.now(), seen: reading.seen });

    // Chrome en móvil congela los timers de las pestañas que quedan atrás: si
    // las 9:00 pasan con el CRM detrás de otra app, el setTimeout no dispara.
    // Por eso el reloj también se relee al volver a la pestaña.
    const onVisibility = () => {
      if (document.visibilityState === "visible") read();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Un solo timer: el del próximo aviso que aún no vence. Cuando salta, este
    // efecto vuelve a correr y arma el siguiente.
    const next = alerts.find((alert) => alert.due_at > now);
    const timer =
      next === undefined
        ? undefined
        : window.setTimeout(read, next.due_at - now + 500);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [alerts, now]);

  if (now === 0) return null;

  // `alerts` ya viene ordenada por vencimiento: lo más atrasado primero.
  const due = alerts.filter(
    (alert) => alert.due_at <= now && !seen.has(seenKey(alert))
  );
  if (due.length === 0) return null;

  const visible = due.slice(0, MAX_VISIBLE);
  const hidden = due.length - visible.length;

  return (
    <div className="crm-toasts crm-page" role="status" aria-live="polite">
      {hidden > 0 && (
        <p className="crm-mono px-1 text-sm text-crm-faint">
          + {hidden} {hidden === 1 ? "pendiente más" : "pendientes más"}
        </p>
      )}

      {visible.map((alert, i) => (
        <article
          key={seenKey(alert)}
          className="crm-toast relative"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-baseline justify-between gap-3">
              {/* El enlace se estira sobre toda la tarjeta (after:inset-0): el
                  aviso entero abre el negocio, sin gastar una línea en decir
                  «abrir». El proyecto tampoco va: en un empujón basta con de
                  quién es y qué toca hacer. */}
              <Link
                href={crmPath(`/${alert.id}`)}
                className="font-medium after:absolute after:inset-0"
              >
                {alert.client}
              </Link>
              <span className="crm-mono shrink-0 text-sm text-crm-amber">
                {relativeDays(alert.next_step_at)}
              </span>
            </div>

            {/* Un paso largo no puede estirar el aviso hasta tapar la pantalla. */}
            <p className="mt-0.5 line-clamp-2 text-crm-dim">
              → {alert.next_step}
            </p>
          </div>

          {/* z-10 para quedar por encima del enlace estirado, y ml-auto para
              que el área de «cerrar» sea la palabra y no la franja entera. */}
          <div className="relative z-10 flex px-4 pb-2.5">
            <button
              type="button"
              onClick={() => dismiss(alert)}
              className="crm-mono ml-auto text-sm text-crm-faint crm-tap"
            >
              cerrar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
