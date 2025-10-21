interface Props {
  percent: number;
}

const ProgressBar2: React.FC<Props> = ({ percent }) => {
  return (
    <div className="flex-1 h-3 bg-black10 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary100 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar2;
