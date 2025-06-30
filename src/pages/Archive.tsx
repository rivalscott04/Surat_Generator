
import { useLetterStore } from "@/hooks/use-letter-store";
import LetterTable from "@/components/surat-tugas/LetterTable";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Archive = () => {
  const { letters } = useLetterStore();
  const [activeTab, setActiveTab] = useState("surat-tugas");
  
  // Filter letters based on document type (category)
  const suratTugasLetters = letters.filter(letter => letter.category === "Surat Tugas");
  const notaDinasLetters = letters.filter(letter => letter.category === "Nota Dinas");
  
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
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
};

export default Archive;
