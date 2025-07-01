
import { useLetterStore } from "@/hooks/use-letter-store";
import LetterTable from "@/components/surat-tugas/LetterTable";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, FileSpreadsheet, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Archive = () => {
  const { letters, clearStorage } = useLetterStore();
  const [activeTab, setActiveTab] = useState("surat-tugas");
  
  // Filter letters based on document type
  const suratTugasLetters = letters.filter(letter => letter.documentType === "Surat Tugas");
  const notaDinasLetters = letters.filter(letter => letter.documentType === "Nota Dinas");
  const suratKeputusanLetters = letters.filter(letter => letter.documentType === "Surat Keputusan");
  
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
            <Button 
              onClick={clearStorage} 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear Storage
            </Button>
          </div>
        </div>
        
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
      </div>
      <Toaster />
    </div>
  );
};

export default Archive;
