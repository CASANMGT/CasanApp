const apiUrl = import.meta.env.VITE_API_URL;

const Test = () => {
  return (
    <div className="container-screen center flex-col">
      <p>Test</p>
      <p>{apiUrl}</p>
    </div>
  );
};

export default Test;
