"use client";

import { useState } from "react";
import type { ListeningPart } from "@/lib/listeningTypes";
import { partTotalPoints } from "@/lib/listeningTypes";
import { matchesAnswer } from "@/lib/scoring";
import { useLang } from "@/lib/i18n";
import AudioScriptPlayer from "@/components/AudioScriptPlayer";
import { loadJSON, saveJSON } from "@/lib/storage";

type Answers = Record<string, string | string[]>;

export default function ListeningPartView({
  part,
  onScoreChange,
}: {
  part: ListeningPart;
  onScoreChange?: () => void;
}) {
  const { t } = useLang();
  const storageKey = `listening:v2:part${part.id}:answers`;
  const scoreKey = `listening:v2:part${part.id}:score`;

  const [answers, setAnswers] = useState<Answers>(() => loadJSON(storageKey, {}));
  const initialScore = useState<{ raw: number } | null>(() => loadJSON(scoreKey, null))[0];
  const [checked, setChecked] = useState(() => initialScore !== null);
  const [raw, setRaw] = useState(() => initialScore?.raw ?? 0);

  const total = partTotalPoints(part);

  function setAnswer(id: string | number, value: string | string[]) {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    saveJSON(storageKey, next);
  }

  function handleCheck() {
    let score = 0;
    for (const q of part.questions) {
      if (q.type === "gap") {
        const given = (answers[q.id] as string) ?? "";
        if (matchesAnswer(given, q.answer, q.alt)) score += 1;
      } else if (q.type === "mc") {
        if (answers[q.id] === q.answer) score += 1;
      } else if (q.type === "multi") {
        const given = (answers[q.id] as string[]) ?? [];
        for (const letter of given) {
          if (q.answer.includes(letter)) score += 1;
        }
      } else if (q.type === "matching") {
        for (const item of q.items) {
          if (answers[item.id] === item.answer) score += 1;
        }
      }
    }
    setRaw(score);
    setChecked(true);
    saveJSON(scoreKey, { raw: score });
    onScoreChange?.();
  }

  function handleReset() {
    setAnswers({});
    setChecked(false);
    setRaw(0);
    saveJSON(storageKey, {});
    saveJSON(scoreKey, null);
    onScoreChange?.();
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-heading text-lg font-bold text-primary">{part.title}</h2>
        <p className="text-sm text-muted">{part.subtitle} · {part.accent} accent</p>
      </div>

      <AudioScriptPlayer
        title={`${part.title} — audio`}
        audioSrc={part.audioFile}
        script={part.script}
      />

      <p className="my-4 rounded bg-example-bg px-3 py-2 text-sm text-ink">{part.instructions}</p>

      <div className="space-y-4">
        {part.questions.map((q) => {
          if (q.type === "gap") {
            const given = (answers[q.id] as string) ?? "";
            const correct = checked && matchesAnswer(given, q.answer, q.alt);
            const wrong = checked && !correct;
            return (
              <div
                key={q.id}
                className={`rounded-md border p-3 ${
                  checked
                    ? correct
                      ? "border-green-600 bg-green-50"
                      : "border-mistake-border bg-mistake-bg"
                    : "border-rule bg-white/50"
                }`}
              >
                <label className="mb-1 block text-sm font-medium text-ink">
                  {q.id}. {q.prompt}
                </label>
                <input
                  type="text"
                  value={given}
                  disabled={checked}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className="w-full max-w-xs rounded border border-rule bg-white px-2 py-1.5 text-sm disabled:opacity-80"
                />
                {wrong && (
                  <p className="mt-1 text-xs text-mistake-border">
                    {t("correct_answer")}: <strong>{q.answer}</strong>
                  </p>
                )}
              </div>
            );
          }

          if (q.type === "mc") {
            const given = (answers[q.id] as string) ?? "";
            const correct = checked && given === q.answer;
            const wrong = checked && !correct;
            return (
              <div
                key={q.id}
                className={`rounded-md border p-3 ${
                  checked
                    ? correct
                      ? "border-green-600 bg-green-50"
                      : "border-mistake-border bg-mistake-bg"
                    : "border-rule bg-white/50"
                }`}
              >
                <p className="mb-2 text-sm font-medium text-ink">
                  {q.id}. {q.prompt}
                </p>
                <div className="space-y-1">
                  {q.options.map((opt) => (
                    <label key={opt.letter} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={given === opt.letter}
                        disabled={checked}
                        onChange={() => setAnswer(q.id, opt.letter)}
                        className="accent-accent"
                      />
                      <span>
                        {opt.letter}. {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
                {wrong && (
                  <p className="mt-1 text-xs text-mistake-border">
                    {t("correct_answer")}: <strong>{q.answer}</strong>
                  </p>
                )}
              </div>
            );
          }

          if (q.type === "multi") {
            const given = (answers[q.id] as string[]) ?? [];
            const maxPick = q.answer.length;
            return (
              <div
                key={q.id}
                className={`rounded-md border p-3 ${
                  checked ? "border-primary bg-white/60" : "border-rule bg-white/50"
                }`}
              >
                <p className="mb-2 text-sm font-medium text-ink">
                  {q.id}. {q.prompt}
                </p>
                <div className="space-y-1">
                  {q.options.map((opt) => {
                    const isChecked = given.includes(opt.letter);
                    const showRight = checked && q.answer.includes(opt.letter);
                    const showWrong = checked && isChecked && !q.answer.includes(opt.letter);
                    return (
                      <label
                        key={opt.letter}
                        className={`flex items-center gap-2 text-sm ${
                          showRight ? "font-semibold text-green-700" : ""
                        } ${showWrong ? "text-mistake-border line-through" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={checked || (!isChecked && given.length >= maxPick)}
                          onChange={() => {
                            const next = isChecked
                              ? given.filter((l) => l !== opt.letter)
                              : [...given, opt.letter];
                            setAnswer(q.id, next);
                          }}
                          className="accent-accent"
                        />
                        <span>
                          {opt.letter}. {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {checked && (
                  <p className="mt-1 text-xs text-muted">
                    {t("correct_answer")}: <strong>{q.answer.join(", ")}</strong>
                  </p>
                )}
              </div>
            );
          }

          // matching
          return (
            <div key={q.id} className="rounded-md border border-rule bg-white/50 p-3">
              <p className="mb-2 text-sm font-medium text-ink">{q.prompt}</p>
              <div className="space-y-2">
                {q.items.map((item) => {
                  const given = (answers[item.id] as string) ?? "";
                  const correct = checked && given === item.answer;
                  const wrong = checked && !correct;
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-wrap items-center justify-between gap-2 rounded p-2 ${
                        checked ? (correct ? "bg-green-50" : "bg-mistake-bg") : ""
                      }`}
                    >
                      <span className="text-sm">
                        {item.id}. {item.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={given}
                          disabled={checked}
                          onChange={(e) => setAnswer(item.id, e.target.value)}
                          className="rounded border border-rule bg-white px-2 py-1 text-sm"
                        >
                          <option value="">—</option>
                          {q.options.map((opt) => (
                            <option key={opt.letter} value={opt.letter}>
                              {opt.letter}. {opt.label}
                            </option>
                          ))}
                        </select>
                        {wrong && (
                          <span className="text-xs text-mistake-border">
                            {t("correct_answer")}: <strong>{item.answer}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-16 z-10 mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-rule bg-paper/95 p-3 backdrop-blur md:bottom-0">
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
