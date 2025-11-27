import { ILNotFound } from "../assets";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center container-screen">
      <div className="mb-6">
        <ILNotFound />
      </div>
      <h2 className="text-base font-semibold">Halaman Tidak Ditemukan</h2>
      <p>Maaf halaman yang anda cari tidak ditemukan</p>
    </div>
  );
};

export default NotFound;
