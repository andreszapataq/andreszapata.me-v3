"use client";

import { useTranslations } from "next-intl";
import Section from "./section";
import Highlight from "./highlight";
import LinkPreview from "./link-preview";

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
            >
              {chunks}
            </LinkPreview>
          ),
          ness: (chunks) => (
            <LinkPreview
              href="https://www.nessdigital.co/"
              name={t("projects.ness.name")}
              tags={t("projects.ness.tags")}
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
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
    </Section>
  );
}

