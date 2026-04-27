"use client";

import { useTranslations } from "next-intl";
import Section from "./section";
import Highlight from "./highlight";
import TextLink from "./text-link";
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
            <TextLink href="https://gustavozapata.com/">{chunks}</TextLink>
          ),
          ness: (chunks) => (
            <LinkPreview
              href="https://www.nessdigital.co/"
              name={t("projects.ness.name")}
              tags={t("projects.ness.tags")}
              description={t("projects.ness.description")}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
      <p>
        {t.rich("p2", {
          biotissue: (chunks) => (
            <TextLink href="https://biotissue.com.co/">{chunks}</TextLink>
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
              description={t("projects.jhonny.description")}
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
              description={t("projects.neuronahub.description")}
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
              description={t("projects.derwins.description")}
            >
              {chunks}
            </LinkPreview>
          ),
        })}
      </p>
    </Section>
  );
}

