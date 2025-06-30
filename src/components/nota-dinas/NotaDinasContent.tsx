
import React from "react";
import { NotaDinasData, StaticData } from "@/types/nota-dinas";
import NotaDinasHeader from "./NotaDinasHeader";
import SignatureSection from "../surat-tugas/SignatureSection";

interface NotaDinasContentProps {
  formData: NotaDinasData;
  staticData: StaticData;
  formatLetterNumber: (userNumber: string) => string;
  getCurrentDate: () => string;
  getAnchorSymbol: () => string;
}

const NotaDinasContent: React.FC<NotaDinasContentProps> = ({
  formData,
  staticData,
  formatLetterNumber,
  getCurrentDate,
  getAnchorSymbol,
}) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-8 min-h-[29.7cm] bg-white shadow-inner mb-8 print:mb-0 print:min-h-screen print:rounded-none print:shadow-none print:border-none"
      style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt", textAlign: "justify" }}
    >
      <NotaDinasHeader 
        staticData={staticData} 
        formattedNumber={formatLetterNumber(formData.nomor)} 
      />

      <div className="space-y-4 text-sm">
        {/* Kepada section */}
        <div className="flex mb-2">
          <div className="w-[80px] font-bold">Kepada</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">{formData.kepada || "........................."}</div>
        </div>

        {/* Dari section */}
        <div className="flex mb-2">
          <div className="w-[80px] font-bold">Dari</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">{formData.dari || "........................."}</div>
        </div>

        {/* Perihal section */}
        <div className="flex mb-2">
          <div className="w-[80px] font-bold">Perihal</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">{formData.perihal || "........................."}</div>
        </div>
        
        {/* Tanggal section - always shown */}
        <div className="flex mb-2">
          <div className="w-[80px] font-bold">Tanggal</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">{formData.tanggalSurat || formData.tanggal || "........................."}</div>
        </div>
        
        {/* Date section - always shown regardless of tanggalSurat */}
        <div className="border-t border-gray-400 my-4"></div>
        
        {/* Dengan Hormat section */}
        <div className="mb-4">
          <p>Dengan Hormat,</p>
        </div>
        
        {/* Narasi section */}
        <div className="mb-6 text-justify">
          <p>{formData.narasi || "........................."}</p>
        </div>

        {/* Detail waktu dan tempat */}
        <div className="mb-6 ml-4">
          <div className="flex mb-2">
            <div className="w-[80px]">Hari/Tgl</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1">{formData.hari ? `${formData.hari}, ${formData.tanggal}` : "........................."}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-[80px]">Waktu</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1">{formData.waktu || "........................."}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-[80px]">Tempat</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1">{formData.tempat || "........................."}</div>
          </div>
        </div>
        
        {/* Penutup */}
        <div className="mb-8">
          <p>Demikian dan atas kehadirannya disampaikan terima kasih.</p>
        </div>

        <SignatureSection 
          getCurrentDate={getCurrentDate} 
          useTTE={formData.useTTE} 
          anchorSymbol={getAnchorSymbol()} 
          signatureName={formData.signatureName}
        />
      </div>
    </div>
  );
};

export default NotaDinasContent;
