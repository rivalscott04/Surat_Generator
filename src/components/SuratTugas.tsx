import { useState, useRef, useEffect } from "react";
import { FileText, Printer, Save, BookMarked } from "lucide-react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { getSubcategoryOptions } from "../data/letterCategories";
import { FormData, Person, staticData, anchorSymbols } from "../types/surat-tugas";
import { formatLetterNumber, getCurrentDate, getAnchorSymbol } from "../utils/letter-utils";
import { useToast } from "../hooks/use-toast";
import SuratTugasForm from "./surat-tugas/SuratTugasForm";
import LetterContent from "./surat-tugas/LetterContent";
import { z } from "zod";
import { CenteredToast } from "@/components/ui/centered-toast";
import { useIsMobile } from '@/hooks/use-mobile';

const personSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  nip: z.string().min(1, "NIP harus diisi"),
  jabatan: z.string().min(1, "Jabatan harus diisi"),
  unitKerja: z.string(),
  keterangan: z.string(),
  pangkat: z.string(),
});

const formSchema = z.object({
  nomor: z.string().min(1, "Nomor surat harus diisi"),
  menimbangA: z.string().min(1, "Menimbang A harus diisi"),
  dasar: z.string().min(1, "Dasar harus diisi"),
  untuk: z.string().min(1, "Untuk harus diisi"),
  signatureName: z.string().min(1, "Nama penandatangan harus diisi"),
  people: z.array(personSchema).min(1, "Minimal harus ada satu orang"),
});

const SuratTugas = () => {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<FormData>({
    nomor: "",
    category: "KP", // Default to Kepegawaian
    subcategory: "KP.01", // Default to Tata Usaha Kepegawaian
    month: currentMonth,
    year: currentYear,
    menimbang: ["", ""],
    dasar:
      "DIPA Kantor Wilayah Kementerian Agama Provinsi Nusa Tenggara Barat Tahun 2024 Nomor : SP DIPA-025.01.2.419957/2024 Tanggal 24 November 2024",
    untuk: "",
    people: [{ nama: "", nip: "", pangkat: "", jabatan: "", unitKerja: "", keterangan: "" }],
    useTTE: false,
    anchorSymbol: "caret",
    useTableFormat: false,
    signatureName: "H. Zamroni Aziz", // Default signature name
    signatureDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    useCurrentDate: true, // Default to using current date
  });

  const [subcategoryOptions, setSubcategoryOptions] = useState<{ value: string, text: string }[]>([]);

  const [showToast, setShowToast] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const options = getSubcategoryOptions(formData.category);
    setSubcategoryOptions(options);
    
    if (options.length > 0 && !options.some(opt => opt.value === formData.subcategory)) {
      setFormData(prev => ({
        ...prev,
        subcategory: options[0].value
      }));
    }
  }, [formData.category]);

  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlePersonChange = (index: number, field: keyof Person, value: string) => {
    setFormData((prev) => {
      const updatedPeople = [...prev.people];
      
      if (field === "unitKerja" && prev.useTableFormat) {
        updatedPeople[index] = { 
          ...updatedPeople[index], 
          [field]: value,
          keterangan: value
        };
      } else {
        updatedPeople[index] = { ...updatedPeople[index], [field]: value };
      }
      
      return { ...prev, people: updatedPeople };
    });
  };

  useEffect(() => {
    if (formData.useTableFormat) {
      setFormData(prev => ({
        ...prev,
        people: prev.people.map(person => ({
          ...person,
          keterangan: person.unitKerja
        }))
      }));
    }
  }, [formData.useTableFormat]);

  const addPerson = () => {
    setFormData((prev) => {
      const newPerson: Person = { 
        nama: "", 
        nip: "", 
        pangkat: "",
        jabatan: "", 
        unitKerja: "", 
        keterangan: "" 
      };
      return {
        ...prev,
        people: [...prev.people, newPerson],
      };
    });
  };

  const removePerson = (index: number) => {
    if (formData.people.length > 1) {
      setFormData((prev) => {
        const updatedPeople = [...prev.people];
        updatedPeople.splice(index, 1);
        return { ...prev, people: updatedPeople };
      });
    }
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

    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
  };

  const formatLetterNumberWithData = (userNumber: string) => {
    return formatLetterNumber(userNumber, formData.subcategory, formData.month, formData.year, formData.category);
  };

  const getAnchorSymbolValue = () => {
    return getAnchorSymbol(formData.anchorSymbol, anchorSymbols);
  };

  const needsPagination = formData.useTableFormat ? formData.people.length > 10 : formData.people.length > 3;

  const firstPagePeople = needsPagination
    ? formData.useTableFormat
      ? formData.people.slice(0, 10)
      : formData.people.slice(0, 3)
    : formData.people;

  const secondPagePeople = needsPagination
    ? formData.useTableFormat
      ? formData.people.slice(10)
      : formData.people.slice(3)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Surat Tugas Generator</h1>
          <Link to="/archive">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <BookMarked className="w-4 h-4 mr-2" />
              Lihat Arsip
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SuratTugasForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handlePersonChange={handlePersonChange}
            addPerson={addPerson}
            removePerson={removePerson}
            subcategoryOptions={subcategoryOptions}
            formatLetterNumber={formatLetterNumberWithData}
            hideSaveButton={true}
            formRef={formRef}
            letterType="SURAT_TUGAS"
          />

          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Preview Surat</h2>
              </div>
              {!isMobile && (
                <div className="flex gap-2">
                  <button
                    onClick={() => formRef.current?.requestSubmit()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak
                  </button>
                </div>
              )}
            </div>

            <div ref={printRef}>
              <LetterContent 
                formData={formData}
                staticData={staticData}
                formatLetterNumber={formatLetterNumberWithData}
                getCurrentDate={getCurrentDate}
                getAnchorSymbol={getAnchorSymbolValue}
                firstPagePeople={firstPagePeople}
                secondPagePeople={secondPagePeople}
                needsPagination={needsPagination}
              />
            </div>
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex gap-2 p-4">
                <button
                  onClick={() => formRef.current?.requestSubmit()}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Cetak
                </button>
              </div>
            )}
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
};

export default SuratTugas;
