import React from "react";
import { Person } from "@/types/surat-tugas";

interface PeopleTableProps {
  people: Person[];
  startIndex?: number;
  showHeader?: boolean;
}

const PeopleTable: React.FC<PeopleTableProps> = ({ people, startIndex = 0, showHeader = true }) => {
  // Function to clean up excessive spaces in names
  const cleanName = (name: string) => {
    if (!name) return ".........................";
    return name.replace(/\s+/g, ' ').trim();
  };

  return (
    <table 
      className="w-full border-collapse table-fixed text-xs"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {showHeader && (
        <thead>
          <tr>
            <th className="border border-black p-2 text-center w-[40px] text-xs">No</th>
            <th className="border border-black p-2 text-center w-[200px] text-xs">Nama/NIP</th>
            <th className="border border-black p-2 text-center text-xs">Jabatan</th>
            <th className="border border-black p-2 text-center w-[120px] text-xs">Ket.</th>
          </tr>
        </thead>
      )}
      <tbody>
        {people.map((person, index) => (
          <tr key={index}>
            <td className="border border-black p-2 text-center text-xs">{startIndex + index + 1}</td>
            <td className="border border-black p-2 whitespace-normal text-xs">
              <div className="font-medium">{cleanName(person.nama)}</div>
              <div className="text-xs">{person.nip || "........................."}</div>
            </td>
            <td className="border border-black p-2 text-xs">
              <div className="whitespace-normal">
                {person.jabatan || "........................."}
                {person.unitKerja && ` pada ${person.unitKerja}`}
              </div>
            </td>
            <td className="border border-black p-2 text-xs">
              <div className="whitespace-normal">{person.keterangan || ""}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PeopleTable;
