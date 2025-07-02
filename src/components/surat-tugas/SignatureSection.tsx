import React from "react";

interface SignatureSectionProps {
  getCurrentDate: () => string;
  useTTE: boolean;
  anchorSymbol: string;
  signatureName: string;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ 
  getCurrentDate, 
  useTTE, 
  anchorSymbol,
  signatureName 
}) => {
  const symbolMap: Record<string, string> = {
    caret: '^',
    pagar: '#',
    dolar: '$',
  };

  return (
    <div className="mt-12">
      <div className="flex justify-end">
        <div className="w-48">
          <div className="text-left">
            <p>Mataram, {getCurrentDate()}</p>
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
