
import { useState, useRef, useEffect } from "react";
import { ClipboardList, Printer, Save, BookMarked } from "lucide-react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { getSubcategoryOptions, getCategoryOptions } from "../data/letterCategories";
import { staticData } from "../types/nota-dinas";
import { NotaDinasData } from "../types/nota-dinas";
import { formatLetterNumber, getCurrentDate, getAnchorSymbol } from "../utils/letter-utils";
import { useLetterStore } from "../hooks/use-letter-store";
import { useToast } from "../hooks/use-toast";
import NotaDinasForm from "./nota-dinas/NotaDinasForm";
import NotaDinasContent from "./nota-dinas/NotaDinasContent";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { anchorSymbols } from "../types/surat-tugas";
import { z } from "zod";
import { CenteredToast } from "@/components/ui/centered-toast";

// Validation schema
const formSchema = z.object({
  nomor: z.string().min(1, "Nomor surat harus diisi"),
  kepada: z.string().min(1, "Kepada harus diisi"),
  perihal: z.string().min(1, "Perihal harus diisi"),
  dari: z.string().min(1, "Dari harus diisi"),
  narasi: z.string().min(1, "Narasi harus diisi"),
  waktu: z.string().min(1, "Waktu harus diisi"),
  tempat: z.string().min(1, "Tempat harus diisi"),
  signatureName: z.string().min(1, "Nama penandatangan harus diisi"),
});

const NotaDinas = () => {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const todayFormatted = format(new Date(), "d MMMM yyyy", { locale: id });
  const { addLetter } = useLetterStore();
  const { toast } = useToast();
  const [categoryOptions] = useState(getCategoryOptions());

  const [formData, setFormData] = useState<NotaDinasData>({
    nomor: "",
    category: "KP", // Default to Kepegawaian
    subcategory: "KP.01",
    month: currentMonth,
    year: currentYear,
    kepada: "Kepala Bidang Pendidikan Agama dan Keagamaan pada Kantor Wilayah Kementerian Agama Provinsi Nusa Tenggara Barat",
    dari: "Kepala Kantor Wilayah Kementerian Agama Provinsi Nusa Tenggara Barat",
    perihal: "Undangan Silaturahmi bersama Gubernur Nusa Tenggara Barat",
    tanggal: todayFormatted,
    tanggalSurat: todayFormatted,
    hari: "Jumat",
    waktu: "Pukul 08.30 Wita",
    tempat: "Kantor Gubernur Nusa Tenggara Barat, Jl. Udayana No. 12, Mataram (Bangunan baru Kompleks Kantor Kementerian Agama Provinsi Nusa Tenggara Barat pukul 08.00 Wita, dan bersama-sama menuju Kantor Gubernur pada pukul 08.30 Wita)",
    narasi: "Dalam rangka Silaturahmi bersama Gubernur, Kepala Kantor Wilayah Kementerian Agama Provinsi Nusa Tenggara Barat dengan ini mengharapkan kehadiran Saudara dalam kegiatan yang akan dilaksanakan pada:",
    useTTE: false,
    anchorSymbol: "caret",
    signatureName: "H. Zamroni Aziz",
  });

  const [subcategoryOptions, setSubcategoryOptions] = useState<{ value: string, text: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const printRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const updateFormData = (data: Partial<NotaDinasData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handlePrint = () => {
    if (!validateForm()) {
      toast({
        title: "Form belum lengkap",
        description: "Harap lengkapi semua field yang diperlukan sebelum mencetak",
        variant: "destructive"
      });
      return;
    }
    
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
      setErrors({});
      setIsFormValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        setIsFormValid(false);
      }
      return false;
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const letterHistory = {
      letterNumber: formatLetterNumber(formData.nomor, formData.subcategory, formData.month, formData.year, formData.category),
      category: formData.category,
      subcategory: formData.subcategory,
      documentType: "Nota Dinas",
      people: [formData.kepada],
      title: `Nota Dinas - ${formData.perihal}`
    };
    
    addLetter(letterHistory);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nota Dinas Generator</h1>
          <Link to="/archive">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <BookMarked className="w-4 h-4 mr-2" />
              Lihat Arsip
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NotaDinasForm 
            formData={formData}
            handleChange={handleChange}
            subcategoryOptions={subcategoryOptions}
            formatLetterNumber={formatLetterNumberWithData}
            updateFormData={updateFormData}
            categoryOptions={categoryOptions}
            errors={errors}
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Preview Nota Dinas</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${
                    isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400"
                  } rounded-md transition-colors`}
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
            </div>

            <div ref={printRef}>
              <NotaDinasContent 
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
};

export default NotaDinas;
