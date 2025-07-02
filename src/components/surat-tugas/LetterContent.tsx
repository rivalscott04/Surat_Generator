import React from "react";
import { FormData, Person, StaticData } from "@/types/surat-tugas";
import LetterHeader from "./LetterHeader";
import PeopleTable from "./PeopleTable";
import PeopleList from "./PeopleList";
import SignatureSection from "./SignatureSection";

interface LetterContentProps {
  formData: FormData;
  staticData: StaticData;
  formatLetterNumber: (userNumber: string, formData: FormData) => string;
  getCurrentDate: () => string;
  getAnchorSymbol: () => string;
  firstPagePeople: Person[];
  secondPagePeople: Person[];
  needsPagination: boolean;
}

const LetterContent: React.FC<LetterContentProps> = ({
  formData,
  staticData,
  formatLetterNumber,
  getCurrentDate,
  getAnchorSymbol,
  firstPagePeople,
  secondPagePeople,
  needsPagination,
}) => {
  return (
    <>
      {/* First Page */}
      <div
        className="border border-gray-200 rounded-lg p-8 min-h-[29.7cm] bg-white shadow-inner mb-8 print:mb-0 print:min-h-screen print:rounded-none print:shadow-none print:border-none"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt", textAlign: "justify" }}
      >
        <LetterHeader 
          staticData={staticData}
          formattedNumber={formatLetterNumber(formData.nomor, formData)}
        />

        {/* Fixed layout for sections to prevent overlap */}
        <div className="space-y-6 text-sm">
          {/* Menimbang section with table-like layout */}
          <div className="flex">
            <div className="w-[120px] font-bold">Menimbang</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1 text-justify">
              {(formData.menimbang ?? []).map((item, idx) => (
                <div className="mb-2 flex items-start" key={idx}>
                  <span className="mr-1">{String.fromCharCode(97 + idx)}.</span>
                  <span className="flex-1 text-justify whitespace-pre-line break-words">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dasar section with table-like layout */}
          <div className="flex">
            <div className="w-[120px] font-bold">Dasar</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1 text-justify">{formData.dasar}</div>
          </div>

          <div className="text-center font-bold">
            <p>Memberi Tugas</p>
          </div>

          {/* Kepada section with table-like layout */}
          <div className="flex">
            <div className="w-[120px] font-bold">Kepada</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1">
              {formData.useTableFormat ? 
                <PeopleTable people={firstPagePeople} /> : 
                <PeopleList 
                  people={firstPagePeople} 
                  totalPeople={(formData.people ?? []).length} 
                />
              }
            </div>
          </div>

          {/* Untuk section with table-like layout - only on first page if no pagination */}
          {!needsPagination && (
            <div className="flex">
              <div className="w-[120px] font-bold">Untuk</div>
              <div className="w-[20px] text-center">:</div>
              <div className="flex-1 text-justify">{formData.untuk || "........................."}</div>
            </div>
          )}

          {!needsPagination && (
            <>
              <p className="text-justify">
                Demikian Surat Tugas ini dibuat untuk dapat dilaksanakan sebagaimana mestinya.
              </p>

              <SignatureSection 
                getCurrentDate={getCurrentDate} 
                useTTE={formData.useTTE} 
                anchorSymbol={formData.anchorSymbol} 
                signatureName={formData.signatureName}
              />
            </>
          )}
        </div>
      </div>

      {/* Second Page (if needed) */}
      {needsPagination && (
        <div
          className="border border-gray-200 rounded-lg p-8 min-h-[29.7cm] bg-white shadow-inner print:min-h-screen print:rounded-none print:shadow-none print:border-none print:break-before-page"
          style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt", textAlign: "justify" }}
        >
          {/* Kepada section continuation - without repeating the header */}
          {secondPagePeople.length > 0 && (
            <div className="mb-6">
              {formData.useTableFormat ? 
                <PeopleTable people={secondPagePeople} /> : 
                <PeopleList 
                  people={secondPagePeople} 
                  startIndex={firstPagePeople.length} 
                  totalPeople={(formData.people ?? []).length} 
                />
              }
            </div>
          )}

          {/* Untuk section with table-like layout - only on second page if pagination */}
          <div className="flex mb-6">
            <div className="w-[120px] font-bold">Untuk</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1 text-justify">{formData.untuk || "........................."}</div>
          </div>

          <p className="text-justify">
            Demikian Surat Tugas ini dibuat untuk dapat dilaksanakan sebagaimana mestinya.
          </p>

          <SignatureSection 
            getCurrentDate={getCurrentDate} 
            useTTE={formData.useTTE} 
            anchorSymbol={formData.anchorSymbol} 
            signatureName={formData.signatureName}
          />
        </div>
      )}
    </>
  );
};

export default LetterContent;
