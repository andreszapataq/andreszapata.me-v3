/**
 * Copy que es igual en todas las propuestas.
 *
 * Vive acá y no en cada JSON para que una propuesta nueva lo herede sin
 * escribir nada, y para que cambiarlo una vez lo cambie en todas. Los campos
 * `siguientePaso.text` y `siguientePaso.ctaLabel` siguen existiendo por si
 * alguna propuesta necesita cerrar distinto.
 *
 * Sin dependencias a propósito: lo importan tanto un componente de servidor
 * (proposal-cta) como uno de cliente (floating-bar).
 */

/**
 * Sin segunda persona a propósito: el resto de la propuesta habla en tercera
 * ("la farmacia", "el equipo"), y así la misma línea sirve igual para una
 * persona natural que para una empresa, sin tener que elegir tú/ustedes.
 */
export const CIERRE_ESTANDAR =
  "Si el enfoque tiene sentido, el siguiente paso es agendar una sesión estratégica para afinar detalles, resolver dudas y definir la fecha de arranque.";

export const CTA_ESTANDAR = "Agendar sesión";
