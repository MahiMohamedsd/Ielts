"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import listeningData from "@/content/listening.json";
import type { ListeningData } from "@/lib/listeningTypes";
import ListeningPartView from "@/components/ListeningPartView";
import { useLang } from "@/lib/i18n";
import { loadJSON } from "@/lib/storage";
import { listeningBand } from "@/lib/scoring";

const data = listeningData as ListeningData;

// Lets each part be deep-linked (e.g. /listening?part=2) so a QR code printed
// next to that part in the book can jump straight to it.
function initialPartFromParam(param: string | null): number {
  const n = Number(param);
  const idx = data.parts.findIndex((p) => p.id === n);
  return idx >= 0 ? idx : 0;
}

function ListeningPageInner() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePart, setActivePartState] = useState(() =>
    initialPartFromParam(searchParams.get("part"))
  );
  const [refreshTick, setRefreshTick] = useState(0);

  function setActivePart(i: number) {
    setActivePartState(i);
    router.replace(`/listening?part=${data.parts[i].id}`, { scroll: false });
  }

  const { totalRaw, partsChecked } = useMemo(() => {
    let sum = 0;
    let checkedCount = 0;
    for (const part of data.parts) {
      const saved = loadJSON<{ raw: number } | null>(`listening:part${part.id}:score`, null);
      if (saved) {
        sum += saved.raw;
        checkedCount += 1;
      }
    }
    return { totalRaw: sum, partsChecked: checkedCount };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePart, refreshTick]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 font-heading text-2xl font-bold text-primary">Listening</h1>
      <p className="mb-6 text-sm text-muted">
        4 parts, 40 questions — the same questions printed in the book, auto-marked here.
      </p>

      {partsChecked > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="font-heading text-sm font-semibold text-primary">
            Overall: {totalRaw} / 40 {partsChecked < 4 && `(${partsChecked}/4 parts checked)`}
          </span>
          <span className="text-sm text-muted">
            {t("estimated_band")}:{" "}
            <strong className="text-accent">{listeningBand(totalRaw).toFixed(1)}</strong>
          </span>
        </div>
      )}

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-white/60 p-1">
        {data.parts.map((part, i) => (
          <button
            key={part.id}
            onClick={() => setActivePart(i)}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-2 font-heading text-sm font-medium transition-colors ${
              activePart === i ? "bg-primary text-paper" : "text-ink hover:bg-accent-soft"
            }`}
          >
            Part {part.id}
          </button>
        ))}
      </div>

      <ListeningPartView
        key={data.parts[activePart].id}
        part={data.parts[activePart]}
        onScoreChange={() => setRefreshTick((n) => n + 1)}
      />
    </div>
  );
}

export default function ListeningPage() {
  return (
    <Suspense fallback={null}>
      <ListeningPageInner />
    </Suspense>
  );
}
