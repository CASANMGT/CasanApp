interface LoadingModalProps {}

const LoadingModal: React.FC<LoadingModalProps> = () => {
  return (
    // <div className="container-screen relative">
      <div className="absolute bottom-0 right-0 left-0 top-0 bg-black/50 center">
        <h1 className="text-white text-xl font-semibold">Loading...</h1>
      </div>
    // </div>
  );
};

export default LoadingModal;
