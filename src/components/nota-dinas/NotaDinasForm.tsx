import React from "react";
import { NotaDinasData } from "@/types/nota-dinas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormField from "@/components/ui/form-field";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface NotaDinasFormProps {
  formData: NotaDinasData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  subcategoryOptions: { value: string; text: string }[];
  formatLetterNumber: (userNumber: string) => string;
  updateFormData: (data: Partial<NotaDinasData>) => void;
  categoryOptions: { id: string; name: string }[];
  errors: Record<string, string>;
  letterType?: string;
}

const NotaDinasForm: React.FC<NotaDinasFormProps> = ({
  formData,
  handleChange,
  subcategoryOptions,
  formatLetterNumber,
  updateFormData,
  categoryOptions,
  errors,
  letterType = 'NOTA_DINAS',
}) => {
  const [submitError, setSubmitError] = React.useState("");

  const days = [
    { value: "Senin", text: "Senin" },
    { value: "Selasa", text: "Selasa" },
    { value: "Rabu", text: "Rabu" },
    { value: "Kamis", text: "Kamis" },
    { value: "Jumat", text: "Jumat" },
    { value: "Sabtu", text: "Sabtu" },
    { value: "Minggu", text: "Minggu" },
  ];

  // Format hint based on category
  const formatHint = formData.category === "OT" 
    ? `Format: B-[Nomor]/OT.${formData.subcategory.replace("OT.", "")}/${formData.month}/${formData.year}`
    : `Format: [Nomor]/Kw.18.01/2/${formData.subcategory}/${formData.month}/${formData.year}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!letterType) {
      setSubmitError("Jenis surat belum dipilih, silakan ulangi dari menu utama.");
      return;
    }
    // ... existing code ...
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Nota Dinas</h2>

      <form className="space-y-6">
        <div className="space-y-4">
          <FormField 
            label="Nomor Surat" 
            required 
            error={errors.nomor}
            htmlFor="nomor"
            description={formatHint}
          >
            <Input
              id="nomor"
              name="nomor"
              value={formData.nomor}
              onChange={handleChange}
              placeholder="Masukkan nomor surat"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subcategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
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
                onChange={handleChange}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField 
              label="Kepada" 
              required
              error={errors.kepada}
              htmlFor="kepada"
            >
              <Input
                id="kepada"
                name="kepada"
                value={formData.kepada}
                onChange={handleChange}
                placeholder="Kepada"
              />
            </FormField>

            <FormField 
              label="Dari" 
              required
              error={errors.dari}
              htmlFor="dari"
            >
              <Input
                id="dari"
                name="dari"
                value={formData.dari}
                onChange={handleChange}
                placeholder="Dari"
              />
            </FormField>
          </div>

          <FormField 
            label="Perihal" 
            required
            error={errors.perihal}
            htmlFor="perihal"
          >
            <Input
              id="perihal"
              name="perihal"
              value={formData.perihal}
              onChange={handleChange}
              placeholder="Perihal"
            />
          </FormField>
          
          <FormField 
            label="Tanggal Surat" 
            htmlFor="tanggalSurat"
          >
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.tanggalSurat && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.tanggalSurat ? formData.tanggalSurat : <span>Pilih tanggal surat</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.tanggalSurat ? new Date() : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, "d MMMM yyyy", { locale: id });
                        updateFormData({ tanggalSurat: formattedDate });
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormField>

          <FormField 
            label="Narasi" 
            required
            error={errors.narasi}
            htmlFor="narasi"
          >
            <Textarea
              id="narasi"
              name="narasi"
              value={formData.narasi}
              onChange={handleChange}
              placeholder="Narasi"
              rows={4}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              label="Hari" 
              htmlFor="hari"
            >
              <select
                id="hari"
                name="hari"
                value={formData.hari}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {days.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.text}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField 
              label="Waktu" 
              required
              error={errors.waktu}
              htmlFor="waktu"
            >
              <Input
                id="waktu"
                name="waktu"
                value={formData.waktu}
                onChange={handleChange}
                placeholder="Waktu"
              />
            </FormField>

            <FormField 
              label="Tempat" 
              required
              error={errors.tempat}
              htmlFor="tempat"
            >
              <Input
                id="tempat"
                name="tempat"
                value={formData.tempat}
                onChange={handleChange}
                placeholder="Tempat"
              />
            </FormField>
          </div>

          <div className="flex items-center mt-4">
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[
                  { id: "hash", symbol: "#" },
                  { id: "dollar", symbol: "$" },
                  { id: "caret", symbol: "^" },
                ].map((anchor) => (
                  <option key={anchor.id} value={anchor.id}>
                    {anchor.symbol}
                  </option>
                ))}
              </select>
            </div>
          )}

          <FormField 
            label="Nama Penandatangan" 
            required
            error={errors.signatureName}
            htmlFor="signatureName"
          >
            <Input
              id="signatureName"
              name="signatureName"
              value={formData.signatureName}
              onChange={handleChange}
              placeholder="Nama Penandatangan"
            />
          </FormField>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          * Kolom yang bertanda bintang wajib diisi
        </div>

        {submitError && (
          <div className="text-red-600 text-center my-2 animate-shake">{submitError}</div>
        )}
      </form>
    </div>
  );
};

export default NotaDinasForm;
