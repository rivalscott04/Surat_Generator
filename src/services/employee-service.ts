export interface Employee {
  nip: string;
  nama: string;
  jabatan: string;
  unitKerja: string;
  pangkat: string;
}

// Fungsi login untuk mendapatkan JWT token
export async function login(username: string, password: string) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login gagal');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

// Service pencarian pegawai ke API BE
export async function searchEmployees(query: string) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Belum login. Silakan login terlebih dahulu.');
  }

  // Deteksi apakah query NIP (angka) atau nama (huruf)
  const isNip = /^\d+$/.test(query);
  
  if ((isNip && query.length < 4) || (!isNip && query.length < 4)) {
    // Tidak valid, return array kosong
    return [];
  }

  const url = new URL('http://localhost:3000/api/pegawai/search-surat');
  if (isNip) {
    url.searchParams.append('nip', query);
  } else {
    url.searchParams.append('nama', query);
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Token expired. Silakan login ulang.');
    }
    throw new Error('Gagal mengambil data pegawai');
  }
  
  const data = await res.json();

  // Mapping field dari BE ke FE
  return data.map((employee: any) => ({
    nip: employee.nip,
    nama: employee.nama,
    jabatan: employee.jabatan,
    unitKerja: employee.unit_kerja,
    pangkat: employee.golongan,
  }));
}
