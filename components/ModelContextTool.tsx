"use client";

import { useEffect, useSyncExternalStore } from "react";
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

function findModelContext(): { path: string; ctx: ModelContextLike } | null {
  if (typeof window === "undefined") return null;
  const doc = (document as unknown as { modelContext?: ModelContextLike }).modelContext;
  if (doc && typeof doc.registerTool === "function") {
    return { path: "document.modelContext", ctx: doc };
  }
  const nav = (navigator as unknown as { modelContext?: ModelContextLike }).modelContext;
  if (nav && typeof nav.registerTool === "function") {
    return { path: "navigator.modelContext", ctx: nav };
  }
  return null;
}

const subscribe = () => () => {};
const getSnapshot = () => findModelContext()?.path ?? "";
const getServerSnapshot = () => null;

export function ModelContextTool() {
  // null = server/hydrating, "" = not present, otherwise the path where it lives
  const path = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const found = findModelContext();
    if (!found) return;
    const controller = new AbortController();
    Promise.resolve(
      found.ctx.registerTool(
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

  return (
    <p className="footer" aria-live="polite">
      {path === null ? "\u00a0" : path ? `${path} · detected` : "modelContext · not present"}
    </p>
  );
}
