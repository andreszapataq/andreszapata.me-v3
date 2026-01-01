import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Section from "@/components/section";
import Now from "@/components/now";
import Footer from "@/components/footer";
import Highlight from "@/components/highlight";
import TextLink from "@/components/text-link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:pl-23 md:pr-0 max-w-[792px]">
        <Hero />

        <Section title="Cosas que he construido">
          <p>
            Soy creador de <Highlight tooltip="Zanto">Zanto</Highlight>, una marca de ropa lanzada en 2013 junto a mi hermano <TextLink href="https://gustavozapata.com/">Gustavo</TextLink>. También he participado en el desarrollo de <TextLink href="https://nessdigital.framer.website/">Ness Digital</TextLink>, un SaaS enfocado en la gestión centralizada y la optimización de procesos en el sector salud.
          </p>
          <p>
            Actualmente me desempeño como Gerente de Operaciones en <TextLink href="https://biotissue.com.co/">BioTissue Colombia</TextLink>, donde trabajo en la mejora continua de procesos, logística y operaciones.
          </p>
          <p>
            He construido proyectos digitales con <Highlight tooltip="Astro">Astro</Highlight>, como el sitio web de <TextLink href="https://jhonnyaponza.org/">Jhonny Aponza</TextLink>, conferencista motivacional.
          </p>
          <p>
            Con <Highlight tooltip="Framer">Framer</Highlight>, he desarrollado sitios para <TextLink href="https://gmcbuilds.com/">GMC Remodeling & Construction</TextLink> y <TextLink href="https://derwinsroofing.co/">Derwin&apos;s Roofing</TextLink>, enfocándome en claridad, rendimiento y simplicidad.
          </p>
        </Section>

        <Section title="Cómo pienso">
          <p>
            Creo en hacer un mundo mejor a través del análisis, la optimización y el uso responsable de la tecnología. Crear —cuando se hace bien— le da sentido a nuestra existencia. Tenemos una sola oportunidad y vale la pena usarla para generar impacto positivo en los demás.
          </p>
          <p>
            Aunque cada persona ejerce su libre albedrío, somos una sola especie y compartimos responsabilidades. Diseñar, construir y decidir bien importa, incluso en los detalles pequeños.
          </p>
          <p>
            Me muevo entre el diseño, el desarrollo y la resolución de problemas, siempre con una fuerte orientación al servicio. Trabajo principalmente con <Highlight tooltip="React">React</Highlight>, <Highlight tooltip="Node.js">Node.js</Highlight>, <Highlight tooltip="Tailwind CSS">Tailwind CSS</Highlight> y <Highlight tooltip="AWS">AWS</Highlight>. Utilizo herramientas como <Highlight tooltip="Figma">Figma</Highlight> y <Highlight tooltip="Adobe Illustrator">Adobe Illustrator</Highlight> para diseñar y prototipar ideas.
          </p>
          <p>
            Me interesa crear productos honestos, útiles, sencillos y elegantes. Trabajo de forma transparente, con disciplina y entusiasmo, buscando que cada proyecto tenga un impacto real.
          </p>
          <p>
            Si quieres trabajar conmigo por un mundo mejor, puedes escribirme al correo que encontrarás al final de esta página.
          </p>
          <p>
            Muchas veces, los grandes aportes empiezan resolviendo bien los problemas pequeños.
          </p>
          <p>
            Gracias por leer hasta aquí.
          </p>
        </Section>

        <Now />
      </main>
      <Footer />
    </>
  );
}
