"use client";

import { useState } from "react";
import writingData from "@/content/writing.json";
import { useLang } from "@/lib/i18n";
import { Tip } from "@/components/Boxes";

type ChartModel = {
  id: string;
  title: string;
  note?: string;
  prompt: string;
  modelAnswer: string[];
  whyScoresWell: { en: string; ar: string };
  table?: { type: "table"; headers: string[]; rows: string[][] };
  process?: { type: "process"; stages: string[] };
};

function DataTable({ table }: { table: NonNullable<ChartModel["table"]> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-rule bg-white/70">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-primary text-paper">
            {table.headers.map((h) => (
              <th key={h} className="px-3 py-2 font-heading text-xs font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white/60" : "bg-example-bg"}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProcessDiagram({ process }: { process: NonNullable<ChartModel["process"]> }) {
  return (
    <div className="rounded-lg border border-rule bg-white/70 p-4">
      <ol className="space-y-2">
        {process.stages.map((stage, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-paper">
              {i + 1}
            </span>
            <span className="text-sm text-ink">{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ModelCard({ model }: { model: ChartModel }) {
  const { t, lang } = useLang();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mb-8 rounded-lg border border-rule bg-white/60 p-5">
      <h3 className="mb-1 font-heading text-base font-semibold text-primary">{model.title}</h3>
      {model.note && <p className="mb-3 text-xs italic text-muted">{model.note}</p>}

      <p className="mb-4 rounded bg-example-bg px-3 py-2 text-sm italic text-ink">
        <strong className="not-italic">Prompt: </strong>
        {model.prompt}
      </p>

      {model.table && <DataTable table={model.table} />}
      {model.process && <ProcessDiagram process={model.process} />}

      <Tip label="Try it yourself">{t("write_first")}</Tip>

      <button
        onClick={() => setRevealed((r) => !r)}
        className="mt-4 rounded-md border border-primary px-4 py-2 font-heading text-sm font-semibold text-primary hover:bg-primary hover:text-paper"
      >
        {revealed ? t("hide_model") : t("reveal_model")}
      </button>

      {revealed && (
        <div className="mt-4 space-y-4">
          <div className="rounded-md border border-vocab-border bg-vocab-bg p-4 text-[0.95rem] leading-relaxed">
            {model.modelAnswer.map((para, i) => (
              <p key={i} className={i > 0 ? "mt-3" : ""}>
                {para}
              </p>
            ))}
          </div>
          <div
            className="rounded-md bg-example-bg p-4 text-sm leading-relaxed"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <p className="mb-1 font-heading text-xs font-bold uppercase tracking-wide text-muted">
              {t("why_scores_well")}
            </p>
            <p className="italic">{lang === "ar" ? model.whyScoresWell.ar : model.whyScoresWell.en}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WritingPage() {
  const [activeTask, setActiveTask] = useState<"task1" | "task2">("task1");
  const task = writingData[activeTask];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 font-heading text-2xl font-bold text-primary">Writing</h1>
      <p className="mb-6 text-sm text-muted">
        Write your own answer first, as the book instructs — model answers are collapsed by
        default.
      </p>

      <div className="mb-6 flex gap-1 rounded-lg bg-white/60 p-1">
        {(["task1", "task2"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTask(key)}
            className={`flex-1 rounded-md px-3 py-2 font-heading text-sm font-medium transition-colors ${
              activeTask === key ? "bg-primary text-paper" : "text-ink hover:bg-accent-soft"
            }`}
          >
            {writingData[key].label}
          </button>
        ))}
      </div>

      {task.models.map((model) => (
        <ModelCard key={model.id} model={model as ChartModel} />
      ))}
    </div>
  );
}
