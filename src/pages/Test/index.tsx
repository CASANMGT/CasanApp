import ChargeProgress from "./CircularProgress";
import App from "./CircularProgressV2";

const Test = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <ChargeProgress duration={300} totalKwh={3} /> */}
      <App duration={300} totalKwh={3}/>
    </div>
  );
};

export default Test;
