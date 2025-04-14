import { useNavigate } from "react-router-dom";
import { Container, Separator } from "../components";

const TermCondition = () => {
  const navigate = useNavigate();

  return (
    <Container title="Syarat & Ketentuan" onDismiss={() => navigate(-1)}>
      <div className="px-4 py-6 flex-1 flex-col overflow-auto scrollbar-none bg-white">
        <h1 className="text-xl font-semibold mb-4">
          Syarat dan Ketentuan Penggunaan Casan
        </h1>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">1. Pendahuluan</h2>
          <p className="text-black90 text-sm">
            Syarat dan Ketentuan ini mengatur penggunaan layanan Casan, yakni
            Stasiun Pengisian Kendaraan Listrik Umum (SPKLU) roda dua yang
            tersedia melalui aplikasi dan lokasi fisik.
          </p>
          <p className="text-black90 text-sm">
            Dengan menggunakan layanan Casan, Anda dianggap telah membaca,
            memahami, dan menyetujui syarat dan ketentuan ini.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            2. Layanan Casan
          </h2>
          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>
              Casan hanya digunakan sebagai fasilitas pengisian daya untuk motor
              dan sepeda listrik.
            </li>
            <li>
              Pengguna dapat menemukan dan menggunakan titik pengisian daya
              melalui aplikasi Casan atau lokasi mitra yang bekerja sama.
            </li>
            <li>
              Casan mendukung soket pengisian daya universal semua jenis motor
              dan sepeda listrik.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            3. Ketentuan Penggunaan
          </h2>
          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>
              Pengguna bertanggung jawab atas keselamatan kendaraan dan
              peralatan mereka saat menggunakan layanan Casan.
            </li>
            <li>
              Dilarang menggunakan fasilitas Casan untuk tujuan selain pengisian
              daya kendaraan listrik.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">4. Pembayaran</h2>
          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>
              Setiap layanan pengisian daya dikenakan biaya sesuai tarif yang
              berlaku dan tercantum di aplikasi.
            </li>
            <li>
              Pembayaran dapat dilakukan melalui sistem pembayaran digital yang
              terintegrasi di aplikasi.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            5. Perubahan dan Penghentian Layanan
          </h2>
          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>
              Casan berhak untuk mengubah atau menghentikan sebagian atau
              seluruh layanan sewaktu-waktu dengan atau tanpa pemberitahuan.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-base mb-[14px]">
            6. Tanggung Jawab
          </h2>
          <ul className="list-disc pl-5 text-black90 text-sm">
            <li>
              Casan tidak bertanggung jawab atas kerusakan kendaraan akibat
              penggunaan yang tidak sesuai atau gangguan di luar kendali
              (listrik padam, bencana, dll).
            </li>
            <li>
              Casan tidak bertanggung jawab atas kehilangan barang pribadi
              pengguna selama berada di lokasi pengisian.
            </li>
          </ul>
        </div>

        <Separator />
      </div>
    </Container>
  );
};

export default TermCondition;
