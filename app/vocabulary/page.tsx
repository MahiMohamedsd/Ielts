"use client";

import { useMemo, useState } from "react";
import vocabData from "@/content/vocabulary.json";
import { useLang } from "@/lib/i18n";
import { saveJSON } from "@/lib/storage";

type Word = { en: string; ar: string; fr: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VocabularyPage() {
  const { t, lang } = useLang();
  const themes = vocabData.themes;
  const [themeIdx, setThemeIdx] = useState(0);
  const [selfTest, setSelfTest] = useState(false);
  const [queue, setQueue] = useState<Word[]>(() => themes[0].words);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknownPile, setUnknownPile] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const theme = themes[themeIdx];
  const current = queue[0];

  function selectTheme(i: number) {
    setThemeIdx(i);
    setQueue(themes[i].words);
    setFlipped(false);
    setKnown(0);
    setUnknownPile([]);
    setFinished(false);
    saveJSON(`vocab:lastTheme`, { themeIdx: i });
  }

  function handleShuffle() {
    setQueue(shuffle(queue));
    setFlipped(false);
  }

  function handleKnew() {
    setKnown((k) => k + 1);
    const rest = queue.slice(1);
    setFlipped(false);
    if (rest.length === 0) setFinished(true);
    setQueue(rest);
  }

  function handleDidntKnow() {
    if (!current) return;
    setUnknownPile((p) => (p.includes(current.en) ? p : [...p, current.en]));
    const rest = queue.slice(1);
    setQueue([...rest, current]);
    setFlipped(false);
  }

  function restart() {
    setQueue(shuffle(theme.words));
    setFlipped(false);
    setKnown(0);
    setUnknownPile([]);
    setFinished(false);
  }

  const totalWords = useMemo(() => themes.reduce((s, th) => s + th.words.length, 0), [themes]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 font-heading text-2xl font-bold text-primary">Vocabulary</h1>
      <p className="mb-6 text-sm text-muted">
        {totalWords} words from the book, grouped into 8 themes. {t("tap_to_flip")}.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {themes.map((th, i) => (
          <button
            key={th.name}
            onClick={() => selectTheme(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              themeIdx === i
                ? "border-primary bg-primary text-paper"
                : "border-rule bg-white/60 text-ink hover:border-primary"
            }`}
          >
            {th.name}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={selfTest}
            onChange={(e) => {
              setSelfTest(e.target.checked);
              restart();
            }}
            className="accent-accent"
          />
          {t("self_test")}
        </label>
        <button
          onClick={handleShuffle}
          className="rounded-md border border-primary px-3 py-1.5 font-heading text-xs font-semibold text-primary hover:bg-primary hover:text-paper"
        >
          🔀 {t("shuffle")}
        </button>
      </div>

      {finished ? (
        <div className="rounded-lg border border-rule bg-white/70 p-6 text-center">
          <p className="mb-2 font-heading text-lg font-semibold text-primary">
            Session complete — {theme.name}
          </p>
          <p className="mb-4 text-sm text-muted">
            {known} / {theme.words.length} marked &quot;{t("knew_it")}&quot;
            {unknownPile.length > 0 && (
              <> · {unknownPile.length} to review again: {unknownPile.join(", ")}</>
            )}
          </p>
          <button
            onClick={restart}
            className="rounded-md bg-accent px-5 py-2 font-heading text-sm font-semibold text-white hover:bg-[#8a0c1e]"
          >
            Restart this theme
          </button>
        </div>
      ) : current ? (
        <>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="mb-4 flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 border-vocab-border bg-vocab-bg p-6 text-center shadow-sm transition-transform active:scale-[0.99]"
          >
            {!flipped ? (
              <span className="font-heading text-3xl font-bold text-primary">{current.en}</span>
            ) : (
              <div className="space-y-3">
                <p dir="rtl" className="font-heading text-2xl font-semibold text-primary">
                  {current.ar}
                </p>
                <p className="text-lg italic text-muted">{current.fr}</p>
              </div>
            )}
            <span className="mt-4 text-xs text-muted">{t("tap_to_flip")}</span>
          </button>

          <p className="mb-4 text-center text-xs text-muted">
            {queue.length} card{queue.length === 1 ? "" : "s"} left in this pass
          </p>

          {selfTest && (
            <div className="flex gap-3">
              <button
                onClick={handleDidntKnow}
                className="flex-1 rounded-md border border-mistake-border bg-mistake-bg px-4 py-2.5 font-heading text-sm font-semibold text-mistake-border"
              >
                ✕ {t("didnt_know")}
              </button>
              <button
                onClick={handleKnew}
                className="flex-1 rounded-md border border-green-600 bg-green-50 px-4 py-2.5 font-heading text-sm font-semibold text-green-700"
              >
                ✓ {t("knew_it")}
              </button>
            </div>
          )}

          {!selfTest && (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setQueue((q) => [...q.slice(1), q[0]]);
                  setFlipped(false);
                }}
                className="rounded-md border border-primary px-5 py-2 font-heading text-sm font-semibold text-primary hover:bg-primary hover:text-paper"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : null}

      <p className="mt-6 text-center text-xs text-muted" dir={lang === "ar" ? "rtl" : "ltr"}>
        {lang === "ar"
          ? "الكلمات التي تجيب عنها بشكل صحيح ثلاثة أيام متتالية تُعتبر متعلَّمة."
          : "Words you get right three days running are learned."}
      </p>
    </div>
  );
}
