
import React, { useEffect, useState, useRef } from "react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Person } from "@/types/surat-tugas";
import { searchEmployees } from "@/services/employee-service";

interface SKEmployeeSearchProps {
  value: Person;
  onSelect: (person: Partial<Person>) => void;
  error?: string;
}

const SKEmployeeSearch: React.FC<SKEmployeeSearchProps> = ({ value, onSelect, error }) => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.length > 2) {
      setLoading(true);
      searchEmployees(search).then(res => {
        setEmployees(res);
        setLoading(false);
      });
    } else {
      setEmployees([]);
    }
  }, [search]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Tampilkan nip pegawai yg aktif (jika sudah dipilih)
  useEffect(() => {
    if (value?.nip && search === "") {
      setSearch(value.nip);
    }
  }, [value?.nip]);

  return (
    <div>
      <div className="relative">
        <Command className="border rounded-md">
          <CommandInput
            ref={inputRef}
            placeholder="Ketik NIP atau nama..."
            value={search}
            onValueChange={setSearch}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            className="bg-white"
          />
          {open && (
            <CommandList>
              {employees.length > 0 ? (
                <CommandGroup>
                  {employees.map((employee) => (
                    <CommandItem
                      key={employee.nip}
                      value={employee.nip}
                      onSelect={() => {
                        onSelect({
                          nip: employee.nip,
                          nama: employee.nama,
                          jabatan: employee.jabatan,
                          unitKerja: employee.unitKerja,
                          pangkat: employee.pangkat,
                        });
                        setSearch(employee.nip);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.nama}</span>
                        <span className="text-sm text-gray-500">{employee.nip}</span>
                        <span className="text-xs text-gray-400">{employee.jabatan}</span>
                        <span className="text-xs text-gray-400">{employee.unitKerja}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : search.length > 2 && !loading ? (
                <CommandEmpty>Tidak ada hasil</CommandEmpty>
              ) : null}
            </CommandList>
          )}
        </Command>
        {loading && (
          <span className="absolute right-2 top-2 text-xs text-gray-400">loading...</span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      <p className="text-xs text-gray-400 mt-1">
        Cari pegawai berdasarkan NIP atau nama. Data akan dilengkapi otomatis.
      </p>
    </div>
  );
};

export default SKEmployeeSearch;
