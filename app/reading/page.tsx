"use client";

import { useState } from "react";
import readingData from "@/content/reading.json";
import { useLang } from "@/lib/i18n";
import { matchesAnswer, readingBand } from "@/lib/scoring";
import { loadJSON, saveJSON } from "@/lib/storage";

type TFAnswer = "TRUE" | "FALSE" | "NOT GIVEN";

type Answers = Record<string, string>;

const STORAGE_KEY = "reading:answers";
const SCORE_KEY = "reading:score";

export default function ReadingPage() {
  const { t } = useLang();
  const [answers, setAnswers] = useState<Answers>(() => loadJSON(STORAGE_KEY, {}));
  const initialScore = useState<{ raw: number } | null>(() => loadJSON(SCORE_KEY, null))[0];
  const [checked, setChecked] = useState(() => initialScore !== null);
  const [raw, setRaw] = useState(() => initialScore?.raw ?? 0);

  function setAnswer(id: number, value: string) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    saveJSON(STORAGE_KEY, next);
  }

  const total =
    readingData.questions.tf.items.length +
    readingData.questions.gap.items.length +
    readingData.questions.mc.items.length;

  function handleCheck() {
    let score = 0;
    for (const item of readingData.questions.tf.items) {
      if ((answers[item.id] ?? "") === item.answer) score += 1;
    }
    for (const item of readingData.questions.gap.items) {
      const alt = "alt" in item ? (item.alt as string[]) : [];
      if (matchesAnswer(answers[item.id] ?? "", item.answer, alt)) score += 1;
    }
    for (const item of readingData.questions.mc.items) {
      if ((answers[item.id] ?? "") === item.answer) score += 1;
    }
    setRaw(score);
    setChecked(true);
    saveJSON(SCORE_KEY, { raw: score });
  }

  function handleReset() {
    setAnswers({});
    setChecked(false);
    setRaw(0);
    saveJSON(STORAGE_KEY, {});
    saveJSON(SCORE_KEY, null);
  }

  const tfOptions: TFAnswer[] = ["TRUE", "FALSE", "NOT GIVEN"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 font-heading text-2xl font-bold text-primary">Reading</h1>
      <p className="mb-6 text-sm text-muted">{readingData.instructions}</p>

      <article className="prose-reading mb-10 rounded-lg border border-rule bg-white/70 p-5 md:p-8">
        <h2 className="mb-4 text-center font-heading text-xl font-bold text-primary">
          {readingData.title}
        </h2>
        <div className="space-y-4 text-[1.02rem] leading-[1.9]" style={{ fontFamily: "var(--font-body)" }}>
          {readingData.passage.map((para, i) => (
            <p key={i} className="indent-6">
              {para}
            </p>
          ))}
        </div>
      </article>

      <section className="mb-8">
        <h3 className="mb-3 font-heading text-base font-semibold text-primary">
          Questions 1–5
        </h3>
        <p className="mb-3 text-sm text-muted">{readingData.questions.tf.instructions}</p>
        <div className="space-y-3">
          {readingData.questions.tf.items.map((item) => {
            const given = answers[item.id] ?? "";
            const correct = checked && given === item.answer;
            const wrong = checked && !correct;
            return (
              <div
                key={item.id}
                className={`rounded-md border p-3 ${
                  checked
                    ? correct
                      ? "border-green-600 bg-green-50"
                      : "border-mistake-border bg-mistake-bg"
                    : "border-rule bg-white/50"
                }`}
              >
                <p className="mb-2 text-sm text-ink">
                  {item.id}. {item.statement}
                </p>
                <div className="flex flex-wrap gap-3">
                  {tfOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 text-sm">
                      <input
                        type="radio"
                        name={`tf${item.id}`}
                        checked={given === opt}
                        disabled={checked}
                        onChange={() => setAnswer(item.id, opt)}
                        className="accent-accent"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {wrong && (
                  <p className="mt-1 text-xs text-mistake-border">
                    {t("correct_answer")}: <strong>{item.answer}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 font-heading text-base font-semibold text-primary">
          Questions 6–9
        </h3>
        <p className="mb-3 text-sm text-muted">{readingData.questions.gap.instructions}</p>
        <div className="space-y-3">
          {readingData.questions.gap.items.map((item) => {
            const given = answers[item.id] ?? "";
            const alt = "alt" in item ? (item.alt as string[]) : [];
            const correct = checked && matchesAnswer(given, item.answer, alt);
            const wrong = checked && !correct;
            return (
              <div
                key={item.id}
                className={`rounded-md border p-3 ${
                  checked
                    ? correct
                      ? "border-green-600 bg-green-50"
                      : "border-mistake-border bg-mistake-bg"
                    : "border-rule bg-white/50"
                }`}
              >
                <label className="mb-1 block text-sm text-ink">
                  {item.id}. {item.prompt}
                </label>
                <input
                  type="text"
                  value={given}
                  disabled={checked}
                  onChange={(e) => setAnswer(item.id, e.target.value)}
                  className="w-full max-w-xs rounded border border-rule bg-white px-2 py-1.5 text-sm disabled:opacity-80"
                />
                {wrong && (
                  <p className="mt-1 text-xs text-mistake-border">
                    {t("correct_answer")}: <strong>{item.answer}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 font-heading text-base font-semibold text-primary">
          Questions 10–13
        </h3>
        <p className="mb-3 text-sm text-muted">{readingData.questions.mc.instructions}</p>
        <div className="space-y-3">
          {readingData.questions.mc.items.map((item) => {
            const given = answers[item.id] ?? "";
            const correct = checked && given === item.answer;
            const wrong = checked && !correct;
            return (
              <div
                key={item.id}
                className={`rounded-md border p-3 ${
                  checked
                    ? correct
                      ? "border-green-600 bg-green-50"
                      : "border-mistake-border bg-mistake-bg"
                    : "border-rule bg-white/50"
                }`}
              >
                <p className="mb-2 text-sm text-ink">
                  {item.id}. {item.prompt}
                </p>
                <div className="space-y-1">
                  {item.options.map((opt) => (
                    <label key={opt.letter} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`mc${item.id}`}
                        checked={given === opt.letter}
                        disabled={checked}
                        onChange={() => setAnswer(item.id, opt.letter)}
                        className="accent-accent"
                      />
                      {opt.letter}. {opt.label}
                    </label>
                  ))}
                </div>
                {wrong && (
                  <p className="mt-1 text-xs text-mistake-border">
                    {t("correct_answer")}: <strong>{item.answer}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="sticky bottom-16 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-rule bg-paper/95 p-3 backdrop-blur md:bottom-0">
        {!checked ? (
          <button
            onClick={handleCheck}
            className="rounded-md bg-accent px-5 py-2 font-heading text-sm font-semibold text-white hover:bg-[#8a0c1e]"
          >
            {t("check_answers")}
          </button>
        ) : (
          <>
            <div className="font-heading text-sm font-semibold text-primary">
              {t("your_score")}: {raw} / {total}
            </div>
            <div className="text-sm text-muted">
              {t("estimated_band")}:{" "}
              <strong className="text-accent">{readingBand(raw).toFixed(1)}</strong>
            </div>
            <button
              onClick={handleReset}
              className="ml-auto rounded-md border border-primary px-4 py-1.5 font-heading text-xs font-semibold text-primary hover:bg-primary hover:text-paper"
            >
              {t("reset")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
