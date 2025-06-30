
import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NotaDinasData } from "@/types/nota-dinas";

interface EventDetailsSectionProps {
  formData: NotaDinasData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFormData: (data: Partial<NotaDinasData>) => void;
  days: { value: string; text: string }[];
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ 
  formData, 
  handleChange, 
  updateFormData,
  days
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tanggal">Tanggal</Label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.tanggal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.tanggal ? formData.tanggal : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.tanggal ? new Date(formData.tanggal) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = format(date, "d MMMM yyyy", { locale: id });
                      updateFormData({ tanggal: formattedDate });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="hari">Hari</Label>
          <Select
            name="hari"
            value={formData.hari}
            onValueChange={(value) => updateFormData({ hari: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Hari" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="waktu">Waktu</Label>
          <Input
            id="waktu"
            name="waktu"
            value={formData.waktu}
            onChange={handleChange}
            placeholder="Contoh: Pukul 09.00 WITA"
          />
        </div>

        <div>
          <Label htmlFor="tempat">Tempat</Label>
          <Input
            id="tempat"
            name="tempat"
            value={formData.tempat}
            onChange={handleChange}
            placeholder="Tempat kegiatan"
          />
        </div>
      </div>
    </>
  );
};

export default EventDetailsSection;
