import { useState } from "react";
import { Search, ArrowUpDown, FileText, Maximize2, X } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LetterHistory } from "@/types/letter-history";
import { formatDate } from "@/utils/letter-utils";
import LetterContent from "./LetterContent";
import { Person, staticData, FormData } from "@/types/surat-tugas";
import NotaDinasContent from "../nota-dinas/NotaDinasContent";
import { NotaDinasData, staticData as notaDinasStaticData } from "@/types/nota-dinas";
import SuratKeputusanContent from "../surat-keputusan/SuratKeputusanContent";
import { SuratKeputusanData, staticData as suratKeputusanStaticData } from "@/types/surat-keputusan";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface LetterTableProps {
  letters: LetterHistory[];
  documentType: "Surat Tugas" | "Nota Dinas" | "Surat Keputusan";
}

const LetterTable: React.FC<LetterTableProps> = ({ letters, documentType }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<LetterHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LetterHistory;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  
  const handleSort = (key: keyof LetterHistory) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === "asc" 
          ? "desc" 
          : "asc",
    });
  };
  
  const filteredLetters = letters
    .filter(letter => 
      letter.letterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.people.some(person => 
        person.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.nip && person.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (person.jabatan && person.jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      const key = sortConfig.key;
      
      if (key === "createdAt") {
        return sortConfig.direction === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      if (key === "people") {
        return sortConfig.direction === "asc"
          ? a[key].length - b[key].length
          : b[key].length - a[key].length;
      }
      
      return sortConfig.direction === "asc"
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    });

  const convertToFormData = (letter: LetterHistory): FormData => {
    return {
      nomor: "",
      category: letter.category,
      subcategory: letter.subcategory,
      month: new Date(letter.createdAt).getMonth().toString().padStart(2, "0"),
      year: new Date(letter.createdAt).getFullYear().toString(),
      menimbang: letter.menimbang ?? ["", ""],
      dasar: letter.dasar ?? "",
      people: letter.people,
      untuk: letter.title,
      useTTE: false,
      anchorSymbol: "caret",
      useTableFormat: letter.useTableFormat ?? false,
      signatureName: letter.signatureName ?? ""
    };
  };

  const convertToNotaDinasData = (letter: LetterHistory): NotaDinasData => {
    return {
      nomor: "",
      category: letter.category,
      subcategory: letter.subcategory,
      month: new Date(letter.createdAt).getMonth().toString().padStart(2, "0"),
      year: new Date(letter.createdAt).getFullYear().toString(),
      kepada: letter.people[0]?.nama || "",
      dari: "",
      perihal: letter.title,
      tanggalSurat: formatDate(new Date(letter.createdAt)),
      tanggal: "",
      hari: "",
      waktu: "",
      tempat: "",
      narasi: letter.title,
      useTTE: false,
      anchorSymbol: "caret",
      signatureName: ""
    };
  };

  const convertToSuratKeputusanData = (letter: LetterHistory): SuratKeputusanData => {
    return {
      nomor: "",
      category: letter.category,
      subcategory: letter.subcategory,
      month: new Date(letter.createdAt).getMonth().toString().padStart(2, "0"),
      year: new Date(letter.createdAt).getFullYear().toString(),
      tentang: letter.title,
      person: letter.people[0] || { nama: "", nip: "", pangkat: "", jabatan: "", unitKerja: "", keterangan: "" },
      memutuskan: {
        pertama: "",
        kedua: "",
        ketiga: ""
      },
      useTTE: false,
      anchorSymbol: "caret",
      signatureName: ""
    };
  };

  const viewLetter = (letter: LetterHistory) => {
    setSelectedLetter(letter);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Arsip {documentType}</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Cari ${documentType.toLowerCase()}...`}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[180px] cursor-pointer"
                    onClick={() => handleSort("letterNumber")}
                  >
                    <div className="flex items-center">
                      Nomor Surat
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Perihal
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Tanggal
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLetters.length > 0 ? (
                  filteredLetters.map((letter) => (
                    <TableRow key={letter.id}>
                      <TableCell className="font-medium">{letter.letterNumber}</TableCell>
                      <TableCell>
                        {letter.title}
                        {documentType === "Surat Tugas" && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {letter.people.length} orang
                          </div>
                        )}
                        {documentType === "Nota Dinas" && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Kepada: {letter.people[0]?.nama || ""}
                          </div>
                        )}
                        {documentType === "Surat Keputusan" && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Tentang: {letter.people[0]?.nama || ""}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(new Date(letter.createdAt))}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => viewLetter(letter)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          <FileText className="mr-2 h-4 w-4" /> 
                          Lihat
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Tidak ada data {documentType.toLowerCase()}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col p-0 bg-white animate-fadeIn scale-95 animate-in duration-300">
          <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b">
            <DialogTitle className="text-lg font-bold">Preview Full Screen</DialogTitle>
            <DialogClose asChild>
              <button className="p-2 rounded hover:bg-gray-100 transition" title="Tutup">
                <X className="w-5 h-5" />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            {selectedLetter && selectedLetter.documentType === "Surat Tugas" ? (
              <LetterContent
                formData={{ ...convertToFormData(selectedLetter), useTableFormat: selectedLetter.useTableFormat }}
                staticData={staticData}
                formatLetterNumber={(num) => selectedLetter.letterNumber}
                getCurrentDate={() => formatDate(new Date(selectedLetter.createdAt))}
                getAnchorSymbol={() => "▢"}
                firstPagePeople={convertToFormData(selectedLetter).people}
                secondPagePeople={[]}
                needsPagination={false}
              />
            ) : selectedLetter && selectedLetter.documentType === "Nota Dinas" ? (
              <NotaDinasContent
                formData={convertToNotaDinasData(selectedLetter)}
                staticData={notaDinasStaticData}
                formatLetterNumber={(num) => selectedLetter.letterNumber}
                getCurrentDate={() => formatDate(new Date(selectedLetter.createdAt))}
                getAnchorSymbol={() => "▢"}
              />
            ) : selectedLetter && selectedLetter.documentType === "Surat Keputusan" ? (
              <SuratKeputusanContent
                formData={convertToSuratKeputusanData(selectedLetter)}
                staticData={suratKeputusanStaticData}
                formatLetterNumber={(num) => selectedLetter.letterNumber}
                getCurrentDate={() => formatDate(new Date(selectedLetter.createdAt))}
                getAnchorSymbol={() => "▢"}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Preview tidak tersedia</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LetterTable;
