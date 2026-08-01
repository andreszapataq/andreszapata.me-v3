/**
 * Base de la URL del CRM.
 *
 * Vive aparte porque el mismo prefijo aparece en enlaces, redirects,
 * revalidaciones y en el proxy: así renombrarlo es una línea y no veinte.
 *
 * Ojo: en Next el nombre de la carpeta ES la ruta, así que cambiar esto
 * obliga a renombrar también `app/<base>/`. La ruta es distinta a propósito
 * del nombre interno (`lib/crm`, `components/crm`), que no se expone.
 */
export const CRM_BASE = "/centauro";

/** crmPath("/nuevo") → "/centauro/nuevo" */
export function crmPath(path = ""): string {
  return `${CRM_BASE}${path}`;
}
