"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";

const links = [
  { href: "/", key: "nav_home" as const, icon: "🏠" },
  { href: "/listening", key: "nav_listening" as const, icon: "🎧" },
  { href: "/reading", key: "nav_reading" as const, icon: "📖" },
  { href: "/writing", key: "nav_writing" as const, icon: "✍️" },
  { href: "/vocabulary", key: "nav_vocabulary" as const, icon: "🗂️" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-stretch justify-between">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              {t(link.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
