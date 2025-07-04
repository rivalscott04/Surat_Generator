import React from "react";
import { Person } from "@/types/surat-tugas";

interface PeopleTableProps {
  people: Person[];
  startIndex?: number;
  showHeader?: boolean;
}

const PeopleTable: React.FC<PeopleTableProps> = ({ people, startIndex = 0, showHeader = true }) => {
  return (
    <table className="w-full border-collapse table-fixed">
      {showHeader && (
        <thead>
          <tr>
            <th className="border border-black p-2 text-center w-[40px]">No</th>
            <th className="border border-black p-2 text-center">Nama/NIP</th>
            <th className="border border-black p-2 text-center">Jabatan</th>
            <th className="border border-black p-2 text-center w-[60px]">Ket.</th>
          </tr>
        </thead>
      )}
      <tbody>
        {people.map((person, index) => (
          <tr key={index}>
            <td className="border border-black p-2 text-center">{startIndex + index + 1}</td>
            <td className="border border-black p-2 whitespace-normal">
              {person.nama || "........................."}
              <br />
              {person.nip || "........................."}
            </td>
            <td className="border border-black p-2 whitespace-normal">
              {person.jabatan || "........................."}
              <br />
              {person.unitKerja ? `pada ${person.unitKerja}` : ""}
            </td>
            <td className="border border-black p-2">{person.keterangan}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PeopleTable;
