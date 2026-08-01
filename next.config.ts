import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { CRM_BASE } from "./lib/crm/route";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // El CRM lee data/propuestas en tiempo de ejecución con una ruta armada a
  // mano, que el rastreo de archivos de Next no detecta. Sin esto, el enlace
  // de «importar propuestas» no vería nada una vez desplegado.
  outputFileTracingIncludes: {
    [CRM_BASE]: ["./data/propuestas/**"],
  },
};

export default withNextIntl(nextConfig);
