import { useEffect } from "react";
import { IcInfoCircleBlack } from "../assets";
import { useAlert } from "../context/AlertContext";

const Test = () => {
  const { showAlert } = useAlert();

  useEffect(() => {
    showAlert({
      title: "Pilih Socket Terlebih Dahulu",
      body: "Silakan pilih Socket sesuai yang akan anda gunakan untuk pengisian",
    });
  }, []);

  return (
    <div>
      <IcInfoCircleBlack />
    </div>
  );
};

export default Test;
