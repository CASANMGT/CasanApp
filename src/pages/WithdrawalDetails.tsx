import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WithdrawList } from "../common";
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

  const [data] = useState<WithdrawList>(location?.state?.data);

  const status: number = 3;
  const IconPayment: any = getIconPaymentMethod(data?.BankAccount?.Code);
  const labelPayment: string = getLabelPaymentMethod(data?.BankAccount?.Code);
  const formatted = getFormattedByStatus(data?.Status);

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
                {`Rp${rupiah(data?.Amount + data?.Fee)}`}
              </span>
            </div>

            <div
              className={`py-1 px-[14px] rounded-full border ${formatted?.bgColor}`}
            >
              <p className={`text-xs font-medium ${formatted?.textColor}`}>
                {formatted?.label}
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
            labelRight={data?.BankAccount?.Name}
            classNameLabelRight="font-semibold"
          />

          <Separator className="bg-[#e4e4e4] my-4" />

          <span className="text-blackBold font-medium">
            Informasi Penarikan
          </span>

          <BetweenText
            labelLeft="ID Penarikan"
            labelRight={data?.ID}
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Tanggal Pengajuan"
            labelRight={moments(data?.CreatedAt).format("DD MMMM YYYY, HH:mm")}
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Tanggal Diproses"
            labelRight={
              data?.Status === 1
                ? "-"
                : moments(data?.UpdatedAt).format("DD MMMM YYYY, HH:mm")
            }
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Nominal Penarikan"
            labelRight={`Rp${rupiah(data?.Amount)}`}
            classNameLabelLeft="text-blackBold"
            className="py-2 border-b border-b-black10"
          />
          <BetweenText
            labelLeft="Biaya Penarikan"
            labelRight={`${data?.Fee > 0 ? "-" : ""}Rp${rupiah(data?.Fee)}`}
            classNameLabelLeft="text-blackBold"
            className="py-2 border-b border-b-black70"
          />
          <BetweenText
            labelLeft="Total Akhir"
            labelRight={`Rp${rupiah(data?.Amount + data?.Fee)}`}
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

const getFormattedByStatus = (status: number) => {
  let label: string = "";
  let bgColor: string = "";
  let textColor: string = "";

  switch (status) {
    case 1:
      label = "Penarikan Diproses";
      bgColor = "bg-primary10 border-primary50";
      textColor = "text-primary100";
      break;

    case 2:
      label = "Penarikan Disetujui";
      bgColor = "bg-lightGreen border-strokeGreen";
      textColor = "text-green";
      break;

    case 3:
      label = "Penarikan Ditolak";
      bgColor = "bg-lightRed border-strokeRed";
      textColor = "text-red";
      break;

    default:
      break;
  }

  return {
    label,
    bgColor,
    textColor,
  };
};

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
