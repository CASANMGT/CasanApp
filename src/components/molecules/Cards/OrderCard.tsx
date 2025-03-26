import { capitalize } from "lodash";
import { IcFuel, ILNoImage } from "../../../assets";
import { Session } from "../../../common";
import { getIconPaymentMethod, moments, rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface OrderCardProps {
  position: number;
  data: Session;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ position, data, onClick }) => {
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
        value = "Sedang Mengisi";
        break;

      case 6:
        value = "Selesai";
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

  return (
    <div
      onClick={onClick}
      className={`bg-white p-3 mx-4 mb-3 rounded-lg drop-shadow cursor-pointer ${
        position === 0 && "mt-6"
      }`}
    >
      <div className="row gap-3">
        <img
          src={data?.ChargingStation?.Image || ILNoImage}
          alt="location 1"
          className="w-[50px] h-[50px] rounded-md"
        />

        <div className="flex flex-col justify-between">
          <p className="font-medium ">
            {data?.ChargingStation?.Name || "-"}
          </p>
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
              status === 6 ? "bg-black10" : "bg-primary10"
            }`}
          >
            <IcFuel
              className={status === 6 ? "text-black70" : "text-primary100"}
            />
          </div>

          <div>
            <p
              className={`font-medium ${
                status === 5 ? "text-[#129030]" : "text-black100"
              }`}
            >
              {getLabelStatus()}
            </p>

            {status !== 2 && (
              <>
                {status === 6 ? (
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
                    ) : (
                      "-"
                    )}
                  </p>
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
  );
};

export default OrderCard;
