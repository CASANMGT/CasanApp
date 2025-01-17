interface SignalProps {
  type: "full" | "low" | "middle";
}

const Signal: React.FC<SignalProps> = ({ type }) => {
  const getColorSignal = (position: number) => {
    let value = "";
    if (type === "low") {
      if (position === 1 || position === 2) value = "bg-red";
      else value = "bg-black30";
    } else if (type === "middle") {
      if (position <= 3) value = "bg-secondary100";
      else value = "bg-black30";
    } else if (type === "full") {
      value = "bg-green";
    }

    return value;
  };
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
