
export interface SubSubCategory {
  value: string;
  text: string;
}

export interface SubCategory {
  value: string;
  text: string;
  children?: SubSubCategory[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export const letterCategories: Record<string, Category> = {
  "OT": {
    id: "OT",
    name: "Organisasi dan Tata Laksana",
    subcategories: [
      { value: "OT.00", text: "Organisasi" },
      { 
        value: "OT.01", 
        text: "Tata Laksana", 
        children: [
          { value: "OT.01.1", text: "Perencanaan" },
          { value: "OT.01.2", text: "Laporan" },
          { value: "OT.01.3", text: "Penyusunan Prosedur Kerja" },
          { value: "OT.01.4", text: "Penyusunan Pembakuan Sarana Kerja" }
        ]
      }
    ]
  },
  "HM": {
    id: "HM",
    name: "Kehumasan",
    subcategories: [
      { value: "HM.00", text: "Penerangan" },
      { value: "HM.01", text: "Hubungan" },
      {
        value: "HM.02", 
        text: "Dokumentasi dan Keputusan", 
        children: [
          { value: "HM.02.1", text: "Dokumentasi" },
          { value: "HM.02.2", text: "Kepustakaan" }
        ]
      },
      { value: "HM.03", text: "Keprotokolan" }
    ]
  },
  "KP": {
    id: "KP",
    name: "Kepegawaian",
    subcategories: [
      {
        value: "KP.00", 
        text: "Pengadaan", 
        children: [
          { value: "KP.00.1", text: "Formasi" },
          { value: "KP.00.2", text: "Penerimaan" },
          { value: "KP.00.3", text: "Pengangkatan" }
        ]
      },
      {
        value: "KP.01", 
        text: "Tata Usaha Kepegawaian", 
        children: [
          { value: "KP.01.1", text: "Izin/Dispensasi" },
          { value: "KP.01.2", text: "Keterangan" }
        ]
      },
      {
        value: "KP.02", 
        text: "Pendidikan Latihan", 
        children: [
          { value: "KP.02.1", text: "Diklat Prajabatan" },
          { value: "KP.02.2", text: "Diklat Dalam Jabatan" },
          { value: "KP.02.3", text: "Latihan/Kursus Penataran" }
        ]
      },
      {
        value: "KP.03", 
        text: "KORPRI", 
        children: [
          { value: "KP.03.1", text: "Dharma Wanita" },
          { value: "KP.03.2", text: "Pemilu" }
        ]
      },
      {
        value: "KP.04", 
        text: "Penilaian dan Hukuman", 
        children: [
          { value: "KP.04.1", text: "Penilaian" },
          { value: "KP.04.2", text: "Hukuman" }
        ]
      },
      { value: "KP.05", text: "Screening" },
      { value: "KP.06", text: "Pembinaan Mental" },
      {
        value: "KP.07", 
        text: "Mutasi", 
        children: [
          { value: "KP.07.1", text: "Kepangkatan" },
          { value: "KP.07.2", text: "Kenaikan Berkala" },
          { value: "KP.07.3", text: "Penyesuaian Masa Kerja" },
          { value: "KP.07.4", text: "Penyesuaian Tunjangan Keluarga" },
          { value: "KP.07.5", text: "Alih Tugas" },
          { value: "KP.07.6", text: "Jabatan Struktural/Fungsional" }
        ]
      },
      {
        value: "KP.08", 
        text: "Kesejahteraan", 
        children: [
          { value: "KP.08.1", text: "Kesehatan" },
          { value: "KP.08.2", text: "Cuti" },
          { value: "KP.08.3", text: "Rekreasi" },
          { value: "KP.08.4", text: "Bantuan Sosial" },
          { value: "KP.08.5", text: "Koperasi" },
          { value: "KP.08.6", text: "Perumahan" },
          { value: "KP.08.7", text: "Antar Jemput" },
          { value: "KP.08.8", text: "Penghargaan" }
        ]
      },
      {
        value: "KP.09", 
        text: "Pemutusan Hubungan Kerja", 
        children: [
          { value: "KP.09.1", text: "Pensiun" },
          { value: "KP.09.2", text: "Asuransi" },
          { value: "KP.09.3", text: "Meninggal Dunia" }
        ]
      }
    ]
  },
  "KU": {
    id: "KU",
    name: "Keuangan",
    subcategories: [
      {
        value: "KU.00", 
        text: "Anggaran", 
        children: [
          { value: "KU.00.1", text: "Rutin" },
          { value: "KU.00.2", text: "Pembangunan" },
          { value: "KU.00.3", text: "Non Budgetter" }
        ]
      },
      {
        value: "KU.01", 
        text: "S P P", 
        children: [
          { value: "KU.01.1", text: "SPP Beban Tetap dan Sementara Rutin" },
          { value: "KU.01.2", text: "SPP Beban Tetap dan Sementara Pembangunan" }
        ]
      },
      {
        value: "KU.02", 
        text: "SPJ Rutin/Pembangunan", 
        children: [
          { value: "KU.02.1", text: "SPJ Rutin" },
          { value: "KU.02.2", text: "SPJ Pembangunan" },
          { value: "KU.02.3", text: "SPJ Non Budgetter" }
        ]
      },
      {
        value: "KU.03", 
        text: "Pendapatan Negara", 
        children: [
          { value: "KU.03.1", text: "Pajak" },
          { value: "KU.03.2", text: "Bukan Pajak" }
        ]
      },
      {
        value: "KU.04", 
        text: "Perbankan", 
        children: [
          { value: "KU.04.1", text: "Valuta asing/Transfer" },
          { value: "KU.04.2", text: "Saldo rekening" }
        ]
      },
      { value: "KU.05", text: "Sumbangan/Bantuan" }
    ]
  },
  "KS": {
    id: "KS",
    name: "Kesekretariatan",
    subcategories: [
      {
        value: "KS.00", 
        text: "Kerumahtanggaan", 
        children: [
          { value: "KS.00.1", text: "Pinjam Fasilitas" },
          { value: "KS.00.2", text: "Konsumsi" },
          { value: "KS.00.3", text: "Keamanan" },
          { value: "KS.00.4", text: "Pakaian Dinas" },
          { value: "KS.00.5", text: "Papan Nama" }
        ]
      },
      {
        value: "KS.01", 
        text: "Perlengkapan", 
        children: [
          { value: "KS.01.1", text: "Gedung" },
          { value: "KS.01.2", text: "Alat Kantor" },
          { value: "KS.01.3", text: "Mesin Kantor/Alat Elektronik" },
          { value: "KS.01.4", text: "Perabot Kantor" },
          { value: "KS.01.5", text: "Kendaraan" },
          { value: "KS.01.6", text: "Inventaris Perlengkapan" },
          { value: "KS.01.7", text: "Penawaran Umum" }
        ]
      },
      {
        value: "KS.02", 
        text: "Ketatausahaan", 
        children: [
          { value: "KS.02.1", text: "Korespondensi dan Kearsipan" },
          { value: "KS.02.2", text: "Surat" },
          { value: "KS.02.3", text: "Cap Dinas" }
        ]
      }
    ]
  },
  "HK": {
    id: "HK",
    name: "Hukum",
    subcategories: [
      {
        value: "HK.00", 
        text: "Peraturan Perundang-undangan", 
        children: [
          { value: "HK.00.1", text: "Undang-undang termasuk PERPU" },
          { value: "HK.00.2", text: "Peraturan Pemerintah" },
          { value: "HK.00.3", text: "Keputusan Presiden, Instruksi Presiden" },
          { value: "HK.00.4", text: "Peraturan Menteri, Instruksi Menteri" },
          { value: "HK.00.5", text: "Keputusan Menteri, Pimpinan Unit Eselon I, II" },
          { value: "HK.00.6", text: "SKB Menteri-Menteri/Pimpinan Unit Eselon I, II" },
          { value: "HK.00.7", text: "Edaran Menteri/Pimpinan Unit Eselon I, II" },
          { value: "HK.00.8", text: "Peraturan Kanwil/Kankemenag" },
          { value: "HK.00.9", text: "Peraturan PEMDA" }
        ]
      },
      {
        value: "HK.01", 
        text: "Pidana", 
        children: [
          { value: "HK.01.1", text: "Pencurian" },
          { value: "HK.01.2", text: "Korupsi" }
        ]
      },
      {
        value: "HK.02", 
        text: "Perdata", 
        children: [
          { value: "HK.02.1", text: "Perikatan" }
        ]
      },
      {
        value: "HK.03", 
        text: "Hukum Agama", 
        children: [
          { value: "HK.03.1", text: "Fatwa" },
          { value: "HK.03.2", text: "Rukyat/Hisab" },
          { value: "HK.03.3", text: "Hari Besar Islam" }
        ]
      },
      {
        value: "HK.04", 
        text: "Bantuan Hukum", 
        children: [
          { value: "HK.04.1", text: "Kasus Hukum Pidana" },
          { value: "HK.04.2", text: "Kasus Hukum Perdata" },
          { value: "HK.04.3", text: "Penelaahan Hukum" }
        ]
      }
    ]
  },
  "PW": {
    id: "PW",
    name: "Perkawinan",
    subcategories: [
      { value: "PW.00", text: "Penyuluhan" },
      { value: "PW.01", text: "Perkawinan" },
      { value: "PW.02", text: "Campuran Antar Agama dan Bangsa" }
    ]
  },
  "HJ": {
    id: "HJ",
    name: "Haji",
    subcategories: [
      { value: "HJ.00", text: "Calon Haji" },
      { value: "HJ.01", text: "Bimbingan" },
      { value: "HJ.02", text: "Petugas Haji" },
      { value: "HJ.03", text: "Ongkos Naik Haji" },
      { value: "HJ.04", text: "Jamaah Calon Haji" },
      { value: "HJ.05", text: "Angkutan" },
      { value: "HJ.06", text: "Pengasramaan" },
      { value: "HJ.07", text: "Pembekalan" },
      { value: "HJ.08", text: "Dispensasi/ Recomendasi Khusus" },
      { value: "HJ.09", text: "Umroh" }
    ]
  },
  "BA": {
    id: "BA",
    name: "Pembinaan Agama",
    subcategories: [
      { value: "BA.00", text: "Penyuluhan" },
      {
        value: "BA.01", 
        text: "Bimbingan", 
        children: [
          { value: "BA.01.1", text: "Lembaga Keagamaan" },
          { value: "BA.01.2", text: "Aliran Kerohanian/Keagamaan" }
        ]
      },
      { value: "BA.02", text: "Kerukunan Hidup Beragama" },
      {
        value: "BA.03", 
        text: "Ibadah Dan Ibadah Sosial", 
        children: [
          { value: "BA.03.1", text: "Ibadah" },
          { value: "BA.03.2", text: "Ibadah Sosial" }
        ]
      },
      { value: "BA.04", text: "Pengembangan Keagamaan" },
      { value: "BA.05", text: "Rohaniwan" }
    ]
  },
  "PP": {
    id: "PP",
    name: "Pendidikan dan Pengajaran",
    subcategories: [
      {
        value: "PP.00", 
        text: "Kurukulum", 
        children: [
          { value: "PP.00.1", text: "Sekolah Umum Tingkat TK dan SD" },
          { value: "PP.00.2", text: "Sekolah Umum Tingkat SMTP" },
          { value: "PP.00.3", text: "Sekolah Umum Tingkat SMTA" },
          { value: "PP.00.4", text: "Perguruan Agama Tk. RA dan Ibtidaiyah" },
          { value: "PP.00.5", text: "Perguruan Agama Tk. Tsanawiyah" },
          { value: "PP.00.6", text: "Perguruan Agama Tk. Aliyah" },
          { value: "PP.00.7", text: "Pondok Pesantren" },
          { value: "PP.00.8", text: "Diniyah" },
          { value: "PP.00.9", text: "Perguruan Tinggi Agama" },
          { value: "PP.00.10", text: "Perguruan Tinggi Umum" },
          { value: "PP.00.11", text: "Pengembangan Sarjana Pendidikan" }
        ]
      },
      {
        value: "PP.01", 
        text: "Evaluasi dan Ijazah", 
        children: [
          { value: "PP.01.1", text: "Perguruan Agama" },
          { value: "PP.01.2", text: "Perguruan Umum" }
        ]
      },
      {
        value: "PP.02", 
        text: "Kepenilikan, Pengawasan dan Pembinaan", 
        children: [
          { value: "PP.02.1", text: "Kepenilikan" },
          { value: "PP.02.2", text: "Pengawasan" },
          { value: "PP.02.3", text: "Pembinaan" }
        ]
      },
      {
        value: "PP.03", 
        text: "Kelembagaan", 
        children: [
          { value: "PP.03.1", text: "Organisasi (Ekstra Kurikuler)" },
          { value: "PP.03.2", text: "Pengembangan (Filial, Kelas Jauh, Penyesuaian Status Swasta-Negeri)" }
        ]
      },
      { value: "PP.04", text: "Beasiswa" },
      { value: "PP.05", text: "Sumbangan" },
      { value: "PP.06", text: "Pengabdian" },
      { value: "PP.07", text: "Perizinan" }
    ]
  },
  "PS": {
    id: "PS",
    name: "Pengawasan",
    subcategories: [
      { value: "PS.00", text: "Pengawasan Administrasi Umum" },
      { value: "PS.01", text: "Tugas Umum" },
      {
        value: "PS.02", 
        text: "Proyek Pembangunan", 
        children: [
          { value: "PS.02.1", text: "Fisik" },
          { value: "PS.02.2", text: "Non Fisik" }
        ]
      }
    ]
  }
};

// Helper function to get all subcategory options
export const getSubcategoryOptions = (categoryId: string): { value: string, text: string }[] => {
  const category = letterCategories[categoryId];
  if (!category) return [];
  
  const options: { value: string, text: string }[] = [];
  
  category.subcategories.forEach(subCat => {
    options.push({ value: subCat.value, text: `${subCat.value} - ${subCat.text}` });
    
    if (subCat.children) {
      subCat.children.forEach(child => {
        options.push({ value: child.value, text: `${child.value} - ${child.text}` });
      });
    }
  });
  
  return options;
};

// Get category IDs and names for dropdown
export const getCategoryOptions = (): { id: string, name: string }[] => {
  return Object.values(letterCategories).map(category => ({
    id: category.id,
    name: category.name
  }));
};
