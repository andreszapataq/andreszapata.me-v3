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

export const CIERRE_ESTANDAR =
  "Si esta propuesta se alinea con lo que buscas, el siguiente paso es agendar una sesión estratégica para afinar detalles, resolver dudas y definir fecha de arranque.";

export const CTA_ESTANDAR = "Agendar sesión";
