import { entry } from "@/content/entry";
import { ModelContextTool } from "@/components/ModelContextTool";

export default function Page() {
  return (
    <main>
      <article className="card" aria-label={`Dictionary entry for ${entry.headword}`}>
        <h1 className="headword">{entry.headword}</h1>
        <p className="pronunciation">{entry.pronunciation}</p>
        <p className="pos">{entry.partOfSpeech}</p>
        <p className="definition">          {entry.definition}
        </p>
      </article>
      <ModelContextTool />
    </main>
  );
}
