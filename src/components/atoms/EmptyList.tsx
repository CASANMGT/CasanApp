interface EmptyListProps {
  description: string;
}

const EmptyList: React.FC<EmptyListProps> = ({ description }) => {
  return <div className="text-black50 flex items-center justify-center p-6">{description}</div>;
};

export default EmptyList;
