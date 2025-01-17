interface StatusIndicatorProps {
  className?: string;
  type: "stang-by" | "charging" | string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  className,
}) => {
  const classNameAnimation: string = `absolute -left-[30px] -top-[30px] w-[280px] h-[280px] rounded-full ${
    type === "charging"
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
            <p className="text-black70 font-semibold mb-2">Status</p>
            <p className="text-[33px] font-semibold">
              {type === "charging" ? "Charging" : "Stand By"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
