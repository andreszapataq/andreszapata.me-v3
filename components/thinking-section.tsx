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
          react: (chunks) => (
            <Highlight icon="/icons/react_dark.svg">{chunks}</Highlight>
          ),
          node: (chunks) => (
            <Highlight icon="/icons/nodejsHex.svg">{chunks}</Highlight>
          ),
          tailwind: (chunks) => (
            <Highlight icon="/icons/tailwindcss.svg">{chunks}</Highlight>
          ),
          aws: (chunks) => (
            <Highlight icon="/icons/aws_dark.svg">{chunks}</Highlight>
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
      <p>
        {t.rich("p4", {
          email: (chunks) => (
            <TextLink href="mailto:contacto@andreszapata.me">
              {chunks}
            </TextLink>
          ),
        })}
      </p>
      <p>{t("p5")}</p>
      <p>{t("p6")}</p>
    </Section>
  );
}

