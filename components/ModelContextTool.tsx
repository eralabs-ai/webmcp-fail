"use client";

import { useEffect } from "react";
import { entry } from "@/content/entry";

type ModelContextLike = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute: () => Promise<string> | string;
    },
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
};

function findModelContext(): ModelContextLike | null {
  const doc = (document as unknown as { modelContext?: ModelContextLike }).modelContext;
  if (doc && typeof doc.registerTool === "function") return doc;
  const nav = (navigator as unknown as { modelContext?: ModelContextLike }).modelContext;
  if (nav && typeof nav.registerTool === "function") return nav;
  return null;
}

/** Registers the WebMCP tool where the API exists; renders nothing. */
export function ModelContextTool() {
  useEffect(() => {
    const ctx = findModelContext();
    if (!ctx) return;
    const controller = new AbortController();
    Promise.resolve(
      ctx.registerTool(
        {
          name: "get_definition",
          description: `Returns the dictionary definition of ${entry.headword}.`,
          inputSchema: { type: "object", properties: {} },
          execute: () => entry.definition,
        },
        { signal: controller.signal },
      ),
    ).catch(() => {
      /* registration is best-effort; the page reads fine without it */
    });
    return () => controller.abort();
  }, []);

  return null;
}
