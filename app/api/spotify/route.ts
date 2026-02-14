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
  });

  return response.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const nowPlayingResponse = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // 204 = no content (nada reproduciéndose)
    if (
      nowPlayingResponse.status === 204 ||
      nowPlayingResponse.status > 400
    ) {
      const recentResponse = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const recentData = await recentResponse.json();
      const track = recentData.items?.[0]?.track;

      if (track) {
        return NextResponse.json({
          isPlaying: false,
          title: track.name,
          artist: track.artists
            .map((a: { name: string }) => a.name)
            .join(", "),
          album: track.album.name,
          albumImageUrl: track.album.images?.[0]?.url,
          songUrl: track.external_urls.spotify,
        });
      }

      return NextResponse.json({ isPlaying: false });
    }

    const data = await nowPlayingResponse.json();

    if (!data.item) {
      return NextResponse.json({ isPlaying: false });
    }

    return NextResponse.json({
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists
        .map((a: { name: string }) => a.name)
        .join(", "),
      album: data.item.album.name,
      albumImageUrl: data.item.album.images?.[0]?.url,
      songUrl: data.item.external_urls.spotify,
    });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      { isPlaying: false, error: "Failed to fetch Spotify data" },
      { status: 500 }
    );
  }
}
