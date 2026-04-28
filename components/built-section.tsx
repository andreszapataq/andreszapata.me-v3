"use client";

import { useTranslations } from "next-intl";
import Section from "./section";
import Highlight from "./highlight";
import LinkPreview from "./link-preview";
import gustavoImg from "@/public/previews/gustavo.webp";
import nessImg from "@/public/previews/ness.webp";
import biotissueImg from "@/public/previews/biotissue.webp";
import jhonnyImg from "@/public/previews/jhonny.webp";
import neuronahubImg from "@/public/previews/neuronahub.webp";
import dersImg from "@/public/previews/ders.webp";
import zapImg from "@/public/previews/zap.webp";

export default function BuiltSection() {
  const t = useTranslations("sections.built");

  return (
    <Section title={t("title")}>
      <p>
        {t.rich("p1", {
          zanto: (chunks) => (
            <Highlight icon="/icons/zanto_dark.svg">{chunks}</Highlight>
          ),
          gustavo: (chunks) => (
            <LinkPreview
              href="https://gustavozapata.com/"
              name={t("projects.gustavo.name")}
              tags={t("projects.gustavo.tags")}
              image={gustavoImg}
            >
              {chunks}
            </LinkPreview>
          ),
          ness: (chunks) => (
            <LinkPreview
              href="https://www.nessdigital.co/"
              name={t("projects.ness.name")}
              tags={t("projects.ness.tags")}
              image={nessImg}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
      <p>
        {t.rich("p2", {
          biotissue: (chunks) => (
            <LinkPreview
              href="https://biotissue.com.co/"
              name={t("projects.biotissue.name")}
              tags={t("projects.biotissue.tags")}
              image={biotissueImg}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
      <p>
        {t.rich("p3", {
          astro: (chunks) => (
            <Highlight icon="/icons/astro-icon-dark.svg">{chunks}</Highlight>
          ),
          jhonny: (chunks) => (
            <LinkPreview
              href="https://jhonnyaponza.org/"
              name={t("projects.jhonny.name")}
              tags={t("projects.jhonny.tags")}
              image={jhonnyImg}
            >
              {chunks}
            </LinkPreview>
          ),
          nextjs: (chunks) => (
            <Highlight icon="/icons/nextjs_dark.svg">{chunks}</Highlight>
          ),
          neuronahub: (chunks) => (
            <LinkPreview
              href="https://www.neuronahub.com/"
              name={t("projects.neuronahub.name")}
              tags={t("projects.neuronahub.tags")}
              image={neuronahubImg}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
      <p>
        {t.rich("p4", {
          framer: (chunks) => (
            <Highlight icon="/icons/framer_dark.svg">{chunks}</Highlight>
          ),
          derwins: (chunks) => (
            <LinkPreview
              href="https://dersroofing.com/"
              name={t("projects.derwins.name")}
              tags={t("projects.derwins.tags")}
              image={dersImg}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
      <p>
        {t.rich("p5", {
          html: (chunks) => <span className="font-semibold">{chunks}</span>,
          css: (chunks) => <span className="font-semibold">{chunks}</span>,
          js: (chunks) => <span className="font-semibold">{chunks}</span>,
          zap: (chunks) => (
            <LinkPreview
              href="https://www.zapblindsusa.com/"
              name={t("projects.zap.name")}
              tags={t("projects.zap.tags")}
              image={zapImg}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
    </Section>
  );
}

