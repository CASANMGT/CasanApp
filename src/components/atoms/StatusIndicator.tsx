import { IcStandBy } from "../../assets";
import { formatTime } from "../../helpers";

interface StatusIndicatorProps {
  className?: string;
  type: number;
  duration: number;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  duration,
  className,
}) => {
  const classNameAnimation: string = `absolute -left-[30px] -top-[30px] w-[280px] h-[280px] rounded-full ${
    type === 5
      ? "animate-soundWave bg-primary100"
      : "animate-charging bg-secondary100"
  }`;

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
            <p className="text-black70 font-semibold mb-2">Sisa Durasi</p>
            <p className="text-[33px] font-semibold">{formatTime(duration)}</p>

            <div className="flex justify-center">
              <div className="rounded-lg bg-secondary10 h-6 px-2.5 space-x-2 flex items-center">
                <IcStandBy />
                <span className="text-xs text-[#E8A126]">Stand By</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
