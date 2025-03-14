import { useNavigate } from "react-router-dom";
import { IcSuccessGreen } from "../assets";
import {
    BetweenText,
    Button,
    Header,
    LoadingPage,
    Separator,
} from "../components";
import { moments, rupiah } from "../helpers";

const BalanceHistoryDetails = () => {
  const navigate = useNavigate();

  const onNext = () => {};

  return (
    <div className="background-1 py-[14px] px-4">
      <Header
        type="secondary"
        title="Detail Saldo"
        onDismiss={() => navigate(-1)}
      />

      <LoadingPage loading={false}>
        <div className="flex flex-col gap-2 items-center justify-center my-7 ">
          <IcSuccessGreen />

          <span className="font-medium text-blackBold">
            {"Transacksi Selesai"}
          </span>
        </div>

        <div className="relative p-3 pb-6 bg-white rounded-lg mt-[28px] drop-shadow">
          <p className="font-medium mb-2">Informasi Transaksi</p>

          <div className="text-black100/70 row gap-2">
            <p className="text-xs">{moments().format("DD MMMM YYYY")}</p>
            <p className="text-xs">{moments().format("HH:mm WIB")}</p>
            <p className="text-xs">{`ID${999}`}</p>
          </div>

          <Separator className="my-4 bg-black10" />

          <p className="text-xs text-black100/70  mb-2">Detail Transaksi</p>

          <BetweenText
            type="medium-content"
            labelLeft="Tipe Transaksi"
            labelRight="Top-up"
            classNameLabelRight="font-medium text-black100"
            className="mb-2"
          />

          <BetweenText
            labelLeft="Nominal Casan Wallet"
            labelRight={`Rp${rupiah(99999)}`}
            className="border-y border-black100 py-2"
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100 font-medium"
          />

          <Separator className="my-6 bg-black10" />

          <Button type="secondary" label="Lihat Transaksi" onClick={onNext} />
        </div>
      </LoadingPage>
    </div>
  );
};

export default BalanceHistoryDetails;
