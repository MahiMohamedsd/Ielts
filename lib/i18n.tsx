"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

const dict = {
  nav_home: { en: "Home", ar: "الرئيسية" },
  nav_listening: { en: "Listening", ar: "الاستماع" },
  nav_reading: { en: "Reading", ar: "القراءة" },
  nav_writing: { en: "Writing", ar: "الكتابة" },
  nav_vocabulary: { en: "Vocabulary", ar: "المفردات" },
  tagline: {
    en: "Free companion practice for The Algerian's IELTS Playbook",
    ar: "تدريب مجاني مكمّل لكتاب The Algerian's IELTS Playbook",
  },
  check_answers: { en: "Check answers", ar: "تحقق من الإجابات" },
  reset: { en: "Reset", ar: "إعادة تعيين" },
  play: { en: "Play", ar: "تشغيل" },
  pause: { en: "Pause", ar: "إيقاف مؤقت" },
  replay_mode: { en: "Replay (practice mode)", ar: "إعادة الاستماع (وضع التدريب)" },
  your_score: { en: "Your score", ar: "نتيجتك" },
  estimated_band: { en: "Estimated band", ar: "الدرجة التقديرية" },
  correct_answer: { en: "Correct answer", ar: "الإجابة الصحيحة" },
  reveal_model: { en: "Reveal model answer", ar: "إظهار الإجابة النموذجية" },
  hide_model: { en: "Hide model answer", ar: "إخفاء الإجابة النموذجية" },
  why_scores_well: { en: "Why this scores well", ar: "لماذا تحصل هذه الإجابة على درجة عالية" },
  write_first: {
    en: "Write your own answer first, then compare it with the model below.",
    ar: "اكتب إجابتك أولاً، ثم قارنها بالإجابة النموذجية أدناه.",
  },
  shuffle: { en: "Shuffle", ar: "خلط" },
  self_test: { en: "Self-test mode", ar: "وضع الاختبار الذاتي" },
  knew_it: { en: "Knew it", ar: "عرفتها" },
  didnt_know: { en: "Didn't know", ar: "لم أعرفها" },
  tap_to_flip: { en: "Tap card to flip", ar: "انقر على البطاقة لقلبها" },
  listen_once: {
    en: "Plays once by default, like the real exam.",
    ar: "يُشغَّل مرة واحدة افتراضيًا، تمامًا كالامتحان الحقيقي.",
  },
  progress_saved: {
    en: "Your progress is saved on this device only.",
    ar: "يُحفظ تقدّمك على هذا الجهاز فقط.",
  },
} as const;

export type DictKey = keyof typeof dict;

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = localStorage.getItem("ielts-lang");
      return stored === "ar" || stored === "en" ? stored : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("ielts-lang", lang);
    } catch {
      // ignore
    }
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key: DictKey) => dict[key][lang],
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
