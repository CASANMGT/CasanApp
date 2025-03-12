import { capitalize } from "lodash";
import { IcFuelGreen, ILNoImage } from "../../../assets";
import { Session } from "../../../common";
import { getIconPaymentMethod, rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface OrderCardProps {
  position: number;
  data: Session;
}

const OrderCard: React.FC<OrderCardProps> = ({ position, data }) => {
  const status: number = 5; //data?.Status

  const getLabelStatus = () => {
    let value: string;

    switch (status) {
      case 1:
        value = "Menunggu Pembayaran";
        break;

      case 5:
        value = "Sedang Mengisi";
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
            {data?.ChargingStation?.Location?.Mark || "-"}
          </p>
          <p className="text-2-line text-xs text-black90">
            {data?.ChargingStation?.Location?.Name || "-"}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="between-x">
        <div className="row gap-2">
          <div className="w-9 h-9 center rounded-full bg-primary100/10">
            <IcFuelGreen />
          </div>

          <div>
            <p
              className={`font-medium ${
                status === 5 ? "text-[#129030]" : "text-black100"
              }`}
            >
              {getLabelStatus()}
            </p>
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
          </div>
        </div>

        <span className="font-semibold">
          Rp{rupiah(data?.Transaction?.DueAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
