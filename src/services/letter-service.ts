export async function saveLetter(letterData: any) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Belum login');

  const res = await fetch('http://localhost:3000/api/letters', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(letterData),
  });

  if (!res.ok) throw new Error('Gagal menyimpan surat');
  return await res.json();
} 