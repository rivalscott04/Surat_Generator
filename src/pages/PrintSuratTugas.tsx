import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LetterContent from "@/components/surat-tugas/LetterContent";
import { staticData } from "@/types/surat-tugas";

export default function PrintSuratTugas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/letters/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Gagal mengambil data surat');
        const server = await res.json();
        const contentObj = typeof server.content === "string" ? JSON.parse(server.content) : (server.content || {});
        setData({
          ...contentObj,
          createdAt: server.created_at,
        });
        setTimeout(() => {
          if (window.opener == null) {
            window.print();
          }
        }, 500);
      } catch (err) {
        setError("Gagal mengambil data surat");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Memuat surat...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-600">{error || "Surat tidak ditemukan"}</div>;

  return (
    <div className="bg-white min-h-screen p-8 print:p-0">
      <LetterContent
        formData={{
          nomor: data.nomor ?? "",
          category: data.category ?? "",
          subcategory: data.subcategory ?? "",
          month: data.month ?? "",
          year: data.year ?? "",
          menimbang: data.menimbang ?? ["", ""],
          dasar: data.dasar ?? "",
          untuk: data.untuk ?? "",
          people: data.people ?? [],
          useTTE: data.useTTE ?? false,
          anchorSymbol: data.anchorSymbol ?? "caret",
          useTableFormat: data.useTableFormat ?? true,
          signatureName: data.signatureName ?? ""
        }}
        staticData={staticData}
        formatLetterNumber={(_num, formData) => `${formData.nomor}/Kw.18.01/2/${formData.subcategory}/${formData.month}/${formData.year}`}
        getCurrentDate={() => new Date(data.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        getAnchorSymbol={() => "caret"}
        firstPagePeople={data.people ?? []}
        secondPagePeople={[]}
        needsPagination={false}
      />
      <div className="mt-8 flex justify-center print:hidden">
        <button onClick={() => {
          const printUrl = window.location.href;
          window.open(printUrl, '_blank');
        }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">Buka Tab Print</button>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kembali</button>
      </div>
    </div>
  );
} 