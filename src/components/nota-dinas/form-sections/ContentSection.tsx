
import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NotaDinasData } from "@/types/nota-dinas";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  formData: NotaDinasData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  updateFormData: (data: Partial<NotaDinasData>) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ formData, handleChange, updateFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="kepada">Kepada</Label>
        <Input
          id="kepada"
          name="kepada"
          value={formData.kepada}
          onChange={handleChange}
          placeholder="Kepada"
        />
      </div>

      <div>
        <Label htmlFor="dari">Dari</Label>
        <Input
          id="dari"
          name="dari"
          value={formData.dari}
          onChange={handleChange}
          placeholder="Dari"
        />
      </div>

      <div>
        <Label htmlFor="perihal">Perihal</Label>
        <Input
          id="perihal"
          name="perihal"
          value={formData.perihal}
          onChange={handleChange}
          placeholder="Perihal"
        />
      </div>

      <div>
        <Label htmlFor="tanggalSurat">Tanggal Surat</Label>
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
              <Calendar
                mode="single"
                selected={formData.tanggalSurat ? new Date(formData.tanggalSurat) : undefined}
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
      </div>

      <div>
        <Label htmlFor="narasi">Narasi</Label>
        <Textarea
          id="narasi"
          name="narasi"
          value={formData.narasi}
          onChange={handleChange}
          placeholder="Masukkan narasi nota dinas..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default ContentSection;
