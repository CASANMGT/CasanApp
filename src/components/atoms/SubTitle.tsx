interface SubTitleProps {
  className?: string;
  icon: any;
  label: string;
}

const SubTitle: React.FC<SubTitleProps> = ({ className, icon, label }) => {
  const Icon = icon;

  if (!icon) return;
  return (
    <div className={`row gap-3 ${className}`}>
      <div className="w-[30px] h-[30px] rounded-full bg-primary10 center">
        <Icon  className="text-primary100"/>
      </div>

      <span className="text-blackBold font-medium">{label}</span>
    </div>
  );
};

export default SubTitle;
