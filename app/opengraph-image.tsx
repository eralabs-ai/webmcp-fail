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

  const ink = "#17140f";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4efe4",
          color: ink,
          fontFamily: "Libre Baskerville",
          padding: "56px 80px 44px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            border: `2px solid ${ink}`,
            padding: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              border: `2px solid ${ink}`,
              padding: "56px 72px 60px",
            }}
          >
            <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1 }}>
              {entry.headword}
            </div>
            <div style={{ display: "flex", fontSize: 32, fontStyle: "italic", marginTop: 16 }}>
              {entry.partOfSpeech}
            </div>
            <div style={{ display: "flex", fontSize: 38, lineHeight: 1.4, marginTop: 40 }}>
              {entry.definition}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(23,20,15,0.45)",
          }}
        >
          webmcp.fail
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
