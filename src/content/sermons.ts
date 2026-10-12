// Sermons and short clips. Add an entry with a `videoUrl` (YouTube or Facebook link)
// or an `audioUrl` and it appears on the Sermons page. Moves to Supabase in a later phase.

export type Sermon = {
  slug: string;
  title: string;
  series?: string;
  speaker: string;
  date: string; // YYYY-MM-DD
  scripture?: string;
  summary?: string;
  videoUrl?: string; // YouTube/Facebook link
  audioUrl?: string;
};

export const currentSeries = {
  title: "The Revelation of Grace",
  description:
    "Reverend Mwamba unpacks the grace of God: not a licence to sin, but the power of God that saves, transforms and empowers us to live as His living temples.",
  image: "/images/series-revelation-of-grace.jpg",
};

export const sermons: Sermon[] = [
  {
    slug: "revelation-of-grace-part-2",
    title: "The Revelation of Grace: Part 2",
    series: "The Revelation of Grace",
    speaker: "Reverend Mwamba",
    date: "2026-10-04",
  },
];

/** Converts a YouTube watch/short/youtu.be link into an embeddable URL. */
export function youtubeEmbed(url?: string) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}
