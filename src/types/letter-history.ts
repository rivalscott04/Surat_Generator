
import { FormData } from "./surat-tugas";

export interface LetterHistory {
  id: string;
  letterNumber: string;
  category: string;
  subcategory: string;
  createdAt: string;
  people: string[];
  title: string;
}

export type LetterHistoryStore = {
  letters: LetterHistory[];
  addLetter: (letter: Omit<LetterHistory, "id" | "createdAt">) => void;
  getLetter: (id: string) => LetterHistory | undefined;
}
