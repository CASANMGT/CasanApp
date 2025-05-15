import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { AddBankAccountBody, FormSelectBank } from "../common";
import { Header, InputCode, Separator } from "../components";
import { useAuth } from "../context/AuthContext";
import {
  fetchAddBankAccount,
  fetchLogin,
  fetchSendOTP,
  hideLoading,
  LoginRequest,
  resetDataAddBankAccount,
  resetDataLogin,
  showLoading,
} from "../features";
import { formatPhoneNumber } from "../helpers/formatter";
import { AppDispatch, RootState } from "../store";

const VerificationNumber = () => {
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const dataLogin = useSelector((state: RootState) => state.login);
  const validateBank = useSelector((state: RootState) => state.validateBank);
  const addBankAccount = useSelector(
    (state: RootState) => state.addBankAccount
  );

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [labelTime, setLabelTime] = useState<string>("Kirim Ulang dalam 01:00");
  const [labelError, setLabelError] = useState<string>();
  const [counter, setCounter] = useState<number>(60);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !location?.state?.isAddBank)
      navigate("/home", { replace: true });
  }, []);

  useEffect(() => {
    if (counter > 0) {
      const interval: number = setInterval(() => {
        onCounter();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [counter]);

  useEffect(() => {
    if (dataLogin?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (dataLogin.data) {
      dispatch(resetDataLogin());
      login();
      navigate("/home/index", { replace: true });
    } else if (dataLogin?.error) {
      dispatch(resetDataLogin());
      setLabelError("kode verifikasi tidak valid");
    }
  }, [dataLogin]);

  useEffect(() => {
    if (addBankAccount?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (addBankAccount?.data) {
      dispatch(resetDataAddBankAccount());
      navigate("/bank-account", { replace: true });
    }
  }, [addBankAccount]);

  const getData = () => {
    dispatch(resetDataLogin());
    const formatter: string = formatPhoneNumber(location?.state?.phone);
    setPhoneNumber(formatter);
    getOTP(formatter);
  };

  const getOTP = (phone: string) => {
    dispatch(fetchSendOTP(phone.replace(/\s+/g, "")));
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
    setLabelError("");

    const isValid: boolean = value.every((item) => item !== "");

    if (isValid) onNext(value);
  };

  const onDismiss = () => {
    if (location?.state?.isAddBank) navigate(-1);
    else navigate("/login", { replace: true });
  };

  const onRequestCode = () => {
    getOTP(phoneNumber);

    if (counter === 0) {
      setCounter(60);
      setLabelTime("Kirim Ulang dalam 01:00");
    }
  };

  const onNext = (code: string[]) => {
    if (location?.state?.isAddBank) {
      const data: FormSelectBank = location?.state?.data;

      const body: AddBankAccountBody = {
        code: data?.bankName?.data?.ExternalCode,
        number: data?.accountNumber,
        otp_code: code.join(""),
      };

      dispatch(fetchAddBankAccount(body));
    } else {
      const body: LoginRequest = {
        code: code.join(""),
        phone_number: phoneNumber.replace(/\s+/g, ""),
      };

      dispatch(fetchLogin(body));
    }
  };

  return (
    <div className="background-1 px-4 pt-3.5">
      <Header
        type={"secondary"}
        title="Verifikasi Nomor"
        onDismiss={onDismiss}
      />

      <div className="mt-[60px] rounded-lg bg-white drop-shadow-md px-3 pt-8 pb-4 flex flex-col items-center">
        <p className="opacity-80 ">Silakan masukkan kode yang dikirimkan ke</p>
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
