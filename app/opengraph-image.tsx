import { ImageResponse } from "next/og";
import { entry } from "@/content/entry";

export const alt = `${entry.headword} — ${entry.definition}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(weight: 400 | 700, italic = false) {
  const family = `Libre+Baskerville:ital,wght@${italic ? 1 : 0},${weight}`;
  // No modern User-Agent header, so Google Fonts serves TTF (Satori cannot read woff2).
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const match = css.match(/src: url\((https:[^)]+)\)/);
  if (!match) throw new Error("font url not found");
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [regular, bold, italic] = await Promise.all([
    loadFont(400),
    loadFont(700),
    loadFont(400, true),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4efe4",
          color: "#17140f",
          fontFamily: "Libre Baskerville",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 1056,
            border: "2px solid #17140f",
            padding: 3,
          }}
        >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            border: "2px solid #17140f",
            padding: "60px 70px",
          }}
        >
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            {entry.headword}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "rgba(23,20,15,0.55)", marginTop: 10 }}>
            {entry.pronunciation}
          </div>
          <div style={{ display: "flex", fontSize: 28, fontStyle: "italic", marginTop: 4 }}>
            {entry.partOfSpeech}
          </div>
          <div style={{ display: "flex", fontSize: 32, lineHeight: 1.45, marginTop: 40 }}>
            {entry.definition}
          </div>
        </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Libre Baskerville", data: regular, weight: 400, style: "normal" },
        { name: "Libre Baskerville", data: bold, weight: 700, style: "normal" },
        { name: "Libre Baskerville", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
