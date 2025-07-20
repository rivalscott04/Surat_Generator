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
  // Check if we need to split content for table format with 3 or 4 people
  const shouldSplitForTable = formData.useTableFormat && (formData.people.length === 3 || formData.people.length === 4);
  
  // For table format, show only 3 people on first page
  const firstPageTablePeople = formData.useTableFormat ? formData.people.slice(0, 3) : formData.people;
  const secondPageTablePeople = formData.useTableFormat ? formData.people.slice(3) : [];

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

          <div className="text-center font-bold mb-2">
            <p>Memberi Tugas</p>
          </div>
          <div className="flex">
            <div className="w-[120px] font-bold">Kepada</div>
            <div className="w-[20px] text-center">:</div>
            <div className="flex-1">
              {formData.useTableFormat ?
                <PeopleTable people={firstPageTablePeople} /> :
                <PeopleList people={formData.people ?? []} totalPeople={(formData.people ?? []).length} />
              }
            </div>
          </div>

          {/* Untuk section - hanya muncul jika tidak menggunakan split untuk tabel */}
          {!shouldSplitForTable && (
            <div className="flex">
              <div className="w-[120px] font-bold">Untuk</div>
              <div className="w-[20px] text-center">:</div>
              <div className="flex-1 text-justify">{formData.untuk || "........................."}</div>
            </div>
          )}

          {/* Penutup dan SignatureSection - hanya muncul jika tidak menggunakan split untuk tabel */}
          {!shouldSplitForTable && (
            <>
              <p className="text-justify">
                Demikian Surat Tugas ini dibuat untuk dapat dilaksanakan sebagaimana mestinya.
              </p>

              <SignatureSection 
                getCurrentDate={getCurrentDate} 
                useTTE={formData.useTTE} 
                anchorSymbol={formData.anchorSymbol} 
                signatureName={formData.signatureName}
                signatureDate={formData.signatureDate}
                useCurrentDate={formData.useCurrentDate}
              />
            </>
          )}
        </div>
      </div>

      {/* Second Page - untuk data tambahan tabel (tanpa header) */}
      {formData.useTableFormat && secondPageTablePeople.length > 0 && (
        <div
          className="border border-gray-200 rounded-lg p-8 min-h-[29.7cm] bg-white shadow-inner mb-8 print:mb-0 print:min-h-screen print:rounded-none print:shadow-none print:border-none"
          style={{ fontFamily: "Arial, sans-serif", fontSize: "12pt", textAlign: "justify" }}
        >
          <div className="space-y-6 text-sm">
            <div className="flex">
              <div className="w-[120px]"></div>
              <div className="w-[20px]"></div>
              <div className="flex-1">
                <PeopleTable people={secondPageTablePeople} startIndex={3} showHeader={true} />
              </div>
            </div>
            
            {/* Untuk section */}
            <div className="flex">
              <div className="w-[120px] font-bold">Untuk</div>
              <div className="w-[20px] text-center">:</div>
              <div className="flex-1 text-justify">{formData.untuk || "........................."}</div>
            </div>

            {/* Penutup dan SignatureSection */}
            <p className="text-justify">
              Demikian Surat Tugas ini dibuat untuk dapat dilaksanakan sebagaimana mestinya.
            </p>

            <SignatureSection 
              getCurrentDate={getCurrentDate} 
              useTTE={formData.useTTE} 
              anchorSymbol={formData.anchorSymbol} 
              signatureName={formData.signatureName}
              signatureDate={formData.signatureDate}
              useCurrentDate={formData.useCurrentDate}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LetterContent;
