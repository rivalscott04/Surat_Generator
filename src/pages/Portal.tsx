
import { 
  FileText, 
  Send, 
  FileCheck, 
  Users, 
  Calendar,
  Archive as ArchiveIcon,
  ClipboardList
} from "lucide-react";
import { Link } from "react-router-dom";
import LetterTypeCard from "@/components/portal/LetterTypeCard";

const letterTypes = [
  {
    title: "Surat Tugas",
    description: "Buat dan kelola surat tugas untuk pegawai",
    icon: FileText,
    to: "/surat-tugas",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Surat Keluar",
    description: "Buat dan kelola surat keluar instansi",
    icon: Send,
    to: "/surat-keluar",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Surat Keputusan",
    description: "Buat dan kelola surat keputusan",
    icon: FileCheck,
    to: "/surat-keputusan",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Surat Undangan",
    description: "Buat dan kelola surat undangan kegiatan",
    icon: Calendar,
    to: "/surat-undangan",
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Nota Dinas",
    description: "Buat dan kelola nota dinas instansi",
    icon: ClipboardList,
    to: "/nota-dinas",
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Arsip Surat",
    description: "Lihat arsip semua surat yang tersimpan",
    icon: ArchiveIcon,
    to: "/archive",
    color: "bg-slate-100 text-slate-600",
  },
];

export default function Portal() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Portal Surat</h1>
          <p className="text-lg text-muted-foreground">
            Pilih jenis surat yang ingin anda buat atau kelola
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {letterTypes.map((letterType) => (
            <LetterTypeCard
              key={letterType.title}
              title={letterType.title}
              description={letterType.description}
              icon={letterType.icon}
              to={letterType.to}
              color={letterType.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
