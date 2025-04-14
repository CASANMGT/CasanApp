import { useNavigate } from "react-router-dom";
import { Container, Separator } from "../components";

const PrivacyPolice = () => {
  const navigate = useNavigate();

  return (
    <Container title="Kebijakan Privasi" onDismiss={() => navigate(-1)}>
      <div className="px-4 py-6 flex-1 flex-col overflow-auto scrollbar-none bg-white text-sm">
        <h1 className="text-xl font-semibold mb-3">Kebijakan Privasi Casan</h1>

        <p className="font-medium">Selamat datang di Casan!</p>
        <p className="mb-2">Privasi Anda adalah prioritas kami.</p>

        <p>
          Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
          menggunakan, dan melindungi informasi pribadi Anda saat menggunakan
          aplikasi Casan, layanan pengisian kendaraan listrik untuk mobil dan
          sepeda listrik.
        </p>

        <Separator className="mt-3 mb-6" />

        <div className="mb-6 text-black90">
          <h2 className="font-semibold text-base text-black100 mb-[14px]">
            1. Informasi yang Kami Kumpulkan
          </h2>

          <p className="mb-2">
            Saat Anda menggunakan Casan, kami dapat mengumpulkan beberapa
            informasi berikut:
          </p>

          <p className="text-black100 font-bold mb-2">
            Data Pribadi:{" "}
            <span className="font-normal text-black90">
              seperti nama, email, dan nomor telepon saat Anda mendaftar.
            </span>
          </p>

          <p className="text-black100 font-bold mb-2">
            Informasi Kendaraan:{" "}
            <span className="font-normal text-black90">
              jenis kendaraan, kapasitas baterai, dan preferensi pengisian.
            </span>
          </p>

          <p className="text-black100 font-bold mb-2">
            Data Lokasi:{" "}
            <span className="font-normal text-black90">
              untuk membantu Anda menemukan stasiun pengisian terdekat.
            </span>
          </p>

          <p className="text-black100 font-bold mb-2">
            Data Penggunaan:{" "}
            <span className="font-normal text-black90">
              termasuk riwayat pengisian, metode pembayaran, dan interaksi Anda
              di aplikasi.
            </span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            2. Bagaimana Kami Menggunakan Informasi Anda
          </h2>

          <p className="text-black90 text-sm mb-2">
            Informasi yang kami kumpulkan digunakan untuk:
          </p>

          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>
              Menyediakan layanan pengisian yang cepat, aman, dan tepat sasaran.
            </li>
            <li>
              Memberikan rekomendasi stasiun pengisian berdasarkan lokasi dan
              riwayat penggunaan Anda.
            </li>
            <li>
              Mengirim notifikasi penting seputar pengisian, promosi, atau
              pembaruan sistem.
            </li>
            <li>Meningkatkan kualitas dan performa aplikasi Casan.</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            3. Perlindungan Data
          </h2>

          <p className="text-black90 text-sm">
            Casan berkomitmen menjaga kerahasiaan data pengguna. Kami
            menggunakan sistem keamanan dan enkripsi untuk melindungi informasi
            dari akses tidak sah.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">4. Berbagi Data</h2>

          <p className="text-black90 text-sm">
            Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa
            persetujuan, kecuali untuk kebutuhan operasional layanan, hukum,
            atau mitra bisnis yang relevan.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">5. Hak Pengguna</h2>

          <p className="text-black90 text-sm mb-2">
            Pengguna memiliki hak untuk:
          </p>

          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>Mengakses dan memperbarui data pribadi.</li>
            <li>
              Meminta penghapusan data dengan menghubungi tim layanan pelanggan
              Casan.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            4. Penyimpanan Data
          </h2>

          <p className="text-black90 text-sm">
            Data disimpan selama pengguna masih aktif menggunakan layanan atau
            sesuai kebutuhan hukum yang berlaku.
          </p>
        </div>

        <Separator />
      </div>
    </Container>
  );
};

export default PrivacyPolice;
