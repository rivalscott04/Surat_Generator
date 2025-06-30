
import { Person } from "./surat-tugas";

export interface SuratKeputusanData {
  nomor: string;
  category: string;
  subcategory: string;
  month: string;
  year: string;
  tentang: string;
  person: Person;
  memutuskan: {
    pertama: string;
    kedua: string;
    ketiga: string;
  };
  useTTE: boolean;
  anchorSymbol: string;
  signatureName: string;
}

export interface SuratKeputusanContentProps {
  formData: SuratKeputusanData;
  staticData: StaticData;
  formatLetterNumber: (num: string) => string;
  getCurrentDate: () => string;
  getAnchorSymbol: () => string;
}

export interface StaticData {
  headerInfo: {
    title: string;
  };
  introText: string;
  menteri: string;
}

export const staticData: StaticData = {
  headerInfo: {
    title: "KEPUTUSAN MENTERI AGAMA REPUBLIK INDONESIA"
  },
  introText: "DENGAN RAHMAT TUHAN YANG MAHA ESA",
  menteri: "MENTERI AGAMA REPUBLIK INDONESIA"
};
