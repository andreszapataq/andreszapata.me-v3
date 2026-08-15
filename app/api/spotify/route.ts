import { NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

// Depende de credenciales en runtime: nunca debe prerenderizarse en build
export const dynamic = "force-dynamic";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { name: string; images?: { url: string }[] };
  external_urls: { spotify: string };
}

function formatTrack(track: SpotifyTrack, isPlaying: boolean) {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumImageUrl: track.album.images?.[0]?.url,
    songUrl: track.external_urls.spotify,
  };
}

async function getAccessToken() {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    // invalid_grant = refresh token expirado o revocado. Spotify los caduca a los
    // 6 meses de la autorización, así que esto se repite: hay que rehacer el
    // Authorization Code flow y actualizar SPOTIFY_REFRESH_TOKEN.
    if (data.error === "invalid_grant") {
      throw new Error(
        `refresh token inválido (${data.error_description ?? "invalid_grant"}). Regenera SPOTIFY_REFRESH_TOKEN.`
      );
    }

    throw new Error(
      `token endpoint respondió ${response.status}: ${data.error ?? "error desconocido"}`
    );
  }

  return data.access_token as string;
}

export async function GET() {
  try {
    const access_token = await getAccessToken();
    const headers = { Authorization: `Bearer ${access_token}` };

    const nowPlayingResponse = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers,
      cache: "no-store",
    });

    // 204 = no content (nada reproduciéndose). Cualquier otro no-2xx sí es un fallo real
    if (nowPlayingResponse.status !== 204) {
      if (!nowPlayingResponse.ok) {
        throw new Error(
          `currently-playing respondió ${nowPlayingResponse.status}`
        );
      }

      const data = await nowPlayingResponse.json();

      if (data.item) {
        return NextResponse.json(formatTrack(data.item, data.is_playing));
      }
    }

    // Nada sonando: caemos al último tema reproducido
    const recentResponse = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, {
      headers,
      cache: "no-store",
    });

    if (!recentResponse.ok) {
      throw new Error(`recently-played respondió ${recentResponse.status}`);
    }

    const recentData = await recentResponse.json();
    const track = recentData.items?.[0]?.track;

    return NextResponse.json(
      track ? formatTrack(track, false) : { isPlaying: false }
    );
  } catch (error) {
    console.error(
      "[spotify]",
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      { isPlaying: false, error: "spotify_unavailable" },
      { status: 503 }
    );
  }
}
