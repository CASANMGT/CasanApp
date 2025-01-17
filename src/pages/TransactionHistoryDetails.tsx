import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcSaveGreen, IcShareGreen2 } from "../assets";
import { BetweenText, Button, Header, Separator } from "../components";
import { moments, rupiah } from "../helpers";

const TransactionHistoryDetails = () => {
  const navigate: NavigateFunction = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  const onShare = () => {
    alert("coming soon");
  };

  const onSave = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 py-[14px] px-4">
      <Header type="secondary" title="Detail Transaksi" onDismiss={onDismiss} />

      <div className="p-3 pb-6 bg-white rounded-lg mt-[28px] drop-shadow">
        <p className="font-medium mb-2">Informasi Transaksi</p>
        <div className="text-black100/70 row gap-2">
          <p className="text-xs">{moments().format("DD MMMM YYYY")}</p>
          <p className="text-xs">{moments().format("HH:mm WIB")}</p>
          <p className="text-xs">ID1876546</p>
        </div>

        <Separator className="my-4 bg-black10" />

        <p className="text-xs text-black100/70  mb-2">Detail Transaksi</p>

        <BetweenText labelLeft="Tipe Transaksi" labelRight="Pengisisan Daya" />

        <Separator className="my-1.5 bg-black10" />
        <BetweenText labelLeft="Referensi Sesi ID" labelRight="1432" />

        <Separator className="my-1.5 bg-black10" />
        <BetweenText
          labelLeft="Metode Pembayaran"
          labelRight="Saldo CAZZ, Dana"
        />

        <Separator className="my-1.5 bg-black10" />
        <BetweenText
          labelLeft="Total Transaksi"
          labelRight={`Rp${rupiah(1000)}`}
        />

        <Separator className="my-1.5 bg-black10" />
        <BetweenText
          labelLeft="Pembayaran Cazz Wallet"
          labelRight={`Rp${rupiah(5000)}`}
        />

        <Separator className="my-1.5 bg-black10" />
        <BetweenText
          labelLeft="Pengembalian Dana"
          labelRight={`Rp${rupiah(2000)}`}
        />

        <Separator className="my-6 bg-black10" />

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
  );
};

export default TransactionHistoryDetails;
