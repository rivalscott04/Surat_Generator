import React, { Dispatch, SetStateAction, useState } from "react";
import { FileText } from "lucide-react";
import { SuratKeputusanData } from "@/types/surat-keputusan";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/components/ui/form-field";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import PersonSection from "./PersonSection";
import SignatureSection from "./SignatureSection";

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
  category: z.string(),
  subcategory: z.string(),
  month: z.string(),
  year: z.string(),
  tentang: z.string().min(1, "Tentang harus diisi"),
  useTTE: z.boolean(),
  anchorSymbol: z.string(),
  signatureName: z.string().min(1, "Nama penandatangan harus diisi"),
  person: personSchema,
});

interface SuratKeputusanFormProps {
  formData: SuratKeputusanData;
  setFormData: Dispatch<SetStateAction<SuratKeputusanData>>;
  subcategoryOptions: { value: string; text: string }[];
  formatLetterNumber: (userNumber: string) => string;
  letterType?: string;
}

const SuratKeputusanForm: React.FC<SuratKeputusanFormProps> = ({
  formData,
  setFormData,
  subcategoryOptions,
  formatLetterNumber,
  letterType = 'SURAT_KEPUTUSAN',
}) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [personErrors, setPersonErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const handleEmployeeSelect = (employee: Partial<typeof formData.person>) => {
    setFormData((prev) => ({
      ...prev,
      person: {
        ...prev.person,
        ...employee,
      }
    }));
    setPersonErrors({});
  };

  const handlePersonChange = (field: keyof typeof formData.person, value: string) => {
    if (field === "keterangan") {
      setFormData((prev) => ({
        ...prev,
        person: {
          ...prev.person,
          keterangan: value,
        }
      }));
    }
  };

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = formSchema.shape[name as keyof typeof formSchema.shape];
      if (!fieldSchema) return true;
      const schema = z.object({ [name]: fieldSchema });
      schema.parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || `${name} tidak valid`;
        setErrors((prev) => ({ ...prev, [name]: message }));
        return false;
      }
      return true;
    }
  };

  const validatePersonField = (field: keyof typeof formData.person, value: string) => {
    try {
      const fieldSchema = personSchema.shape[field];
      if (!fieldSchema) return true;
      const schema = z.object({ [field]: fieldSchema });
      schema.parse({ [field]: value });
      setPersonErrors((prev) => {
        const newErrors = { ...prev };
        newErrors[field] = undefined;
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || `${field} tidak valid`;
        setPersonErrors((prev) => {
          const newErrors = { ...prev };
          newErrors[field] = message;
          return newErrors;
        });
        return false;
      }
      return true;
    }
  };

  const formatHint = `Format: [Nomor]/Kw.18.01/KP.01.01.2/${formData.month}/${formData.year}`;

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      setErrors({});
      setPersonErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        const newPersonErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path;
          if (path[0] === "person" && typeof path[1] === "string") {
            const personField = path[1] as keyof typeof formData.person;
            newPersonErrors[personField] = err.message;
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
    if (!letterType) {
      setSubmitError("Jenis surat belum dipilih, silakan ulangi dari menu utama.");
      return;
    }
    if (!validateForm()) {
      return;
    }
    // ... existing code ...
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Form Input</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <FormField
            label="Nomor Surat"
            required
            error={errors.nomor}
            htmlFor="nomor"
          >
            <Input
              type="text"
              id="nomor"
              name="nomor"
              value={formData.nomor}
              onChange={(e) => setFormData((prev) => ({ ...prev, nomor: e.target.value }))}
              placeholder="Masukkan nomor surat"
              className={errors.nomor ? "border-red-500" : ""}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
              <select
                name="month"
                value={formData.month}
                onChange={(e) => setFormData((prev) => ({ ...prev, month: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
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
          <p className="text-xs text-gray-500 mt-1">{formatHint}</p>
          <FormField
            label="Tentang"
            required
            error={errors.tentang}
            htmlFor="tentang"
          >
            <Input
              type="text"
              id="tentang"
              name="tentang"
              value={formData.tentang}
              onChange={(e) => setFormData((prev) => ({ ...prev, tentang: e.target.value }))}
              placeholder="Masukkan perihal surat"
              className={errors.tentang ? "border-red-500" : ""}
            />
          </FormField>
        </div>

        <PersonSection
          person={formData.person}
          errors={personErrors}
          onPersonChange={handlePersonChange}
          onEmployeeSelect={handleEmployeeSelect}
        />

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Memutuskan</h3>
          <div className="space-y-4">
            <FormField
              label="Pertama"
              required
              htmlFor="memutuskan-pertama"
            >
              <Textarea
                id="memutuskan-pertama"
                name="memutuskan.pertama"
                value={formData.memutuskan.pertama}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  memutuskan: {
                    ...prev.memutuskan,
                    pertama: e.target.value
                  }
                }))}
                rows={3}
                placeholder="Masukkan poin pertama"
              />
            </FormField>

            <FormField
              label="Kedua"
              required
              htmlFor="memutuskan-kedua"
            >
              <Textarea
                id="memutuskan-kedua"
                name="memutuskan.kedua"
                value={formData.memutuskan.kedua}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  memutuskan: {
                    ...prev.memutuskan,
                    kedua: e.target.value
                  }
                }))}
                rows={3}
                placeholder="Masukkan poin kedua"
              />
            </FormField>

            <FormField
              label="Ketiga"
              required
              htmlFor="memutuskan-ketiga"
            >
              <Textarea
                id="memutuskan-ketiga"
                name="memutuskan.ketiga"
                value={formData.memutuskan.ketiga}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  memutuskan: {
                    ...prev.memutuskan,
                    ketiga: e.target.value
                  }
                }))}
                rows={3}
                placeholder="Masukkan poin ketiga"
              />
            </FormField>
          </div>
        </div>

        <SignatureSection
          useTTE={formData.useTTE}
          anchorSymbol={formData.anchorSymbol}
          signatureName={formData.signatureName}
          onUseTTEToggle={checked => setFormData(prev => ({ ...prev, useTTE: checked }))}
          onAnchorSymbolChange={val => setFormData(prev => ({ ...prev, anchorSymbol: val }))}
          onSignatureNameChange={val => setFormData(prev => ({ ...prev, signatureName: val }))}
          error={errors.signatureName}
        />

        <div className="mt-2 text-xs text-gray-500">
          * Kolom yang bertanda bintang wajib diisi
        </div>
      </div>

      {submitError && (
        <div className="text-red-600 text-center my-2 animate-shake">{submitError}</div>
      )}
    </div>
  );
};

export default SuratKeputusanForm;
