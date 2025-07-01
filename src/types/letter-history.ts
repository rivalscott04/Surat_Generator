import { FormData, Person } from "./surat-tugas";

export interface LetterHistory {
  id: string;
  letterNumber: string;
  category: string;
  subcategory: string;
  documentType: string; // Jenis surat: "Surat Tugas", "Nota Dinas", "Surat Keputusan"
  createdAt: string;
  people: Person[];
  title: string;
  useTableFormat?: boolean; // true = tabel, false = list
  menimbang: string[]; // point a dan b
  dasar: string;
  signatureName?: string;
}

export type LetterHistoryStore = {
  letters: LetterHistory[];
  addLetter: (letter: Omit<LetterHistory, "id" | "createdAt">) => void;
  getLetter: (id: string) => LetterHistory | undefined;
  clearStorage: () => void;
}
