"use client";

const PREFIX = "ielts-playbook:";

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

export type SectionId = "listening" | "reading" | "writing" | "vocabulary";

export function markSectionProgress(section: SectionId, partial: Record<string, unknown>) {
  const current = loadJSON<Record<string, unknown>>(`progress:${section}`, {});
  saveJSON(`progress:${section}`, { ...current, ...partial, updatedAt: Date.now() });
}

export function getSectionProgress<T extends Record<string, unknown>>(
  section: SectionId,
  fallback: T
): T {
  return loadJSON(`progress:${section}`, fallback);
}
