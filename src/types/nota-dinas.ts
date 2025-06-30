
export interface NotaDinasData {
  nomor: string;
  category: string;
  subcategory: string;
  month: string;
  year: string;
  kepada: string;
  dari: string;
  perihal: string;
  tanggalSurat: string;  // Made non-optional
  tanggal: string;
  hari: string;
  waktu: string;
  tempat: string;
  narasi: string;
  useTTE: boolean;
  anchorSymbol: string;
  signatureName: string;
}

export interface StaticData {
  headerInfo: {
    address: string;
    website: string;
  };
}

export const staticData: StaticData = {
  headerInfo: {
    address: "Jalan Udayana No. 06 Mataram NTB, (0370) 625661, Fax. (0370) 625317",
    website: "Website: www.ntb.kemenag.go.id, Email: ntb@kemenag.go.id",
  },
};
