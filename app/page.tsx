"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Tip } from "@/components/Boxes";

const cards = [
  {
    href: "/listening",
    icon: "🎧",
    title: "Listening",
    desc: "4 parts, 40 questions. Listen, answer, and get an instant score + estimated band.",
  },
  {
    href: "/reading",
    icon: "📖",
    title: "Reading",
    desc: "The full passage from the book, on screen, with 13 auto-marked questions.",
  },
  {
    href: "/writing",
    icon: "✍️",
    title: "Writing",
    desc: "Task 1 and Task 2 prompts with two full model answers each, annotated against the band criteria.",
  },
  {
    href: "/vocabulary",
    icon: "🗂️",
    title: "Vocabulary",
    desc: "144 words from the book as flashcards, grouped by theme, with a self-test mode.",
  },
];

const steps = [
  {
    en: "Find the QR code or link for the section you're studying in the book.",
    ar: "ابحث عن رمز الاستجابة السريعة أو الرابط الخاص بالقسم الذي تدرسه في الكتاب.",
  },
  {
    en: "Answer the printed questions here on your phone — audio, passage, and model answers all live on this site.",
    ar: "أجب عن الأسئلة المطبوعة هنا على هاتفك — الصوت والنص والإجابات النموذجية كلها على هذا الموقع.",
  },
  {
    en: "Tap \"Check answers\" for an instant score. Your progress is saved on this device so you can pick up where you left off.",
    ar: "اضغط على \"تحقق من الإجابات\" للحصول على نتيجة فورية. يُحفظ تقدّمك على هذا الجهاز لتتابع من حيث توقفت.",
  },
];

export default function Home() {
  const { lang } = useLang();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-10 rounded-xl bg-primary px-6 py-10 text-paper md:px-10 md:py-14">
        <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-accent-soft">
          Companion Website
        </p>
        <h1 className="mb-4 font-heading text-3xl font-bold leading-tight md:text-4xl">
          The Algerian&apos;s IELTS Playbook
        </h1>
        <p className="max-w-2xl text-base text-paper/90 md:text-lg">
          Free, mobile-first practice to go with your book: listen to the four recordings, read
          the full passage, study model writing answers, and drill the 160-word vocabulary list —
          all auto-marked, no login, no payment.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-primary">
          How to use this with your book
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="rounded-lg border border-rule bg-white/60 p-4"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent font-heading text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-ink">{lang === "ar" ? step.ar : step.en}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-lg border border-rule bg-white/60 p-5 transition-colors hover:border-accent"
          >
            <div className="mb-2 text-2xl">{card.icon}</div>
            <h3 className="mb-1 font-heading text-lg font-semibold text-primary group-hover:text-accent">
              {card.title}
            </h3>
            <p className="text-sm text-muted">{card.desc}</p>
          </Link>
        ))}
      </section>

      <Tip>
        No login, no payment, no backend. Your progress (which parts you&apos;ve completed, your
        scores) is stored only on this device in your browser.
      </Tip>
    </div>
  );
}
