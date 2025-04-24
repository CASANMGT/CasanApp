import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IcSuccessGreen } from "../assets";
import { Balance } from "../common";
import {
  BetweenText,
  Button,
  Header,
  LoadingPage,
  Separator,
} from "../components";
import { moments, rupiah } from "../helpers";

const WithdrawalDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data] = useState<Balance>(location?.state?.data);

  const onNext = () => {
    let nextPage: string;

    switch (data?.Status) {
      case 1:
        nextPage = "transaction-history-details";
        break;

      case 2:
        nextPage = "withdraw-details";
        break;

      case 3:
      case 4:
        nextPage = "session-details";
        break;

      default:
        nextPage = "";
        break;
    }

    navigate(`/${nextPage}/${data?.SeasonID || 0}`);
  };

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
            {getLabelType(data?.Status)}
          </span>
        </div>

        <div className="relative p-3 pb-6 bg-white rounded-lg mt-[28px] drop-shadow">
          <p className="font-medium mb-2">Informasi Transaksi</p>

          <div className="text-black100/70 row gap-2">
            <p className="text-xs">
              {moments(data?.CreatedAt).format("DD MMMM YYYY")}
            </p>
            <p className="text-xs">
              {moments(data?.CreatedAt).format("HH:mm WIB")}
            </p>
            <p className="text-xs">{`ID${data?.ID}`}</p>
          </div>

          <Separator className="my-4 bg-black10" />

          <p className="text-xs text-black100/70  mb-2">Detail Transaksi</p>

          <BetweenText
            type="medium-content"
            labelLeft="Tipe Transaksi"
            labelRight={getLabelType(data?.Status, true)}
            classNameLabelRight="font-medium text-black100"
            className="mb-2"
          />

          <BetweenText
            labelLeft="Nominal Casan Wallet"
            labelRight={`Rp${rupiah(data?.Amount)}`}
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

export default WithdrawalDetails;

const getLabelType = (status: number, isType?: boolean) => {
  let value: string;

  switch (status) {
    case 1:
      value = isType ? "Top-Up" : "Traksaksi Selesai";
      break;

    case 2:
      value = isType ? "Refund" : "Refund Selesai";
      break;

    case 3:
      value = isType ? "Bayar Sesi" : "Sesi Selesai";
      break;

    case 4:
      value = "Penarikan Selesai";
      break;

    default:
      value = "";
      break;
  }

  return value;
};
