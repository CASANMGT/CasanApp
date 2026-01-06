import { IcBackBlack, ILNotFound } from "../assets";

interface Props {
  onDismiss?: () => void;
}

const NotFound: React.FC<Props> = ({ onDismiss }) => {
  return (
    <div className="relative flex flex-col items-center justify-center container-screen">
      {onDismiss && (
        <div
          onClick={onDismiss}
          className="absolute top-4 left-4 bg-black10 w-10 h-10 rounded-full center cursor-pointer"
        >
          <IcBackBlack />
        </div>
      )}

      <div className="mb-6">
        <ILNotFound />
      </div>
      <h2 className="text-base font-semibold">Halaman Tidak Ditemukan</h2>
      <p>Maaf halaman yang anda cari tidak ditemukan</p>
    </div>
  );
};

export default NotFound;
