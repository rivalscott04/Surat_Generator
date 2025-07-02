import { useState, useRef } from "react";
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
import { useReactToPrint } from "react-to-print";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { PDFViewer } from '@react-pdf/renderer';
import SuratTugasPDF from './SuratTugasPDF';
import { Document, Page } from 'react-pdf';
import { useEffect } from 'react';

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const suratRef = useRef<HTMLDivElement>(null);
  
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
    navigate(`/print/${letter.id}`);
  };
  
  const symbolMap = {
    caret: '^',
    hash: '#',
    dollar: '$',
  };

  const printRef = useRef(null);
  const navigate = useNavigate();
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
                            {(letter.people ?? []).length} orang
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

      {/* Hidden div for LetterContent to generate PDF */}
      {selectedLetter && (
        <div style={{ display: 'none' }}>
          <div ref={suratRef}>
            <LetterContent
              formData={{
                nomor: selectedLetter.content?.nomor ?? '',
                category: selectedLetter.content?.category ?? '',
                subcategory: selectedLetter.content?.subcategory ?? '',
                month: selectedLetter.content?.month ?? '',
                year: selectedLetter.content?.year ?? '',
                menimbang: selectedLetter.content?.menimbang ?? ['', ''],
                dasar: selectedLetter.content?.dasar ?? '',
                untuk: selectedLetter.content?.untuk ?? '',
                people: selectedLetter.content?.people ?? [],
                useTTE: selectedLetter.content?.useTTE ?? false,
                anchorSymbol: selectedLetter.content?.anchorSymbol ?? 'caret',
                useTableFormat: selectedLetter.content?.useTableFormat ?? true,
                signatureName: selectedLetter.content?.signatureName ?? ''
              }}
              staticData={staticData}
              formatLetterNumber={(num) => num}
              getCurrentDate={() => formatDate(new Date(selectedLetter.createdAt))}
              getAnchorSymbol={() => 'caret'}
              firstPagePeople={selectedLetter.content?.people ?? []}
              secondPagePeople={[]}
              needsPagination={false}
            />
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      {pdfBlobUrl && (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000, background: '#eee' }}>
          <Document file={pdfBlobUrl} onLoadError={console.error}>
            <Page pageNumber={1} width={window.innerWidth - 32} />
          </Document>
          <button onClick={() => { setSelectedLetter(null); setPdfBlobUrl(null); }} style={{ position: 'absolute', top: 16, right: 16, zIndex: 1100, background: '#fff', border: '1px solid #ccc', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Tutup</button>
          <a href={pdfBlobUrl} download="SuratTugas.pdf" style={{ position: 'absolute', top: 16, left: 16, zIndex: 1100, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', textDecoration: 'none' }}>Download</a>
        </div>
      )}
    </>
  );
};

export default LetterTable;
