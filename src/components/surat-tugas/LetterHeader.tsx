import React from "react";
import { StaticData } from "@/types/surat-tugas";

interface LetterHeaderProps {
  staticData: StaticData;
  formattedNumber: string;
}

const LetterHeader: React.FC<LetterHeaderProps> = ({ staticData, formattedNumber }) => {
  return (
    <>
      {/* Header with Logo & Text - Flex Layout */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
        <img
          src="/img/kemenag.png"
          alt="Logo Kementerian Agama"
          className="h-32 w-auto object-contain flex-shrink-0"
          style={{ maxWidth: '120px', maxHeight: '120px' }}
        />
        <div className="flex-1 sm:-ml-8">
          <div className="text-center">
            <p className="font-bold" style={{ fontSize: '14pt' }}>KEMENTERIAN AGAMA REPUBLIK INDONESIA</p>
            <p className="font-bold" style={{ fontSize: '12pt' }}>KANTOR WILAYAH KEMENTERIAN AGAMA</p>
            <p className="font-bold" style={{ fontSize: '12pt' }}>PROVINSI NUSA TENGGARA BARAT</p>
            <p style={{ fontSize: '10pt' }}>{staticData.headerInfo.address}</p>
            <p style={{ fontSize: '10pt' }}>{staticData.headerInfo.website}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="border-b-2 border-black"></div>

      <div className="text-center mt-4 mb-8">
        <h1 className="font-bold uppercase mb-2" style={{ fontSize: '14pt' }}>SURAT TUGAS</h1>
        <p className="text-sm">Nomor: {formattedNumber || "........................."}</p>
      </div>
    </>
  );
};

export default LetterHeader;
