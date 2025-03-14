interface CardProps {
  children: any;
  className?: string;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`bg-white p-3 rounded-lg shadow ${ className }`}>
      {children}
    </div>
  );
};

export default Card;
