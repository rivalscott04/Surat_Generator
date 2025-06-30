
import React from "react";
import { Input } from "@/components/ui/input";
import FormField from "@/components/ui/form-field";
import { User } from "lucide-react";
import { anchorSymbols } from "@/types/surat-tugas";

interface SignatureSectionProps {
  useTTE: boolean;
  anchorSymbol: string;
  signatureName: string;
  onUseTTEToggle: (checked: boolean) => void;
  onAnchorSymbolChange: (symbol: string) => void;
  onSignatureNameChange: (val: string) => void;
  error?: string;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  useTTE,
  anchorSymbol,
  signatureName,
  onUseTTEToggle,
  onAnchorSymbolChange,
  onSignatureNameChange,
  error,
}) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold mb-4">Tanda Tangan</h3>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="useTTE"
          name="useTTE"
          checked={useTTE}
          onChange={e => onUseTTEToggle(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="useTTE" className="ml-2 block text-sm font-medium text-gray-700">
          Gunakan Tanda Tangan Elektronik (TTE)
        </label>
      </div>
      {useTTE && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Simbol Anchor</label>
          <select
            name="anchorSymbol"
            value={anchorSymbol}
            onChange={e => onAnchorSymbolChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {anchorSymbols.map(anchor => (
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
        error={error}
        htmlFor="signatureName"
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <Input
            type="text"
            id="signatureName"
            name="signatureName"
            value={signatureName}
            onChange={e => onSignatureNameChange(e.target.value)}
            placeholder="Masukkan nama penandatangan"
            className={error ? "border-red-500" : ""}
          />
        </div>
      </FormField>
    </div>
  );
};

export default SignatureSection;
