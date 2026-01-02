"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="mt-20">
      <div className="flex items-center gap-7 mb-6">
        <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden shrink-0">
          <Image
            src="/avatar.jpg"
            alt="Andres Zapata"
            fill
            sizes="130px"
            className="object-cover object-[center_15%]"
          />
        </div>
        <div>
          <h1 className="text-[32px] font-bold leading-[1.15] mb-1.5">
            Andres Zapata
          </h1>
          <p className="text-[22px] font-medium leading-tight">{t("subtitle")}</p>
        </div>
      </div>
      <p className="text-xl text-paragraph max-w-[500px]">{t("description")}</p>
    </section>
  );
}
