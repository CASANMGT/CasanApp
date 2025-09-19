import { IcBattery, IcCashBlack, IcStandBy } from "../../assets";
import { formatTime } from "../../helpers";
import CountdownTimer from "./CountdownTimer";

interface StatusIndicatorProps {
  className?: string;
  data: Session | null;
  type: number;
  duration: number;
  onFinish: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  data,
  duration,
  className,
  onFinish,
}) => {
  const isCharging: boolean =
    type === 5 || type === 6 || type !== 2 ? true : false;
  const classNameAnimation: string = `absolute -left-[30px] -top-[30px] w-[280px] h-[280px] rounded-full ${
    isCharging
      ? "animate-soundWave bg-primary100"
      : "animate-charging bg-secondary100"
  }`;
  const maxWatt: number = data?.MaxWatt || 0;
  const port: number = data?.Socket?.Port || 0;
  let totalKwh: number = 0;
  let chargingPercentage: number = 0;
  let priceType = data?.PriceType;

  if (priceType === 2) {
    totalKwh = Number(
      ((data?.PaidKWH || 0) - (data?.TotalKwhUsed || 0)).toFixed(2)
    );
    chargingPercentage = Number(
      (((data?.TotalKwhUsed || 0) / (data?.PaidKWH || 0)) * 100).toFixed(0)
    );
  }

  return (
    <div className={`center h-[288px] w-full ${className}`}>
      {/* Animated Sound Wave Circles */}
      <div className="relative">
        <div className={`${classNameAnimation} `} />
        {/* <div className={`${classNameAnimation} opacity-40 delay-200`} />
        <div className={`${classNameAnimation} opacity-70 delay-200`} /> */}

        {/* Inner Static Circle */}
        <div className="relative flex items-center justify-center w-[220px] h-[220px] bg-white rounded-full shadow-md">
          <div className="text-center">
            <p className="text-black70 font-semibold mb-2">
              {priceType === 2 ? "Sisa Energi" : "Sisa Durasi"}
            </p>
            {type === 5 && maxWatt > 1 ? (
              priceType === 2 ? (
                <p className="text-[34px] font-semibold">{`${totalKwh}kWh`}</p>
              ) : (
                <CountdownTimer
                  initialSeconds={duration}
                  onFinish={onFinish}
                  className="text-[34px] font-semibold"
                />
              )
            ) : (
              <p className="text-[34px] font-semibold">
                {type === 2
                  ? priceType === 2
                    ? `${totalKwh}kWh`
                    : formatTime(duration)
                  : "Persiapan..."}
              </p>
            )}

            <div className="flex justify-center">
              <div
                className={`rounded-lg h-6 px-2.5 space-x-2 flex items-center ${
                  isCharging ? "bg-primary10" : "bg-secondary10"
                }`}
              >
                {isCharging && <IcBattery />}

                <span
                  className={`text-xs font-medium ${
                    isCharging ? "text-primary100" : "text-[#E8A126]"
                  }`}
                >
                  {isCharging
                    ? `Charging ${chargingPercentage}%`
                    : `Socket ${port}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
