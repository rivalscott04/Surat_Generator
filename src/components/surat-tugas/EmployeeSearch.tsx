import React, { useEffect, useState, useRef } from 'react';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandGroup, 
  CommandItem, 
  CommandEmpty 
} from '@/components/ui/command';
import { Person } from '@/types/surat-tugas';
import { searchEmployees } from '@/services/employee-service';
import { useDebounce } from '@/hooks/use-debounce';

interface EmployeeSearchProps {
  index: number;
  onEmployeeSelect: (index: number, employeeData: Partial<Person>) => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({ index, onEmployeeSelect }) => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Deteksi apakah input NIP (angka) atau nama (huruf)
    const isNip = /^\d+$/.test(debouncedSearch);
    if ((isNip && debouncedSearch.length >= 5) || (!isNip && debouncedSearch.length >= 3)) {
      searchEmployees(debouncedSearch)
        .then(setEmployees)
        .catch((err) => setError(err.message));
    } else {
      setEmployees([]);
      setError(null);
    }
  }, [debouncedSearch]);

  // Focus on input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

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
            onBlur={() => setTimeout(() => setOpen(false), 200)} // delay to allow select
            className="bg-white"
          />
          {open && (
            <CommandList>
              {error ? (
                <CommandEmpty>{error}</CommandEmpty>
              ) : employees.length > 0 ? (
                <CommandGroup>
                  {employees.map((employee) => (
                    <CommandItem
                      key={employee.nip}
                      value={employee.nip}
                      onSelect={() => {
                        onEmployeeSelect(index, {
                          nip: employee.nip,
                          nama: employee.nama,
                          jabatan: employee.jabatan,
                          unitKerja: employee.unitKerja,
                          pangkat: employee.pangkat,
                        });
                        setSearch(employee.nip); // show selected NIP
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
              ) : debouncedSearch.length > 2 ? (
                <CommandEmpty>Tidak ada hasil</CommandEmpty>
              ) : null}
            </CommandList>
          )}
        </Command>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Data pegawai diambil otomatis dari API. Minimal ketik 3 huruf nama atau 5 digit awal NIP.
      </p>
    </div>
  );
};
