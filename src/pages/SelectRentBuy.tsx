import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Legacy entry; RTO applications use `/rto-program-explore` and `/rto-apply`. */
const SelectRentBuy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/rto-program-explore", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <p className="text-sm text-gray-500">Mengalihkan ke jelajahi program RTO…</p>
    </div>
  );
};

export default SelectRentBuy;
