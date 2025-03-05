import Spinner from "./Spinner";

interface LoadingPageProps {
  children: any;
  loading: boolean;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <div className="center h-full w-full flex flex-col p-6">
          <Spinner size="w-8 h-8" color="border-white" />
          <h1 className="text-base mt-4 font-medium text-white">Loading...</h1>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingPage;
