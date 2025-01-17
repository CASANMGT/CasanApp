interface LabelProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Label: React.FC<LabelProps> = ({ label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-full h-6 px-[14px] text-xs font-medium center cursor-pointer ${
        isActive ? "bg-primary100 text-white" : "bg-white text-primary100"
      }`}
    >
      {label}
    </div>
  );
};

export default Label;
