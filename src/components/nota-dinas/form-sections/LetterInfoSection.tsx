
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotaDinasData } from "@/types/nota-dinas";

interface LetterInfoSectionProps {
  formData: NotaDinasData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFormData: (data: Partial<NotaDinasData>) => void;
  formatLetterNumber: (userNumber: string) => string;
  categoryOptions: { id: string; name: string }[];
  subcategoryOptions: { value: string; text: string }[];
  months: { value: string; text: string }[];
}

const LetterInfoSection: React.FC<LetterInfoSectionProps> = ({
  formData,
  handleChange,
  updateFormData,
  formatLetterNumber,
  categoryOptions,
  subcategoryOptions,
  months,
}) => {
  return (
    <>
      {/* Nomor Surat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomor">Nomor Surat</Label>
          <Input
            id="nomor"
            name="nomor"
            value={formData.nomor}
            onChange={handleChange}
            placeholder="Nomor Surat"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Format: {formatLetterNumber(formData.nomor || "XXX")}
          </p>
        </div>

        <div>
          <Label htmlFor="category">Kategori Surat</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) => updateFormData({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.id} - {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subcategory, Month and Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="subcategory">Sub Kategori</Label>
          <Select
            name="subcategory"
            value={formData.subcategory}
            onValueChange={(value) => updateFormData({ subcategory: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Sub Kategori" />
            </SelectTrigger>
            <SelectContent>
              {subcategoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="month">Bulan</Label>
          <Select
            name="month"
            value={formData.month}
            onValueChange={(value) => updateFormData({ month: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="year">Tahun</Label>
          <Input
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Tahun"
          />
        </div>
      </div>
    </>
  );
};

export default LetterInfoSection;
