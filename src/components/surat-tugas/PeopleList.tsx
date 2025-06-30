import React from "react";
import { Person } from "@/types/surat-tugas";

interface PeopleListProps {
  people: Person[];
  startIndex?: number;
  totalPeople: number;
}

const PeopleList: React.FC<PeopleListProps> = ({ people, startIndex = 0, totalPeople }) => {
  return (
    <>
      {people.map((person, index) => (
        <div key={index} className={index > 0 ? "mt-4" : ""}>
          <div className="grid grid-cols-[20px_80px_10px_1fr] mb-1 items-start">
            <div rowSpan={4}>{totalPeople > 1 ? `${index + startIndex + 1}.` : ""}</div>
            <div>Nama</div>
            <div className="text-center">:</div>
            <div className="min-h-[1.25rem] align-top">{person.nama || "........................."}</div>
          </div>
          <div className="grid grid-cols-[20px_80px_10px_1fr] mb-1 items-start">
            <div></div>
            <div>NIP</div>
            <div className="text-center">:</div>
            <div className="min-h-[1.25rem] align-top">{person.nip || "........................."}</div>
          </div>
          <div className="grid grid-cols-[20px_80px_10px_1fr] mb-1 items-start">
            <div></div>
            <div>Jabatan</div>
            <div className="text-center">:</div>
            <div className="min-h-[1.25rem] align-top">{person.jabatan || "........................."}</div>
          </div>
          <div className="grid grid-cols-[20px_80px_10px_1fr] mb-1 items-start">
            <div></div>
            <div>Unit Kerja</div>
            <div className="text-center">:</div>
            <div className="min-h-[1.25rem] align-top">{person.unitKerja || "........................."}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PeopleList;
