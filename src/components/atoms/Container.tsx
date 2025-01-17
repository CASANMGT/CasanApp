import Header from "./Header";

interface ContainerProps {
  title: string;
  children: any;
  onDismiss: () => void;
}

const Container: React.FC<ContainerProps> = ({
  title,
  onDismiss,
  children,
}) => {
  return (
    <div className="container-screen flex flex-col justify-between">
      <Header title={title} onDismiss={onDismiss} />

      {children}
    </div>
  );
};

export default Container;
