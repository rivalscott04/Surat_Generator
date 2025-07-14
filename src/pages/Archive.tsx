import LetterTable from "@/components/surat-tugas/LetterTable";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, FileSpreadsheet, FileCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Archive = () => {
  const [activeTab, setActiveTab] = useState("surat-tugas");
  const [serverLetters, setServerLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLetters() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/letters', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Gagal mengambil data arsip dari server');
        const data = await res.json();
        setServerLetters(data);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data arsip');
      } finally {
        setLoading(false);
      }
    }
    fetchLetters();
  }, []);

  // Mapping data backend ke LetterHistory agar LetterTable bisa render
  function mapServerToLetterHistory(server) {
    const contentObj = typeof server.content === "string"
      ? JSON.parse(server.content)
      : (server.content || {});
    return {
      id: String(server.id),
      letterNumber: server.nomor_surat,
      category: server.letter_type,
      subcategory: contentObj.subcategory || "",
      documentType: server.letter_type === "KP" ? "Surat Tugas" : server.letter_type,
      createdAt: server.created_at,
      people: contentObj.people ?? [],
      title: server.perihal,
      useTableFormat: contentObj.useTableFormat,
      menimbang: contentObj.menimbang ?? ["", ""],
      dasar: contentObj.dasar ?? "",
      signatureName: contentObj.signatureName ?? "",
      content: contentObj
    };
  }

  const suratTugasLetters = serverLetters.filter(l => l.letter_type === "KP" || l.letter_type === "SURAT_TUGAS").map(mapServerToLetterHistory);
  const notaDinasLetters = [];
  const suratKeputusanLetters = [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Arsip Dokumen</h1>
          <div className="flex space-x-2">
            <Link to="/surat-tugas">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Buat Surat Tugas
              </Button>
            </Link>
            <Link to="/nota-dinas">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Buat Nota Dinas
              </Button>
            </Link>
            <Link to="/surat-keputusan">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Buat Surat Keputusan
              </Button>
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Memuat data arsip dari server...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <Tabs defaultValue="surat-tugas" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="surat-tugas" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Surat Tugas
              </TabsTrigger>
              <TabsTrigger value="nota-dinas" className="flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Nota Dinas
              </TabsTrigger>
              <TabsTrigger value="surat-keputusan" className="flex items-center">
                <FileCheck className="mr-2 h-4 w-4" />
                Surat Keputusan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="surat-tugas" className="mt-0">
              <LetterTable 
                letters={suratTugasLetters} 
                documentType="Surat Tugas"
              />
            </TabsContent>
            <TabsContent value="nota-dinas" className="mt-0">
              <LetterTable 
                letters={notaDinasLetters} 
                documentType="Nota Dinas"
              />
            </TabsContent>
            <TabsContent value="surat-keputusan" className="mt-0">
              <LetterTable 
                letters={suratKeputusanLetters} 
                documentType="Surat Keputusan"
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Archive;
