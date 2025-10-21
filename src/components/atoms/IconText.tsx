interface Props {
    className?:string
  icon: any;
  label: string;
}

const IconText: React.FC<Props> = ({ className,icon, label }) => {
  const Icon = icon;
  return (
    <div className={`row gap-2 ${className}`}>
      <div className="bg-primary10 rounded-full w-[30px] h-[30px] center">
        <Icon size={14} className="text-primary100" />
      </div>
      <span className="text-blackBold font-medium">{label}</span>
    </div>
  );
};

export default IconText;
