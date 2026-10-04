"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

export type ScriptLine = { speaker: string; text: string };

export default function AudioScriptPlayer({
  title,
  audioSrc,
  script,
}: {
  title: string;
  audioSrc: string;
  script: ScriptLine[];
}) {
  const { t } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mp3Available, setMp3Available] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [hasPlayed, setHasPlayed] = useState(false);
  const [replayMode, setReplayMode] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);

  const speakers = useMemo(() => {
    const unique = Array.from(new Set(script.map((l) => l.speaker)));
    return unique;
  }, [script]);

  // Probe whether the real mp3 exists; fall back to speech synthesis if not.
  useEffect(() => {
    let cancelled = false;
    fetch(audioSrc, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setMp3Available(res.ok);
      })
      .catch(() => {
        if (!cancelled) setMp3Available(false);
      });
    return () => {
      cancelled = true;
    };
  }, [audioSrc]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const disabled = hasPlayed && !replayMode;

  function playMp3() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
    setIsPlaying(true);
  }

  function playFallback() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(true);
    setLineIndex(0);

    const voices = window.speechSynthesis.getVoices();
    const speakerVoice = new Map<string, SpeechSynthesisVoice | undefined>();
    speakers.forEach((sp, i) => {
      speakerVoice.set(sp, voices[i % Math.max(voices.length, 1)]);
    });

    let i = 0;
    const speakNext = () => {
      if (i >= script.length) {
        setIsPlaying(false);
        setHasPlayed(true);
        setProgress(100);
        setLineIndex(-1);
        return;
      }
      const line = script[i];
      const utter = new SpeechSynthesisUtterance(line.text);
      const voice = speakerVoice.get(line.speaker);
      if (voice) utter.voice = voice;
      utter.rate = 0.95;
      setLineIndex(i);
      utter.onend = () => {
        i += 1;
        setProgress(Math.round((i / script.length) * 100));
        speakNext();
      };
      utter.onerror = () => {
        i += 1;
        speakNext();
      };
      window.speechSynthesis.speak(utter);
    };
    speakNext();
  }

  function handlePlayPause() {
    if (disabled) return;
    if (isPlaying) {
      if (mp3Available) audioRef.current?.pause();
      else window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }
    if (mp3Available) playMp3();
    else playFallback();
  }

  return (
    <div className="rounded-lg border border-rule bg-white/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-heading text-sm font-semibold text-primary">{title}</h4>
        <label className="flex items-center gap-1.5 text-xs text-muted">
          <input
            type="checkbox"
            checked={replayMode}
            onChange={(e) => setReplayMode(e.target.checked)}
            className="accent-accent"
          />
          {t("replay_mode")}
        </label>
      </div>

      {mp3Available && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress((el.currentTime / el.duration) * 100);
          }}
          onEnded={() => {
            setIsPlaying(false);
            setHasPlayed(true);
            setProgress(100);
          }}
          className="hidden"
        />
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          disabled={disabled}
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full font-heading text-lg ${
            disabled
              ? "cursor-not-allowed bg-rule text-muted"
              : "bg-accent text-white hover:bg-[#8a0c1e]"
          }`}
          aria-label={isPlaying ? t("pause") : t("play")}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-rule">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs text-muted">{Math.round(progress)}%</span>
      </div>

      <p className="mt-2 text-xs text-muted">{t("listen_once")}</p>

      {mp3Available === false && (
        <p className="mt-1 text-xs text-muted">
          Audio file not found — using your browser&apos;s built-in voice as a stand-in until a
          recorded MP3 is added at <code className="rounded bg-example-bg px-1">{audioSrc}</code>.
        </p>
      )}

      {lineIndex >= 0 && mp3Available === false && (
        <p className="mt-2 rounded bg-example-bg px-3 py-2 text-sm italic text-ink">
          {script[lineIndex].speaker}: {script[lineIndex].text}
        </p>
      )}
    </div>
  );
}
