import { useState, useRef } from "react";
import { FileText, Printer, Save, BookMarked } from "lucide-react";
import { Link } from "react-router-dom";
import { SuratKeputusanData, staticData } from "@/types/surat-keputusan";
import { formatLetterNumber, getCurrentDate, getAnchorSymbol } from "@/utils/letter-utils";
import { anchorSymbols } from "@/types/surat-tugas";
import { useLetterStore, createLetterHistoryFromSuratKeputusan } from "@/hooks/use-letter-store";
import { useToast } from "@/hooks/use-toast";
import SuratKeputusanForm from "./surat-keputusan/SuratKeputusanForm";
import SuratKeputusanContent from "./surat-keputusan/SuratKeputusanContent";
import { Button } from "@/components/ui/button";
import { CenteredToast } from "@/components/ui/centered-toast";
import { getSubcategoryOptions } from "../data/letterCategories";
import { z } from "zod";

const personSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  nip: z.string().min(1, "NIP harus diisi"),
  pangkat: z.string().min(1, "Pangkat harus diisi"),
  jabatan: z.string().min(1, "Jabatan harus diisi"),
  unitKerja: z.string().min(1, "Unit kerja harus diisi"),
  keterangan: z.string(),
});

const formSchema = z.object({
  nomor: z.string().min(1, "Nomor surat harus diisi"),
  tentang: z.string().min(1, "Tentang harus diisi"),
  signatureName: z.string().min(1, "Nama penandatangan harus diisi"),
  person: personSchema,
});

export default function SuratKeputusan() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  
  const [formData, setFormData] = useState<SuratKeputusanData>({
    nomor: "",
    category: "Surat Keputusan",
    subcategory: "KP",
    month: currentMonth,
    year: currentYear,
    tentang: "",
    person: {
      nama: "",
      nip: "",
      pangkat: "",
      jabatan: "",
      unitKerja: "",
      keterangan: ""
    },
    memutuskan: {
      pertama: "",
      kedua: "",
      ketiga: ""
    },
    useTTE: false,
    anchorSymbol: "caret",
    signatureName: "H. Zamroni Aziz",
  });

  const [subcategoryOptions, setSubcategoryOptions] = useState<{ value: string, text: string }[]>([]);
  const [showToast, setShowToast] = useState(false);

  const { addLetter } = useLetterStore();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const formatLetterNumberWithData = (userNumber: string) => {
    return formatLetterNumber(userNumber, formData.subcategory, formData.month, formData.year, formData.category);
  };

  const getAnchorSymbolValue = () => {
    return getAnchorSymbol(formData.anchorSymbol, anchorSymbols);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;

    document.body.innerHTML = `
      <div style="font-family: 'Arial, sans-serif'; font-size: 12pt;">
        ${printContents}
      </div>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors;
        const errorMessage = errors.map(e => e.message).join(", ");
        toast({
          title: "Form tidak lengkap",
          description: errorMessage,
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const letterHistory = createLetterHistoryFromSuratKeputusan(formData);
    addLetter(letterHistory);
    setShowToast(true);
    
    toast({
      title: "Berhasil",
      description: "Surat Keputusan berhasil dibuat dan disimpan",
    });
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Surat Keputusan Generator</h1>
          <Link to="/archive">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BookMarked className="w-4 h-4 mr-2" />
              Lihat Arsip
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SuratKeputusanForm 
            formData={formData}
            setFormData={setFormData}
            subcategoryOptions={subcategoryOptions}
            formatLetterNumber={formatLetterNumberWithData}
            letterType="SURAT_KEPUTUSAN"
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Preview Surat</h2>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </Button>
                <Button 
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Cetak
                </Button>
              </div>
            </div>

            <div ref={printRef}>
              <SuratKeputusanContent
                formData={formData}
                staticData={staticData}
                formatLetterNumber={formatLetterNumberWithData}
                getCurrentDate={getCurrentDate}
                getAnchorSymbol={getAnchorSymbolValue}
              />
            </div>
          </div>
        </div>
      </div>

      <CenteredToast 
        isOpen={showToast}
        onClose={closeToast}
        onPrint={handlePrint}
      />
    </div>
  );
}
