import { useNavigate } from "react-router-dom";
import {
  IcInfoCircleGreen,
  IcSaveGreen,
  IcShareGreen2,
  IcSuccessGreen,
} from "../assets";
import { BetweenText, Button, Header, Separator } from "../components";
import { moments, rupiah } from "../helpers";

const SessionDetails = () => {
  const navigate = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = () => {
    alert("coming soon");
  };

  const onShare = () => {
    alert("coming soon");
  };

  const onSave = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header type="secondary" title="Detail Sesi" onDismiss={onDismiss} />

      <div className="flex-1 overflow-auto scrollbar-none px-4 pb-7">
        {/* ICON */}
        <div className="center flex-col gap-2 my-[28px]">
          <IcSuccessGreen />
          <span className="text-blackBold font-medium">Sesi Selesai</span>
        </div>

        {/* TOOL INFORMATION */}
        <div className="bg-white p-3 rounded-lg mb-4 drop-shadow">
          <div className="row gap-3 mb-3">
            <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
              <IcInfoCircleGreen />
            </div>

            <span className="text-blackBold font-medium">Informasi Alat</span>
          </div>

          <BetweenText
            type="medium-content"
            labelLeft="Lokasi"
            labelRight="Pasar Modern BSD City"
            className="bg-baseLightGray p-3 rounded-t"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Nomor Alat"
            labelRight="142335"
            className="p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Socket"
            labelRight="Socket 5"
            className="bg-baseLightGray p-3 rounded-b"
          />
        </div>

        {/* SESSION INFORMATION */}
        <div className="bg-white p-3 rounded-lg mb-4 drop-shadow">
          <div className="row gap-3 mb-3">
            <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
              <IcInfoCircleGreen />
            </div>

            <span className="text-blackBold font-medium">Informasi Sesi</span>
          </div>

          <BetweenText
            type="medium-content"
            labelLeft="ID Sesi"
            labelRight="112113"
            className="bg-baseLightGray p-3 rounded-t"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Waktu Mulai"
            labelRight="23 Des 12:00"
            className="p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Wwaktu Selesai"
            labelRight="23 DEs 15:23"
            className="bg-baseLightGray p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Durasi"
            labelRight="3 jam 23 menit"
            className="p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Maksimum Watt"
            labelRight="0-200W"
            className="bg-baseLightGray p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Tarif Pengecasan"
            labelRight={`Rp${rupiah(1800)}/jam`}
            className="p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Nominal Pengisian"
            labelRight={`Rp${rupiah(10000)}`}
            className="bg-baseLightGray p-3 rounded-b"
          />
        </div>

        {/* PAYMENT INFORMATION */}

        <div className="p-3 pb-6 bg-white rounded-lg drop-shadow">
          <p className="font-medium mb-2">Informasi Transaksi</p>

          <div className="text-black100/70 row gap-2">
            <p className="text-xs">{moments().format("DD MMMM YYYY")}</p>
            <p className="text-xs">{moments().format("HH:mm WIB")}</p>
            <p className="text-xs">ID1876546</p>
          </div>

          <Separator className="my-4 bg-black10" />

          <p className="text-xs text-black100/70 mb-2">Detail Transaksi</p>

          <BetweenText labelLeft="Metode Pembayaran" labelRight="Dana" />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Nominal Pengisian"
            labelRight={`Rp${rupiah(10000)}`}
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Biaya Transaksi"
            labelRight={`Rp${rupiah(1000)}`}
          />

          <Separator className="my-1.5 bg-black100" />
          <BetweenText
            labelLeft="Total Transaksi"
            labelRight={`Rp${rupiah(11000)}`}
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100"
          />
          <Separator className="mt-1.5 bg-black100" />

          <Separator className="my-6 bg-black10" />

          {/* SAVE OR SHARE */}
          <div className="between gap-4">
            <Button
              type="secondary"
              label="Bagikan Resi"
              iconRight={IcShareGreen2}
              onClick={onShare}
            />
            <Button
              type="secondary"
              label="Simpan Resi"
              iconRight={IcSaveGreen}
              onClick={onSave}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-white drop-shadow">
        <Button label="Pergi ke Riwayat" onClick={onNext} />
      </div>
    </div>
  );
};

export default SessionDetails;
