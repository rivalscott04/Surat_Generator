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
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!debouncedSearch) {
      setEmployees([]);
      setError(null);
      return;
    }

    // Deteksi apakah input NIP (angka) atau nama (huruf)
    const isNip = /^\d+$/.test(debouncedSearch);
    
    if ((isNip && debouncedSearch.length >= 4) || (!isNip && debouncedSearch.length >= 4)) {
      setIsLoading(true);
      setError(null);
      
      searchEmployees(debouncedSearch)
        .then((res) => {
          setEmployees(res);
        })
        .catch((err) => {
          setError(err.message);
          setEmployees([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setEmployees([]);
      setError(null);
    }
  }, [debouncedSearch]);

  return (
    <div>
      <div className="relative">
        <Command className="border rounded-md">
          <CommandInput
            ref={inputRef}
            placeholder="Ketik NIP atau nama..."
            value={search}
            onValueChange={val => {
              setSearch(val);
              setSelected(false);
            }}
            className="bg-white"
          />
          {(!selected && debouncedSearch.length >= 4) && (
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Mencari...</CommandEmpty>
              ) : error ? (
                <CommandEmpty className="text-red-500">{error}</CommandEmpty>
              ) : employees.length > 0 ? (
                <CommandGroup>
                  {employees.map((employee) => (
                    <CommandItem
                      key={employee.nip}
                      value={`${employee.nama} ${employee.nip}`}
                      onSelect={() => {
                        onEmployeeSelect(index, {
                          nip: employee.nip,
                          nama: employee.nama,
                          jabatan: employee.jabatan,
                          unitKerja: employee.unitKerja,
                          pangkat: employee.pangkat,
                        });
                        setEmployees([]); // tutup dropdown
                        setSearch(employee.nip); // show selected NIP
                        setSelected(true);
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
              ) : debouncedSearch.length >= 4 ? (
                <CommandEmpty>Tidak ada hasil</CommandEmpty>
              ) : null}
            </CommandList>
          )}
        </Command>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Data pegawai diambil otomatis dari API. Minimal ketik 4 huruf nama atau 4 digit NIP.
      </p>
    </div>
  );
};
