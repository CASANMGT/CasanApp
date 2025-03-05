interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "w-8 h-8",
  color = "border-primary100",
}) => {
  return (
    <div
      className={`border-4 border-t-transparent ${color} rounded-full ${size} animate-spin`}
    />
  );
};

export default Spinner;
