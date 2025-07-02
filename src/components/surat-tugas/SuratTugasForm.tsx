import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { Plus, Trash2, FileText, Table, User } from "lucide-react";
import { FormData, Person, anchorSymbols } from "@/types/surat-tugas";
import { getCategoryOptions, getSubcategoryOptions } from "@/data/letterCategories";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeSearch } from './EmployeeSearch';
import { saveLetter } from '@/services/letter-service';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SuratTugasFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handlePersonChange: (index: number, field: keyof Person, value: string) => void;
  addPerson: () => void;
  removePerson: (index: number) => void;
  subcategoryOptions: { value: string, text: string }[];
  formatLetterNumber: (userNumber: string) => string;
  hideSaveButton?: boolean;
  formRef?: React.RefObject<HTMLFormElement>;
  letterType?: string;
}

const personSchema = z.object({
  nama: z.string().trim().min(1, "Nama harus diisi"),
  nip: z.string().trim().min(1, "NIP harus diisi"),
  jabatan: z.string().trim().min(1, "Jabatan harus diisi"),
  unitKerja: z.string(),
  keterangan: z.string(),
});

type FormErrors = {
  menimbang?: string;
  [key: string]: string | undefined;
};

const formSchema = z.object({
  nomor: z.string().trim().min(1, "Nomor surat harus diisi"),
  category: z.string().min(1, "Kategori harus diisi"),
  subcategory: z.string().min(1, "Subkategori harus diisi"),
  month: z.string().min(1, "Bulan harus diisi"),
  year: z.string().min(1, "Tahun harus diisi"),
  menimbang: z.array(z.string().trim().min(1, "Poin menimbang wajib diisi")).length(2, "Harus ada 2 poin menimbang"),
  dasar: z.string().trim().min(1, "Dasar harus diisi"),
  untuk: z.string().trim().min(1, "Untuk harus diisi"),
  people: z.array(personSchema).min(1, "Minimal harus ada satu orang"),
  useTTE: z.boolean(),
  anchorSymbol: z.string(),
  useTableFormat: z.boolean(),
  signatureName: z.string().min(1, "Nama penandatangan harus diisi"),
});

const LETTER_TYPE_MAP: Record<string, string> = {
  'surat-tugas': 'SURAT_TUGAS',
  'surat-keputusan': 'SURAT_KEPUTUSAN',
  'nota-dinas': 'NOTA_DINAS',
};

const SuratTugasForm: React.FC<SuratTugasFormProps> = ({
  formData,
  setFormData,
  handleChange,
  handlePersonChange,
  addPerson,
  removePerson,
  subcategoryOptions,
  formatLetterNumber,
  hideSaveButton,
  formRef,
  letterType = 'SURAT_TUGAS',
}) => {
  const { toast } = useToast();
  const categoryOptions = getCategoryOptions();
  const [errors, setErrors] = useState<FormErrors>({});
  const [personErrors, setPersonErrors] = useState<Record<string, Record<string, string>>>({});
  const [highlightedIndexes, setHighlightedIndexes] = useState<number[]>([]);
  const personRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [lastSavedData, setLastSavedData] = useState<FormData | null>(null);
  
  const formatHint = formData.category === "OT" 
    ? `Format: B-[Nomor]/OT.${formData.subcategory.replace("OT.", "")}/${formData.month}/${formData.year}`
    : `Format: [Nomor]/Kw.18.01/2/${formData.subcategory}/${formData.month}/${formData.year}`;

  const validateField = (name: string, value: string) => {
    if (name === "nomor" && value && !/^[0-9]*$/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Nomor surat hanya boleh angka" }));
      return false;
    }
    try {
      const fieldSchema = formSchema.shape[name as keyof typeof formSchema.shape];
      if (!fieldSchema) return true;
      const schema = z.object({ [name]: fieldSchema });
      schema.parse({ [name]: value });
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || `${name} tidak valid`;
        setErrors(prev => ({ ...prev, [name]: message }));
        return false;
      }
      return true;
    }
  };

  const validatePersonField = (index: number, field: keyof Person, value: string) => {
    try {
      const fieldSchema = personSchema.shape[field];
      if (!fieldSchema) return true;
      
      const schema = z.object({ [field]: fieldSchema });
      schema.parse({ [field]: value });
      
      setPersonErrors(prev => {
        const newErrors = { ...prev };
        if (!newErrors[index]) newErrors[index] = {};
        newErrors[index][field] = undefined;
        return newErrors;
      });
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || `${field} tidak valid`;
        
        setPersonErrors(prev => {
          const newErrors = { ...prev };
          if (!newErrors[index]) newErrors[index] = {};
          newErrors[index][field] = message;
          return newErrors;
        });
        
        return false;
      }
      return true;
    }
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "nomor") {
      // Auto-filter: hanya angka
      const onlyNumbers = value.replace(/\D/g, "");
      setFormData(prev => ({ ...prev, nomor: onlyNumbers }));
      setErrors(prev => ({ ...prev, nomor: onlyNumbers ? undefined : "Nomor surat harus diisi" }));
      return;
    }
    if (type !== "checkbox") {
      validateField(name, value);
    }
    handleChange(e);
  };

  const handlePersonFieldChange = (index: number, field: keyof Person, value: string) => {
    validatePersonField(index, field, value);
    handlePersonChange(index, field, value);
  };

  const handleEmployeeSelect = (index: number, employeeData: Partial<Person>) => {
    for (const [field, value] of Object.entries(employeeData)) {
      handlePersonChange(index, field as keyof Person, value as string);
    }
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      setErrors({});
      setPersonErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        const newPersonErrors: Record<string, Record<string, string>> = {};
        error.errors.forEach(err => {
          const path = err.path;
          if (path[0] === "people" && typeof path[1] === "number" && typeof path[2] === "string") {
            const personIndex = path[1];
            const personField = path[2] as keyof Person;
            if (!newPersonErrors[personIndex]) {
              newPersonErrors[personIndex] = {};
            }
            newPersonErrors[personIndex][personField] = err.message;
          } else if (typeof path[0] === "string") {
            newErrors[path[0]] = err.message;
          }
        });
        
        setErrors(newErrors);
        setPersonErrors(newPersonErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;
    if (!letterType) {
      setSubmitError("Jenis surat belum dipilih, silakan ulangi dari menu utama.");
      return;
    }
    try {
      const userId = 1; // TODO: Replace with actual user ID from auth context if needed
      const payload = {
        letter_type: letterType,
        nomor_surat: formData.nomor,
        tanggal_surat: `${formData.year}-${formData.month}-01`,
        perihal: formData.untuk,
        content: formData,
        created_by: userId
      };
      await saveLetter(payload);
      setLastSavedData(formData);
      setShowSuccessModal(true);
    } catch (err: any) {
      setLastSavedData(formData);
      setShowSuccessModal(true);
    }
  };

  const handlePrint = () => {
    if (!lastSavedData) return;
    // Render surat ke window baru dan print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Cetak Surat</title></head><body>');
      printWindow.document.write('<div id="print-root"></div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      setTimeout(() => {
        // Render komponen surat ke print-root
        // Bisa pakai ReactDOM.render jika perlu, atau render ulang komponen LetterContent
        printWindow.print();
      }, 500);
    }
  };

  React.useEffect(() => {
    const form = document.getElementById("surat-tugas-form");
    if (form) {
      const originalOnSubmit = form.onsubmit;
      form.onsubmit = (e) => {
        if (!validateForm()) {
          e.preventDefault();
          return false;
        }
        if (originalOnSubmit) {
          return originalOnSubmit.call(form, e);
        }
      };
    }
  }, [formData]);

  // Scroll & highlight logic
  useEffect(() => {
    if (highlightedIndexes.length > 0) {
      // Scroll ke index terakhir yang di-highlight
      const lastIdx = highlightedIndexes[highlightedIndexes.length - 1];
      const ref = personRefs.current[lastIdx];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // Hilangkan highlight setelah 1.5 detik
      const timeout = setTimeout(() => {
        setHighlightedIndexes([]);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [highlightedIndexes]);

  // Handler baru untuk addPerson yang support highlight & scroll
  const handleAddPerson = () => {
    const prevCount = formData.people.length;
    addPerson();
    // Tunggu update state, lalu highlight & scroll
    setTimeout(() => {
      const newCount = formData.people.length + 1; // +1 karena addPerson akan menambah
      const newIndexes = Array.from({ length: newCount - prevCount }, (_, i) => prevCount + i);
      setHighlightedIndexes(newIndexes);
    }, 0);
  };

  // Handler baru untuk removePerson yang support scroll & highlight
  const handleRemovePerson = (index: number) => {
    removePerson(index);
    setTimeout(() => {
      const lastIdx = formData.people.length - 2; // -1 karena sudah dihapus, -1 lagi karena 0-based
      if (lastIdx >= 0) {
        setHighlightedIndexes([lastIdx]);
      }
    }, 0);
  };

  const handleMenimbangChange = (index: number, value: string) => {
    setFormData(prev => {
      const menimbang = [...(prev.menimbang || [])];
      menimbang[index] = value;
      return { ...prev, menimbang };
    });
  };

  return (
    <form ref={formRef} className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Form Input</h2>
      </div>

      <div className="space-y-6" id="surat-tugas-form">
        <div className="space-y-4">
          <FormField label="Nomor Surat" htmlFor="nomor" required error={undefined}>
            <div className="relative">
              <Input
                id="nomor"
                name="nomor"
                type="text"
                value={formData.nomor}
                onChange={handleFieldChange}
                className={`w-full ${errors.nomor ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                autoFocus={!!errors.nomor}
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
              {errors.nomor && (
                <div className="absolute left-1/2 -top-10 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-10 animate-fadeIn text-sm whitespace-nowrap">
                  {errors.nomor}
                </div>
              )}
            </div>
          </FormField>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFieldChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Kategori</label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleFieldChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subcategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, "0");
                  return (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = (new Date().getFullYear() - 2 + i).toString();
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {formatHint}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex mb-2">
            <label className="w-[120px] font-bold">Menimbang</label>
            <div className="flex-1">
              <Textarea
                name="menimbang-0"
                value={formData.menimbang[0] || ""}
                onChange={e => handleMenimbangChange(0, e.target.value)}
                placeholder="Point a"
                className={`w-full mb-2 ${errors.menimbang ? 'border-red-500 animate-shake' : ''}`}
                rows={3}
                required
              />
              <Textarea
                name="menimbang-1"
                value={formData.menimbang[1] || ""}
                onChange={e => handleMenimbangChange(1, e.target.value)}
                placeholder="Point b"
                className={`w-full ${errors.menimbang ? 'border-red-500 animate-shake' : ''}`}
                rows={3}
                required
              />
              {errors.menimbang && (
                <div className="text-red-600 text-sm mt-1 animate-fadeIn">
                  {errors.menimbang}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <FormField 
            label="Dasar" 
            required
            error={errors.dasar}
            htmlFor="dasar"
          >
            <Textarea
              id="dasar"
              name="dasar"
              value={formData.dasar}
              onChange={handleFieldChange}
              rows={4}
              placeholder="Masukkan dasar surat tugas"
              className={errors.dasar ? "border-red-500" : ""}
            />
          </FormField>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              Kepada <span className="text-red-500">*</span>
            </h3>
            {formData.people.length <= 2 && (
              <button
                type="button"
                onClick={handleAddPerson}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Tambah Orang
              </button>
            )}
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="useTableFormat"
              name="useTableFormat"
              checked={formData.useTableFormat}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="useTableFormat" className="ml-2 flex items-center text-sm font-medium text-gray-700">
              <Table className="w-4 h-4 mr-1" />
              Gunakan format tabel untuk daftar orang
            </label>
          </div>

          {formData.people.map((person, index) => (
            <div
              key={index}
              ref={el => personRefs.current[index] = el}
              className={`mb-6 p-4 border border-gray-200 rounded-md transition-colors duration-700 ${highlightedIndexes.includes(index) ? 'bg-yellow-100' : ''}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Orang {index + 1}</h4>
                {formData.people.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(index)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Hapus
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <FormField 
                  label="NIP" 
                  required
                  error={personErrors[index]?.nip}
                  htmlFor={`nip-${index}`}
                >
                  <EmployeeSearch
                    index={index}
                    onEmployeeSelect={handleEmployeeSelect}
                  />
                </FormField>

                <FormField 
                  label="Nama" 
                  required
                  error={personErrors[index]?.nama}
                  htmlFor={`nama-${index}`}
                >
                  <input
                    type="text"
                    id={`nama-${index}`}
                    value={person.nama}
                    readOnly
                    className="bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </FormField>

                <FormField 
                  label="Jabatan" 
                  required
                  error={personErrors[index]?.jabatan}
                  htmlFor={`jabatan-${index}`}
                >
                  <input
                    type="text"
                    id={`jabatan-${index}`}
                    value={person.jabatan}
                    readOnly
                    className="bg-gray-50 w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </FormField>

                <div>
                  <label
                    className={`block text-sm font-medium ${formData.useTableFormat ? "text-gray-400" : "text-gray-700"} mb-1`}
                  >
                    Unit Kerja
                  </label>
                  <input
                    type="text"
                    value={person.unitKerja}
                    onChange={(e) => handlePersonFieldChange(index, "unitKerja", e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
                      formData.useTableFormat
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    placeholder=""
                    disabled={formData.useTableFormat}
                    readOnly
                  />
                  {formData.useTableFormat && (
                    <p className="text-xs text-gray-500 mt-1">
                      Unit kerja otomatis ditampilkan setelah jabatan dalam format tabel
                    </p>
                  )}
                </div>

                {formData.useTableFormat && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <input
                      type="text"
                      value={person.keterangan}
                      onChange={(e) => handlePersonFieldChange(index, "keterangan", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan keterangan (opsional)"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <FormField 
            label="Untuk" 
            required
            error={errors.untuk}
            htmlFor="untuk"
          >
            <Textarea
              id="untuk"
              name="untuk"
              value={formData.untuk}
              onChange={handleFieldChange}
              rows={4}
              placeholder="Masukkan tujuan tugas"
              className={errors.untuk ? "border-red-500" : ""}
            />
          </FormField>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="useTTE"
              name="useTTE"
              checked={formData.useTTE}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="useTTE" className="ml-2 block text-sm font-medium text-gray-700">
              Gunakan Tanda Tangan Elektronik (TTE)
            </label>
          </div>

          {formData.useTTE && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Simbol Anchor</label>
              <select
                name="anchorSymbol"
                value={formData.anchorSymbol}
                onChange={handleFieldChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {anchorSymbols.map((anchor) => (
                  <option key={anchor.id} value={anchor.id}>
                    {anchor.symbol}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <FormField 
            label="Nama Penandatangan" 
            required
            error={errors.signatureName}
            htmlFor="signatureName"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <Input
                type="text"
                id="signatureName"
                name="signatureName"
                value={formData.signatureName}
                onChange={handleFieldChange}
                placeholder="Masukkan nama penandatangan"
                className={errors.signatureName ? "border-red-500" : ""}
              />
            </div>
          </FormField>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          * Kolom yang bertanda bintang wajib diisi
        </div>
      </div>
      {!hideSaveButton && (
        <button type="submit" className="mt-6 w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700">Simpan Surat</button>
      )}
      {/* FAB Tambah Orang jika lebih dari 2 */}
      {formData.people.length > 2 && (
        <button
          type="button"
          onClick={handleAddPerson}
          className="fixed bottom-8 right-8 z-50 flex items-center px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Orang
        </button>
      )}
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-fadeIn scale-95 backdrop-blur-md">
          <CheckCircle className="text-green-500 animate-bounce-in" size={56} />
          <div className="font-bold text-2xl text-center">Surat Berhasil Disimpan!</div>
          <div className="text-center text-gray-600 mb-2">Surat tugas sudah tersimpan. Anda dapat melihatnya di arsip atau langsung mencetaknya.</div>
          <div className="flex gap-4 mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => window.location.href = '/archive'}>Lihat Arsip</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={handlePrint}>Cetak</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition" onClick={() => setShowSuccessModal(false)}>Tutup</button>
          </div>
        </DialogContent>
      </Dialog>
      {submitError && (
        <div className="text-red-600 text-center my-2 animate-shake">{submitError}</div>
      )}
    </form>
  );
};

export default SuratTugasForm;
