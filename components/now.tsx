"use client";

import { Disc3, Clapperboard, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import NowItem from "./now-item";

export default function Now() {
  const t = useTranslations("now");

  return (
    <section className="mt-16">
      <h2 className="text-[28px] font-bold mb-4 flex items-center gap-2">
        {t("title")}
        <span className="live-dot inline-block w-2 h-2 bg-green-500 rounded-full" />
      </h2>
      <div className="space-y-6">
        <NowItem icon={Disc3} label={t("listening")} value="Olé Coltrane (Deluxe Edition) - John Coltrane" />
        <NowItem
          icon={Clapperboard}
          label={t("watching")}
          value="It Was Just An Accident - 2025"
        />
        <NowItem icon={BookOpen} label={t("reading")} value="1493 - Charles C. Mann" />
      </div>
    </section>
  );
}
