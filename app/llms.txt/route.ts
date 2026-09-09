import { entry } from "@/content/entry";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${entry.headword}\n\n> ${entry.definition}\n\n${entry.footnote}\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
