import { anchorSymbols } from "@/types/surat-tugas";

export function formatLetterNumber(
  userNumber: string, 
  subcategory: string, 
  month: string, 
  year: string, 
  category: string
): string {
  // Special format for Surat Keputusan: B-no/KW.18.01/KP.01.01/bulan/tahun
  if (category === "Surat Keputusan") {
    return userNumber ? `B-${userNumber}/KW.18.01/KP.01.01/${month}/${year}` : "";
  }
  
  // Special format for Organisasi dan Tata Laksana (OT)
  if (category === "OT") {
    const trimmedSubcode = subcategory.replace("OT.", "");
    return userNumber ? `B-${userNumber}/OT.${trimmedSubcode}/${month}/${year}` : "";
  }
  
  // Default format for other categories: 123/Kw.18.01/2/${subcategory}/${month}/${year}
  return userNumber ? `${userNumber}/Kw.18.01/2/${subcategory}/${month}/${year}` : "";
}

export function getCurrentDate(): string {
  return new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function getAnchorSymbol(anchorId: string, symbols: typeof anchorSymbols): string {
  const selectedAnchor = symbols.find((a) => a.id === anchorId);
  return selectedAnchor ? selectedAnchor.symbol : "^";
}

// Tambahkan fungsi format date untuk UI
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  };
  return date.toLocaleDateString('id-ID', options);
}
