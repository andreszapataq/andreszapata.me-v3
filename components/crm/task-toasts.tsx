"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { crmPath } from "@/lib/crm/route";
import { relativeDays } from "@/lib/crm/format";
import { dismissTaskAlert } from "@/lib/crm/actions";
import {
  hideAlert,
  pruneHiddenAlerts,
  useHiddenAlerts,
} from "@/components/crm/hidden-alerts";
import type { TaskAlert } from "@/lib/crm/alerts";

/** Cuántos avisos se ven a la vez; el resto se resume en una línea. */
const MAX_VISIBLE = 3;

/**
 * El reloj del teléfono, que es lo único que decide si un aviso ya llegó a su
 * hora. Vive fuera de React porque es justamente eso —un sistema externo— y
 * porque useSyncExternalStore deja que el servidor pinte «nada» sin inventarse
 * una hora que allá no existe. Es módulo y no estado del componente porque el
 * toaster está montado una sola vez, en el layout del CRM.
 */
let clock = 0;
const listeners = new Set<() => void>();

function readClock() {
  clock = Date.now();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getClock = () => clock;
const getServerClock = () => 0;

/**
 * Los pasos siguientes que ya reclamaron su hora, apilados abajo.
 *
 * Vive en el layout y no en la lista para que sobreviva la navegación entre el
 * listado y un negocio: si se remontara en cada pantalla, volvería a aparecer
 * lo que acabas de cerrar.
 */
export default function TaskToasts({ alerts }: { alerts: TaskAlert[] }) {
  const now = useSyncExternalStore(subscribe, getClock, getServerClock);
  const hiddenIds = useHiddenAlerts();
  const router = useRouter();
  const [, startDismiss] = useTransition();

  // Cerrar un aviso es un viaje al servidor. Estos dos conjuntos hacen que la
  // tarjeta responda de una: `leaving` la anima hacia afuera y `gone` la retira
  // cuando termina. Al volver la acción, el aviso ya no llega en `alerts` y los
  // dos sobran —por eso no hace falta limpiarlos.
  const [leaving, setLeaving] = useState<ReadonlySet<number>>(new Set());
  const [gone, setGone] = useState<ReadonlySet<number>>(new Set());

  // Ocultar usa la misma animación de salida que cerrar, pero termina en otro
  // sitio: el aviso pasa al contador del encabezado en vez de irse a la tabla.
  // Este conjunto solo dura lo que dura la animación.
  const [hiding, setHiding] = useState<ReadonlySet<number>>(new Set());

  // Primera lectura del reloj. Es un efecto que escribe en un sistema externo,
  // no estado de React que se sincroniza solo.
  useEffect(() => {
    readClock();
  }, []);

  // Lo que se ocultó pero ya dejó de existir no puede seguir sumando en el
  // encabezado: sería un número que al presionarlo no devuelve nada.
  useEffect(() => {
    pruneHiddenAlerts(new Set(alerts.map((alert) => alert.id)));
  }, [alerts]);

  useEffect(() => {
    if (now === 0) return;

    // Chrome en móvil congela los timers de las pestañas que quedan atrás: si
    // las 9:00 pasan con el CRM detrás de otra app, el setTimeout no dispara.
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      readClock();
      // Y como los avisos cerrados viven en la tabla, otra pantalla pudo cerrar
      // uno mientras esta pestaña estaba atrás: al volver se vuelven a pedir.
      router.refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Un solo timer: el del próximo aviso que aún no vence. Cuando salta, este
    // efecto vuelve a correr y arma el siguiente.
    const next = alerts.find((alert) => alert.due_at > now);
    const timer =
      next === undefined
        ? undefined
        : window.setTimeout(readClock, next.due_at - now + 500);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [alerts, now, router]);

  function dismiss(alert: TaskAlert) {
    startDismiss(async () => {
      await dismissTaskAlert(alert.id);
    });

    // Sin animación no hay `animationend` que esperar: se retira de una.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone((prev) => new Set(prev).add(alert.id));
      return;
    }

    setLeaving((prev) => new Set(prev).add(alert.id));
  }

  function hide(alert: TaskAlert) {
    // Nada que esperar del servidor: ocultar no sale de esta pestaña.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hideAlert(alert.id);
      return;
    }

    setHiding((prev) => new Set(prev).add(alert.id));
  }

  if (now === 0) return null;

  // `alerts` ya viene ordenada por vencimiento: lo más atrasado primero.
  const due = alerts.filter(
    (alert) =>
      alert.due_at <= now && !gone.has(alert.id) && !hiddenIds.has(alert.id)
  );
  if (due.length === 0) return null;

  const visible = due.slice(0, MAX_VISIBLE);
  const overflow = due.length - visible.length;

  return (
    <div className="crm-toasts crm-page" role="status" aria-live="polite">
      {overflow > 0 && (
        <p className="crm-mono px-1 text-sm text-crm-faint">
          + {overflow} {overflow === 1 ? "pendiente más" : "pendientes más"}
        </p>
      )}

      {visible.map((alert, i) => (
        <article
          key={alert.id}
          // `relative` para que el enlace estirado de adentro se mida contra
          // esta tarjeta. Sin esto se mide contra .crm-toasts, que es la
          // columna fija, y la capa de un aviso tapa a los de arriba.
          className={`crm-toast relative ${
            leaving.has(alert.id) || hiding.has(alert.id)
              ? "crm-toast-leaving"
              : ""
          }`}
          style={{
            animationDelay:
              leaving.has(alert.id) || hiding.has(alert.id) ? "0ms" : `${i * 60}ms`,
          }}
          // La animación de salida es la misma para las dos acciones; lo que
          // cambia es dónde termina el aviso. Ocultar lo pasa al contador del
          // encabezado (y suelta el `hiding`, que ya cumplió); cerrar lo retira
          // del todo, porque el servidor ya no lo va a devolver.
          onAnimationEnd={(e) => {
            if (e.animationName !== "crm-toast-out") return;

            if (hiding.has(alert.id)) {
              hideAlert(alert.id);
              setHiding((prev) => {
                const next = new Set(prev);
                next.delete(alert.id);
                return next;
              });
              return;
            }

            setGone((prev) => new Set(prev).add(alert.id));
          }}
        >
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-baseline justify-between gap-3">
              {/* El enlace se estira sobre toda la tarjeta (after:inset-0): el
                  aviso entero abre el negocio, sin gastar una línea en decir
                  «abrir». El proyecto tampoco va: en un empujón basta con de
                  quién es y qué toca hacer. */}
              {/* El nombre no parte en dos líneas: en un teléfono angosto un
                  cliente de nombre largo estiraba el aviso hasta el doble de
                  alto. Recortado sigue reconociéndose, que es todo lo que un
                  empujón necesita. El overflow va en el span y no en el enlace
                  porque sobre el enlace recortaría también su propia capa. */}
              <Link
                href={crmPath(`/${alert.id}`)}
                className="min-w-0 font-medium after:absolute after:inset-0"
              >
                <span className="block truncate">{alert.client}</span>
              </Link>
              {/* Blanco al 90% y no más abajo: sobre el teal, por debajo de
                  ahí el texto pequeño cae del mínimo AA. La jerarquía la hace
                  el tamaño y la mono, no la transparencia. */}
              <span className="crm-mono shrink-0 text-sm text-white/90">
                {relativeDays(alert.next_step_at)}
              </span>
            </div>

            {/* Una sola línea, igual que el nombre: el aviso mide lo mismo
                siempre, así sean dos avisos o tres y sea teléfono o escritorio.
                Lo que se corta lo lees completo al abrir el negocio, que está a
                un toque en cualquier punto de la tarjeta. */}
            <p className="mt-0.5 truncate text-white/90">→ {alert.next_step}</p>
          </div>

          {/* z-10 para quedar por encima del enlace estirado. Las dos palabras
              van a los extremos para que no se confundan al pulsar: ocultar es
              cosa de esta pantalla, cerrar se escribe en la tabla. */}
          <div className="relative z-10 flex items-baseline justify-between px-4 pb-2.5">
            <button
              type="button"
              onClick={() => hide(alert)}
              className="crm-mono text-sm text-white/90 crm-tap-invert"
            >
              ocultar
            </button>
            <button
              type="button"
              onClick={() => dismiss(alert)}
              className="crm-mono text-sm text-white/90 crm-tap-invert"
            >
              cerrar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
