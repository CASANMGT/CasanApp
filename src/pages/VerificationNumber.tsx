import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Header, InputCode, Separator } from "../components";
import { formatPhoneNumber } from "../helpers/formatter";

const VerificationNumber = () => {
  const phone: string = "081208120812";
  const navigate: NavigateFunction = useNavigate();

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [labelTime, setLabelTime] = useState<string>("Kirim Ulang dalam 01:00");
  const [labelError] = useState<string>("Kode verifikasi tidak valid");
  const [counter, setCounter] = useState<number>(60);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (counter > 0) {
      const interval: number = setInterval(() => {
        onCounter();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [counter]);

  const getData = () => {
    const formatter: string = formatPhoneNumber(phone);
    setPhoneNumber(formatter);
  };

  /* format counter timer */
  const onCounter = () => {
    const remaining: number = counter - 1;
    const m: number = Math.floor(remaining / 60);
    const s: number = remaining % 60;

    const minutes = m < 10 ? "0" + m : m;
    const seconds = s < 10 ? "0" + s : s;

    setCounter(remaining);
    if (remaining) setLabelTime(`Kirim Ulang dalam  ${minutes}:${seconds}`);
    else setLabelTime(`Kirim Ulang`);
  };

  const onChangeText = (value: string[]) => {
    setCodes(value);

    const isValid: boolean = value.every((item) => item !== "");

    if (isValid) onNext();
  };

  const onDismiss = () => {
    navigate("/login", { replace: true });
  };

  const onRequestCode = () => {
    if (counter === 0) {
      setCounter(60);
      setLabelTime("Kirim Ulang dalam 01:00");
    }
  };

  const onNext = () => {
    navigate("/home/index", { replace: true });
  };

  return (
    <div className="background-1 px-4 pt-3.5">
      <Header
        type={"secondary"}
        title="Verifikasi Nomor"
        onDismiss={onDismiss}
      />

      <div className="mt-[60px] rounded-lg bg-white drop-shadow-md px-3 pt-8 pb-4 flex flex-col items-center">
        <p className="opacity-80">Silakan masukkan kode yang dikirimkan ke</p>
        <h4 className="font-semibold mb-4">{phoneNumber}</h4>

        <InputCode values={codes} error={labelError} onChange={onChangeText} />

        <Separator className="my-4" />

        <span className="opacity-80 text-xs">
          Tidak mendapatkan kode?{" "}
          <a
            className={
              counter === 0 ? "text-primary100 font-bold cursor-pointer" : ""
            }
            onClick={onRequestCode}
          >
            {labelTime}
          </a>
        </span>
      </div>
    </div>
  );
};

export default VerificationNumber;
