import { IcNoInternet } from "../../assets";

interface SignalProps {
  signalValue: number | undefined;
}

const Signal: React.FC<SignalProps> = ({ signalValue }) => {
  const getColorSignal = (position: number) => {
    let value = "";

    if (signalValue && signalValue >= 25) value = "bg-green";
    else if (signalValue && signalValue >= 17) {
      if (position <= 3) value = "bg-secondary100";
      else value = "bg-black30";
    } else if (signalValue && signalValue >= 9) {
      if (position === 1 || position === 2) value = "bg-red";
      else value = "bg-black30";
    } else {
      if (position === 1) value = "bg-red";
      else value = "bg-black30";
    }

    return value;
  };

  if (!signalValue) return <IcNoInternet />;

  return (
    <div className="flex items-end space-x-[1.5px]">
      <div className={`w-[3px] h-[2px] ${getColorSignal(1)}`}></div>
      <div className={`w-[3px] h-[5px] ${getColorSignal(2)}`}></div>
      <div className={`w-[3px] h-[9px] ${getColorSignal(3)}`}></div>
      <div className={`w-[3px] h-[13px] ${getColorSignal(4)}`}></div>
    </div>
  );
};

export default Signal;
