import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IcSuccess } from "../assets";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [isNext, setIsNext] = useState(false);

  useEffect(() => {
    if (!id) navigate("home", { replace: true });

    setTimeout(() => {
      onNext();
    }, 3000);
  }, []);

  const onNext = () => {
    if (!isNext) {
      setIsNext(true);
      if (state?.type === "rto") navigate(-1);
      else
        navigate(`/charging/${id}`, {
          replace: true,
          state: { isGoOrder: true },
        });
    }
  };

  return (
    <div
      onClick={onNext}
      className="container-screen !bg-[#10832B] center-y p-9 cursor-pointer"
    >
      <div className="center-y flex-1">
        <IcSuccess />

        <span className="text-xl font-bold text-white  mt-2">
          Payment Success
        </span>
      </div>

      <p className="text-white ">Tap anywhere to dismiss</p>
    </div>
  );
};

export default PaymentSuccess;
