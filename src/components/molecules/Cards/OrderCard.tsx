import { capitalize } from "lodash";
import { FaChevronRight } from "react-icons/fa6";
import { HiOutlineTicket } from "react-icons/hi2";
import { IcFuel, ILNoImage } from "../../../assets";
import { Session, VoucherUsage } from "../../../common";
import {
  formatDuration,
  getIconPaymentMethod,
  moments,
  rupiah,
} from "../../../helpers";
import { Separator } from "../../atoms";

interface OrderCardProps {
  position: number;
  data: Session;
  onClick: () => void;
  onClaim?: (id: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  position,
  data,
  onClick,
  onClaim,
}) => {
  const status: number = data?.Status;

  const getLabelStatus = () => {
    let value: string;

    switch (status) {
      case 1:
        value = "Menunggu Pembayaran";
        break;

      case 2:
        value = "Menunggu Terhubung";
        break;

      case 5:
        if (data?.MaxWatt > 1) value = "Sedang Mengisi";
        else value = "Persiapan";
        break;

      case 6:
        value = "Selesai";
        break;

      case 7:
        value = "Expired";
        break;

      case 8:
        value = "Dibatalkan";
        break;

      default:
        value = "";
        break;
    }

    return value;
  };

  const Icon = getIconPaymentMethod(
    data?.Transaction?.PaymentMethod.split("_")[0].toLocaleLowerCase()
  );

  let diff: string = "";
  let isShowClaim = false;

  if (status === 5 && data?.MaxWatt > 1) {
    diff = formatDuration(
      moments(data?.StopChargingTime).diff(moments(), "second")
    );
  }

  const isDark: boolean = status === 6 || status === 7 || status === 8;
  let dataVoucher: VoucherUsage | undefined = undefined;

  if (data?.VoucherUsages && data?.VoucherUsages.length)
    dataVoucher = data?.VoucherUsages[0];

  if (
    dataVoucher?.Status === 2 &&
    dataVoucher?.VoucherType == 2 &&
    (data?.Status === 5 || data?.Status === 6) &&
    data?.MaxWatt > 10
  ) {
    isShowClaim = true;
  }

  return (
    <div
      className={`bg-white p-3 mx-4 mb-3 rounded-lg drop-shadow cursor-pointer ${
        position === 0 && "mt-6"
      }`}
    >
      <div onClick={onClick}>
        <div className="row gap-3">
          <img
            src={data?.ChargingStation?.Image || ILNoImage}
            alt="location 1"
            className="w-[50px] h-[50px] rounded-md"
          />

          <div className="flex flex-col justify-between">
            <p className="font-medium ">{data?.ChargingStation?.Name || "-"}</p>
            <p className="text-2-line text-xs text-black90">
              {data?.ChargingStation?.Location?.Address || "-"}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="between-x">
          <div className="row gap-2">
            <div
              className={`w-9 h-9 center rounded-full ${
                isDark ? "bg-black10" : "bg-primary10"
              }`}
            >
              <IcFuel className={isDark ? "text-black70" : "text-primary100"} />
            </div>

            <div>
              <p
                className={`font-medium ${
                  status === 5 && data?.MaxWatt > 1
                    ? "text-[#129030]"
                    : status === 7 || status === 8
                    ? "text-red"
                    : "text-black100"
                }`}
              >
                {getLabelStatus()}
              </p>

              {status !== 1 && status !== 2 && (
                <>
                  {isDark ? (
                    <p className="text-black70">
                      {data?.StartChargingTime ? (
                        <>
                          {`${moments(data?.StartChargingTime).format(
                            "HH:mm"
                          )} - `}
                          <span className="text-black100">
                            {moments(data?.StopChargingTime).format("HH:mm")}
                          </span>
                        </>
                      ) : data?.UpdatedAt ? (
                        moments(data?.UpdatedAt).format("HH:mm")
                      ) : (
                        "-"
                      )}
                    </p>
                  ) : status === 5 ? (
                    <div>
                      <p className="text-xs text-black50">
                        {status === 5 && data?.MaxWatt > 1
                          ? `Tersisa: `
                          : "Sistem sedang menyiapkan"}
                        {status === 5 && data?.MaxWatt > 1 && (
                          <span className="text-black100 text-xs">{diff}</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="row gap-1">
                      <Icon className="w-[14px] h-auto" />

                      <p className="text-xs font-medium">
                        {capitalize(
                          (data?.Transaction?.PaymentMethod || "")
                            .replace("_TU", "")
                            .toLocaleLowerCase()
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <span className="font-semibold">
            Rp{rupiah(data?.Transaction?.Amount)}
          </span>
        </div>
      </div>

      {isShowClaim && dataVoucher && (
        <>
          <Separator className="my-4" />
          <div
            onClick={() => onClaim && onClaim(dataVoucher?.ID)}
            className="between-x gap-2 px-3"
          >
            <HiOutlineTicket size={20} className="text-primary100" />

            <span className="flex-1 font-medium">
              Klaim Voucher {dataVoucher?.VoucherDetails?.Description}
            </span>

            <FaChevronRight size={16} className="text-black100" />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderCard;
