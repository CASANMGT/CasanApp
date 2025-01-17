interface SeparatorProps {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className }) => {
  return <div className={`h-px w-full bg-baseLightGray ${className}`} />;
};

export default Separator;
