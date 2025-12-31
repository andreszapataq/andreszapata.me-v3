import { Disc3, Clapperboard, BookOpen } from "lucide-react";
import NowItem from "./now-item";

export default function Now() {
  return (
    <section className="mt-16">
      <h2 className="text-[28px] font-bold mb-4 flex items-center gap-2">
        Ahora
        <span className="live-dot inline-block w-2 h-2 bg-green-500 rounded-full" />
      </h2>
      <div className="space-y-6">
        <NowItem icon={Disc3} label="Escuchando" value="Scenery - Ryo Fukui" />
        <NowItem icon={Clapperboard} label="Viendo" value="Big Little Lies (S1) - 2017" />
        <NowItem icon={BookOpen} label="Leyendo" value="1493 - Charles C. Mann" />
      </div>
    </section>
  );
}

