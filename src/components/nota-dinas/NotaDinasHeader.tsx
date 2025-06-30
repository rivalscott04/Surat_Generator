
import React from "react";
import { StaticData } from "@/types/nota-dinas";

interface NotaDinasHeaderProps {
  staticData: StaticData;
  formattedNumber: string;
}

const NotaDinasHeader: React.FC<NotaDinasHeaderProps> = ({ staticData, formattedNumber }) => {
  return (
    <>
      {/* Header with Logo */}
      <div className="text-center mb-6 relative">
        <div className="absolute left-0 top-0">
          <img
            src="https://cdn.kemenag.go.id/storage/archives/logo-kemenag-png-1png.png"
            alt="Logo Kementerian Agama"
            className="w-20 h-20"
          />
        </div>
        <div className="mx-auto">
          <p className="text-sm font-bold">KEMENTERIAN AGAMA REPUBLIK INDONESIA</p>
          <p className="text-sm font-bold">KANTOR WILAYAH KEMENTERIAN AGAMA</p>
          <p className="text-sm font-bold">PROVINSI NUSA TENGGARA BARAT</p>
          <p className="text-xs">{staticData.headerInfo.address}</p>
          <p className="text-xs">{staticData.headerInfo.website}</p>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="border-b-2 border-black mb-6"></div>

      <div className="text-center mb-8">
        <h1 className="text-lg font-bold uppercase mb-2">NOTA DINAS</h1>
        <p className="text-sm">Nomor: {formattedNumber || "........................."}</p>
      </div>
    </>
  );
};

export default NotaDinasHeader;
