"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";

const links = [
  { href: "/", key: "nav_home" as const },
  { href: "/listening", key: "nav_listening" as const },
  { href: "/reading", key: "nav_reading" as const },
  { href: "/writing", key: "nav_writing" as const },
  { href: "/vocabulary", key: "nav_vocabulary" as const },
];

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-primary font-heading text-sm font-bold text-paper">
            IP
          </span>
          <span className="hidden font-heading text-sm font-semibold leading-tight text-primary sm:block">
            THE ALGERIAN&apos;S
            <br />
            IELTS PLAYBOOK
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 font-heading text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-paper"
                    : "text-ink hover:bg-accent-soft"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="rounded-full border border-primary px-3 py-1.5 font-heading text-xs font-semibold text-primary hover:bg-primary hover:text-paper"
          aria-label="Toggle Arabic / English"
        >
          {lang === "en" ? "العربية" : "English"}
        </button>
      </div>
    </header>
  );
}
