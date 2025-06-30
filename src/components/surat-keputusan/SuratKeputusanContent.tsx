
import React from "react";
import { SuratKeputusanContentProps } from "@/types/surat-keputusan";
import SignatureSection from "../surat-tugas/SignatureSection";

const SuratKeputusanContent: React.FC<SuratKeputusanContentProps> = ({
  formData,
  staticData,
  formatLetterNumber,
  getCurrentDate,
  getAnchorSymbol,
}) => {
  return (
    <div 
      className="border border-gray-200 rounded-lg p-8 min-h-[29.7cm] bg-white shadow-inner mb-8 print:mb-0 print:min-h-screen print:rounded-none print:shadow-none print:border-none"
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', textAlign: 'justify' }}
    >
      {/* Centered Header with Logo */}
      <div className="mb-6 flex justify-center">
        <img
          src="https://cdn.kemenag.go.id/storage/archives/logo-kemenag-png-1png.png"
          alt="Logo Kementerian Agama"
          className="w-20 h-20"
        />
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-lg font-bold">{staticData.headerInfo.title}</h1>
        <p className="text-sm font-bold">NOMOR: {formatLetterNumber(formData.nomor) || "........................."}</p>
        <p className="text-sm font-bold">TENTANG</p>
        <p className="text-sm font-bold uppercase">{formData.tentang}</p>
        <p className="text-sm mt-6">{staticData.introText}</p>
        <p className="text-sm font-bold">{staticData.menteri}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex">
          <div className="w-[120px] font-bold">Menimbang</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1 text-justify">
            <p>bahwa berdasarkan ketentuan peraturan perundang-undangan, Pegawai Negeri Sipil yang namanya tersebut dalam keputusan ini, memenuhi syarat untuk ditetapkan gelar pendidikan dan perlu ditetapkan dengan keputusan.</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[120px] font-bold">Mengingat</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">
            <div className="flex mb-2">
              <div className="w-[20px]">1.</div>
              <div className="flex-1">Undang-Undang Nomor 5 Tahun 2014 tentang Aparatur Sipil Negara;</div>
            </div>
            <div className="flex mb-2">
              <div className="w-[20px]">2.</div>
              <div className="flex-1">Peraturan Pemerintah Nomor 17 Tahun 2020;</div>
            </div>
            <div className="flex mb-2">
              <div className="w-[20px]">3.</div>
              <div className="flex-1">Keputusan Menteri Agama Nomor 363 Tahun 2015;</div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-[120px] font-bold">Memperhatikan</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1 text-justify">
            Surat Deputi Bidang Penyelenggaraan Manajemen ASN Badan Kepegawaian Negara Nomor 8938/B-MP.01.03/SD/DI/2025 tanggal 5 Februari 2025.
          </div>
        </div>

        <div className="text-center font-bold">
          <p>MEMUTUSKAN:</p>
        </div>

        <div className="flex">
          <div className="w-[120px] font-bold">Menetapkan</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">
            <p>KEPUTUSAN MENTERI AGAMA TENTANG {formData.tentang.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[120px] font-bold">KESATU</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1">
            <p>Terhitung mulai tanggal {getCurrentDate()}, Pegawai Negeri Sipil tersebut di bawah ini :</p>
            <div className="ml-4 mt-2">
              <div className="grid grid-cols-[100px_20px_1fr] gap-y-1">
                <p>Nama</p>
                <p className="text-right">:</p>
                <p>{formData.person.nama}</p>
                
                <p>NIP</p>
                <p className="text-right">:</p>
                <p>{formData.person.nip}</p>
                
                <p>Pangkat</p>
                <p className="text-right">:</p>
                <p>{formData.person.pangkat}</p>
                
                <p>Jabatan</p>
                <p className="text-right">:</p>
                <p>{formData.person.jabatan}</p>
                
                <p>Unit Kerja</p>
                <p className="text-right">:</p>
                <p>{formData.person.unitKerja}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-[120px] font-bold">KEDUA</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1 text-justify">
            <p>Apabila dikemudian hari ternyata terdapat kekeliruan dalam keputusan ini, akan diadakan perbaikan dan perhitungan kembali sebagaimana mestinya.</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-[120px] font-bold">KETIGA</div>
          <div className="w-[20px] text-center">:</div>
          <div className="flex-1 text-justify">
            <p>Asli Keputusan ini diberikan kepada Pegawai Negeri Sipil yang bersangkutan, untuk diketahui dan dipergunakan sebagaimana mestinya.</p>
          </div>
        </div>
      </div>

      <SignatureSection
        getCurrentDate={getCurrentDate}
        useTTE={formData.useTTE}
        anchorSymbol={getAnchorSymbol()}
        signatureName={formData.signatureName}
      />

      <div className="mt-8">
        <p>Tembusan:</p>
        <ol className="list-decimal ml-8">
          <li>Menteri Agama Jakarta;</li>
          <li>Kepala Badan Kepegawaian Negara Jakarta;</li>
          <li>Sekretaris Jenderal u.p Kepala Biro SDM Kementerian Agama Jakarta;</li>
          <li>Kepala Wilayah Kementerian Agama Provinsi;</li>
          <li>Pejabat Pembuat Komitmen;</li>
          <li>Pejabat lain yang dianggap perlu;</li>
          <li>Arsip.</li>
        </ol>
      </div>
    </div>
  );
};

export default SuratKeputusanContent;
