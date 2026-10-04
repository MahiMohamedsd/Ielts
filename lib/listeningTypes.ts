export type Option = { letter: string; label: string };

export type GapQuestion = {
  id: number;
  type: "gap";
  prompt: string;
  answer: string;
  alt?: string[];
};

export type McQuestion = {
  id: number;
  type: "mc";
  prompt: string;
  options: Option[];
  answer: string;
};

export type MultiQuestion = {
  id: string;
  type: "multi";
  prompt: string;
  options: Option[];
  answer: string[];
};

export type MatchingQuestion = {
  id: string;
  type: "matching";
  prompt: string;
  options: Option[];
  items: { id: number; label: string; answer: string }[];
};

export type ListeningQuestion = GapQuestion | McQuestion | MultiQuestion | MatchingQuestion;

export type ListeningPart = {
  id: number;
  title: string;
  subtitle: string;
  accent: string;
  audioFile: string;
  instructions: string;
  script: { speaker: string; text: string }[];
  questions: ListeningQuestion[];
};

export type ListeningData = {
  bandConversion: { min: number; band: number }[];
  parts: ListeningPart[];
};

export function questionPoints(q: ListeningQuestion): number {
  if (q.type === "matching") return q.items.length;
  if (q.type === "multi") return q.answer.length;
  return 1;
}

export function partTotalPoints(part: ListeningPart): number {
  return part.questions.reduce((sum, q) => sum + questionPoints(q), 0);
}
