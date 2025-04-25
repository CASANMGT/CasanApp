import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Balance } from "../common";
import { BetweenText, Header, LoadingPage, Separator } from "../components";
import {
  getIconPaymentMethod,
  getLabelPaymentMethod,
  moments,
  rupiah,
} from "../helpers";

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

  const status:number = 3
  const IconPayment: any = getIconPaymentMethod("dana");
  const labelPayment: string = getLabelPaymentMethod("dana");

  return (
    <div className="container-screen bg-white flex flex-col">
      <Header title="Detail Penarikan" onDismiss={() => navigate(-1)} />

      <LoadingPage loading={false}>
        <div className="px-4 py-6 bg-white flex-1">
          <div className="between-x">
            <div className="flex flex-col">
              <span className="text-blackBold font-medium ">
                Nominal Penarikan
              </span>

              <span className="text-base font-semibold text-primary100">
                {`Rp${rupiah(99999)}`}
              </span>
            </div>

            <div className={`py-1 px-[14px] rounded-full border ${getColorStatus(status).bgColor}`}>
              <p className={`text-xs font-medium ${getColorStatus(status).textColor}`}>
                {getLabelStatus(status)}
              </p>
            </div>
          </div>

          <Separator className="my-2.5" />

          <BetweenText
            labelLeft="Bank Tujuan"
            labelRight=""
            content={
              <div className="row">
                <IconPayment className="w-6 h-6" />
                <span className="ml-1 text-base font-medium">
                  {labelPayment}
                </span>
              </div>
            }
            className="mb-2"
          />

          <BetweenText
            labelLeft="Nama Rekening"
            labelRight={"Tedy"}
            classNameLabelRight="font-semibold"
          />

          <Separator className="bg-[#e4e4e4] my-4" />

          <span className="text-blackBold font-medium">
            Informasi Penarikan
          </span>

          <BetweenText
            labelLeft="ID Penarikan"
            labelRight={1432}
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Tanggal Pengajuan"
            labelRight={moments().format("DD MMMM YYYY, HH:mm")}
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Tanggal Diproses"
            labelRight={"-"}
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Nominal Penarikan"
            labelRight={`Rp${rupiah(460000)}`}
            classNameLabelLeft="text-blackBold"
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Biaya Penarikan"
            labelRight={`-Rp${rupiah(10000)}`}
            classNameLabelLeft="text-blackBold"
            className="py-2 border-b border-b-black70"
          />
          <BetweenText
            labelLeft="Total Akhir"
            labelRight={`Rp${rupiah(450000)}`}
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100 font-semibold"
            className="py-2 border-b border-b-black70"
          />
        </div>
      </LoadingPage>
    </div>
  );
};

export default WithdrawalDetails;

const getColorStatus = (type: number) => {
  let bgColor: string;
  let textColor: string;

  switch (type) {
    case 1:
      bgColor = "bg-primary10 border-primary50";
      textColor = "text-primary100";
      break;

    case 2:
      bgColor = "bg-lightGreen border-strokeGreen";
      textColor = "text-green";
      break;

    case 3:
      bgColor = "bg-lightRed border-strokeRed";
      textColor = "text-red";
      break;

    default:
      bgColor = "";
      textColor = "";
      break;
  }

  return {
    bgColor,
    textColor,
  };
};

const getLabelStatus = (type: number) => {
  let value: string;

  switch (type) {
    case 1:
      value = "Penarikan Diproses";
      break;

    case 2:
      value = "Penarikan Disetujui";
      break;

    case 3:
      value = "Penarikan Ditolak";
      break;

    default:
      value = "";
      break;
  }

  return value;
};
