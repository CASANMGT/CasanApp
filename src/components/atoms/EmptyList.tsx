interface EmptyListProps {
  image: any;
  title: string;
  description: string;
}

const EmptyList: React.FC<EmptyListProps> = ({ image, title, description }) => {
  const isShowImage = image ? true : false;

  return (
    <div className="flex flex-col items-center justify-center p-10">
      {isShowImage && <img src={image} className="w-[247px] h-auto mb-8" />}

      <span className="text-base font-semibold mb-1">{title}</span>
      <p className="text-black100/80"> {description}</p>
    </div>
  );
};

export default EmptyList;
