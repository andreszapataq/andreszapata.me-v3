"use client";

import { useTranslations } from "next-intl";
import Section from "./section";
import Highlight from "./highlight";
import TextLink from "./text-link";

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
            <TextLink href="https://nessdigital.framer.website/">{chunks}</TextLink>
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
            <TextLink href="https://jhonnyaponza.org/">{chunks}</TextLink>
          ),
        })}
      </p>
      <p>
        {t.rich("p4", {
          framer: (chunks) => (
            <Highlight icon="/icons/framer_dark.svg">{chunks}</Highlight>
          ),
          gmc: (chunks) => (
            <TextLink href="https://gmcbuilds.com/">{chunks}</TextLink>
          ),
          derwins: (chunks) => (
            <TextLink href="https://derwinsroofing.co/">{chunks}</TextLink>
          ),
        })}
      </p>
    </Section>
  );
}

