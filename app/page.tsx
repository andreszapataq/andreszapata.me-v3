import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Section from "@/components/section";
import Now from "@/components/now";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:pl-23 md:pr-0 max-w-[792px]">
        <Hero />

        <Section title="Cosas que he construido">
          <p>
            Soy creador de <span className="font-bold underline">Zanto</span>, una marca de ropa lanzada en 2013 junto a mi hermano <span className="font-bold underline">Gustavo</span>. También he participado en el desarrollo de <span className="font-bold underline">Ness Digital</span>, un SaaS enfocado en la gestión centralizada y la optimización de procesos en el sector salud.
          </p>
          <p>
            Actualmente me desempeño como Gerente de Operaciones en <span className="font-bold underline">BioTissue Colombia</span>, donde trabajo en la mejora continua de procesos, logística y operaciones.
          </p>
          <p>
            He construido proyectos digitales con <span className="font-bold">Astro</span>, como el sitio web de <span className="font-bold underline">Jhonny Aponza</span>, conferencista motivacional.
          </p>
          <p>
            Con <span className="font-bold">Framer</span>, he desarrollado sitios para <span className="font-bold underline">GMC Remodeling & Construction</span> y <span className="font-bold underline">Derwin&apos;s Roofing</span>, enfocándome en claridad, rendimiento y simplicidad.
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
            Me muevo entre el diseño, el desarrollo y la resolución de problemas, siempre con una fuerte orientación al servicio. Trabajo principalmente con <span className="font-bold">React</span>, <span className="font-bold">Node.js</span>, <span className="font-bold">Tailwind CSS</span> y <span className="font-bold">AWS</span>. Utilizo herramientas como <span className="font-bold">Figma</span> y <span className="font-bold">Adobe Illustrator</span> para diseñar y prototipar ideas.
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
