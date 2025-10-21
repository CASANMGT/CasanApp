interface Props {
  children: any;
  className?: string;
}

const Container: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={`bg-white shadow px-4 py-3 rounded-xl ${className}`}>
      {children}
    </div>
  );
};

export default Container;
