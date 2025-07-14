import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface SignatureSectionProps {
  getCurrentDate: () => string;
  useTTE: boolean;
  anchorSymbol: string;
  signatureName: string;
  signatureDate: string;
  useCurrentDate: boolean;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ 
  getCurrentDate, 
  useTTE, 
  anchorSymbol,
  signatureName,
  signatureDate,
  useCurrentDate
}) => {
  const symbolMap: Record<string, string> = {
    caret: '^',
    pagar: '#',
    dolar: '$',
  };

  // Format date for display
  const getDisplayDate = () => {
    if (useCurrentDate) {
      return getCurrentDate();
    } else {
      try {
        const date = new Date(signatureDate);
        return format(date, "dd MMMM yyyy", { locale: id });
      } catch {
        return getCurrentDate(); // Fallback to current date if invalid
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="flex justify-end">
        <div className="w-48">
          <div className="text-left">
            <p>Mataram, {getDisplayDate()}</p>
            <p>Kepala,</p>
            
            <div className="h-24 relative">
              {useTTE && (
                <div className="absolute w-full text-left top-1/3">
                  <span className="font-bold" style={{ marginLeft: "4px" }}>{symbolMap[anchorSymbol] || anchorSymbol}</span>
                </div>
              )}
            </div>
            
            <p className="mt-6 font-bold">{signatureName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
