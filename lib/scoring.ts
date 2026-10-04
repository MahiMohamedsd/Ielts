export function normalise(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?]/g, "");
}

export function matchesAnswer(given: string, answer: string, alt: string[] = []): boolean {
  const g = normalise(given);
  if (!g) return false;
  const candidates = [answer, ...alt].map(normalise);
  return candidates.includes(g);
}

// Listening band conversion, reused from the book's Part 1 conversion table (raw score out of 40).
export function listeningBand(rawScore: number): number {
  const table: [number, number][] = [
    [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
    [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4],
  ];
  for (const [min, band] of table) {
    if (rawScore >= min) return band;
  }
  return 3.5;
}

// Reading band conversion (raw score out of 13, Academic-style approximation).
export function readingBand(rawScore: number): number {
  const table: [number, number][] = [
    [13, 9], [12, 8.5], [11, 8], [10, 7.5], [9, 7], [8, 6.5],
    [7, 6], [6, 5.5], [5, 5], [4, 4.5],
  ];
  for (const [min, band] of table) {
    if (rawScore >= min) return band;
  }
  return 4;
}
