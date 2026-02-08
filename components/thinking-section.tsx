"use client";

import { useTranslations } from "next-intl";
import Section from "./section";
import Highlight from "./highlight";
import TextLink from "./text-link";

export default function ThinkingSection() {
  const t = useTranslations("sections.thinking");

  return (
    <Section title={t("title")}>
      <p>{t("p1")}</p>
      <p>
        {t.rich("p2", {
          cursor: (chunks) => (
            <Highlight icon="/icons/cursor_dark.svg">{chunks}</Highlight>
          ),
          supabase: (chunks) => (
            <Highlight icon="/icons/supabase.svg">{chunks}</Highlight>
          ),
          vercel: (chunks) => (
            <Highlight icon="/icons/vercel_dark.svg">{chunks}</Highlight>
          ),
          figma: (chunks) => (
            <Highlight icon="/icons/figma.svg">{chunks}</Highlight>
          ),
          illustrator: (chunks) => (
            <Highlight icon="/icons/illustrator.svg">{chunks}</Highlight>
          ),
        })}
      </p>
      <p>{t("p3")}</p>
      <p>{t("p4")}</p>
      <p>
        {t.rich("p5", {
          email: (chunks) => (
            <TextLink href="mailto:contacto@andreszapata.me">
              {chunks}
            </TextLink>
          ),
        })}
      </p>
      <p>{t("p6")}</p>
    </Section>
  );
}

