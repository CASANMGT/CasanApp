interface LoadingPageProps {
  children: any;
  loading: boolean;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <div className="center h-full w-full bg-white">Loading...</div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingPage;
