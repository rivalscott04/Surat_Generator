
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
import { anchorSymbols } from "@/types/surat-tugas";

interface SignatureSectionProps {
  formData: NotaDinasData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFormData: (data: Partial<NotaDinasData>) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ 
  formData, 
  handleChange, 
  updateFormData 
}) => {
  return (
    <>
      <div>
        <Label className="block mb-2 text-base font-medium">Pengaturan Tanda Tangan</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="useTTE" className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="useTTE"
                name="useTTE"
                checked={formData.useTTE}
                onChange={(e) => updateFormData({ useTTE: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Gunakan TTE (Tanda Tangan Elektronik)</span>
            </Label>
          </div>
          
          {formData.useTTE && (
            <div>
              <Label htmlFor="anchorSymbol">Simbol Anchor TTE</Label>
              <Select
                name="anchorSymbol"
                value={formData.anchorSymbol}
                onValueChange={(value) => updateFormData({ anchorSymbol: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Simbol" />
                </SelectTrigger>
                <SelectContent>
                  {anchorSymbols.map((anchor) => (
                    <SelectItem key={anchor.id} value={anchor.id}>
                      {anchor.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="signatureName">Nama Penandatangan</Label>
        <Input
          id="signatureName"
          name="signatureName"
          value={formData.signatureName}
          onChange={handleChange}
          placeholder="Nama penandatangan"
        />
      </div>
    </>
  );
};

export default SignatureSection;
