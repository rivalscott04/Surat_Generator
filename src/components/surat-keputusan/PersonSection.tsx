
import React from "react";
import { Input } from "@/components/ui/input";
import FormField from "@/components/ui/form-field";
import SKEmployeeSearch from "./SKEmployeeSearch";
import { Person } from "@/types/surat-tugas";

interface PersonSectionProps {
  person: Person;
  errors: Record<string, string>;
  onPersonChange: (field: keyof Person, value: string) => void;
  onEmployeeSelect: (employee: Partial<Person>) => void;
}

const PersonSection: React.FC<PersonSectionProps> = ({
  person,
  errors,
  onPersonChange,
  onEmployeeSelect,
}) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold mb-4">Data Pegawai</h3>
      <div className="mb-6 p-4 border border-gray-200 rounded-md space-y-4">
        <FormField 
          label="NIP (Auto Search)" 
          required
          error={errors.nip}
          htmlFor="nip-search"
        >
          <SKEmployeeSearch
            value={person}
            onSelect={onEmployeeSelect}
            error={errors.nip}
          />
        </FormField>

        <FormField 
          label="Nama" 
          required
          error={errors.nama}
          htmlFor="nama"
        >
          <Input
            type="text"
            id="nama"
            value={person.nama}
            readOnly
            className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Nama pegawai (otomatis dari sistem)"
          />
        </FormField>

        <FormField 
          label="Pangkat" 
          required
          error={errors.pangkat}
          htmlFor="pangkat"
        >
          <Input
            type="text"
            id="pangkat"
            value={person.pangkat}
            readOnly
            className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Pangkat pegawai (otomatis dari sistem)"
          />
        </FormField>

        <FormField 
          label="Jabatan" 
          required
          error={errors.jabatan}
          htmlFor="jabatan"
        >
          <Input
            type="text"
            id="jabatan"
            value={person.jabatan}
            readOnly
            className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Jabatan pegawai (otomatis dari sistem)"
          />
        </FormField>

        <FormField 
          label="Unit Kerja" 
          required
          error={errors.unitKerja}
          htmlFor="unitKerja"
        >
          <Input
            type="text"
            id="unitKerja"
            value={person.unitKerja}
            readOnly
            className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Unit Kerja pegawai (otomatis dari sistem)"
          />
        </FormField>

        <FormField 
          label="Keterangan" 
          required={false}
          error={errors.keterangan}
          htmlFor="keterangan"
        >
          <Input
            type="text"
            id="keterangan"
            value={person.keterangan}
            onChange={e => onPersonChange("keterangan", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Catatan tambahan (opsional)"
          />
        </FormField>
      </div>
    </div>
  );
};

export default PersonSection;
