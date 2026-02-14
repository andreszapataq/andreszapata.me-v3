"use client";

import { Disc3, Clapperboard, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NowItem from "./now-item";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

interface NowStatusData {
  watching?: string;
  reading?: string;
}

export default function Now() {
  const t = useTranslations("now");
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [nowStatus, setNowStatus] = useState<NowStatusData | null>(null);

  useEffect(() => {
    async function fetchSpotify() {
      try {
        const res = await fetch("/api/spotify");
        const data = await res.json();
        setSpotify(data);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      }
    }

    async function fetchNowStatus() {
      try {
        const res = await fetch("/api/now");
        const data = await res.json();
        setNowStatus(data);
      } catch (error) {
        console.error("Error fetching now status:", error);
      }
    }

    fetchSpotify();
    fetchNowStatus();

    const spotifyInterval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(spotifyInterval);
  }, []);

  const listeningValue = spotify?.title
    ? `${spotify.title} - ${spotify.artist}`
    : "...";

  return (
    <section className="mt-16">
      <h2 className="text-[28px] font-bold mb-4 flex items-center gap-2">
        {t("title")}
        <span className="live-dot inline-block w-2 h-2 bg-green-500 rounded-full" />
      </h2>
      <div className="space-y-6">
        <NowItem icon={Disc3} label={t("listening")} value={listeningValue} />
        <NowItem
          icon={Clapperboard}
          label={t("watching")}
          value={nowStatus?.watching ?? "..."}
        />
        <NowItem
          icon={BookOpen}
          label={t("reading")}
          value={nowStatus?.reading ?? "..."}
        />
      </div>
    </section>
  );
}
