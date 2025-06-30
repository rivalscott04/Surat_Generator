

export interface Person {
  nama: string;
  nip: string;
  pangkat: string;
  jabatan: string;
  unitKerja: string;
  keterangan: string;
}

export interface FormData {
  nomor: string;
  category: string;
  subcategory: string;
  month: string;
  year: string;
  menimbangA: string;
  dasar: string;
  people: Person[];
  untuk: string;
  useTTE: boolean;
  anchorSymbol: string;
  useTableFormat: boolean;
  signatureName: string;
}

// Anchor symbol options
export const anchorSymbols = [
  { id: "hash", symbol: "#" },
  { id: "dollar", symbol: "$" },
  { id: "caret", symbol: "^" },
];

export interface StaticData {
  menimbangB: string;
  headerInfo: {
    address: string;
    website: string;
  };
}

export const staticData: StaticData = {
  menimbangB: "Bahwa yang namanya tercantum dalam Surat Tugas ini dipandang mampu melaksanakan tugas dimaksud.",
  headerInfo: {
    address: "Jalan Udayana No. 06 Mataram NTB, (0370) 625661, Fax. (0370) 625317",
    website: "Website: www.ntb.kemenag.go.id, Email: ntb@kemenag.go.id",
  },
};

