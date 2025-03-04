import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcRightGreen } from "../assets";
import { REGEX_PHONE_NUMBER_HALF } from "../common";
import { Button, Input, Separator } from "../components";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate: NavigateFunction = useNavigate();
  const { isAuthenticated } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, []);

  const handleChange = (value: string) => {
    setPhoneNumber(value);
  };

  const onValidation = () => {
    let value: boolean = !REGEX_PHONE_NUMBER_HALF.test(phoneNumber);

    return value;
  };

  const onGuest = () => {
    alert("coming soon");
  };

  const onLogin = () => {
    navigate("/verification", { replace: true, state: { phone: phoneNumber } });
  };

  return (
    <div className="background-1 px-4 pt-[105px]">
      <div className="px-3 pt-8 pb-4 bg-white rounded-lg center flex-col drop-shadow-md">
        <h4 className="font-semibold">Selamat Datang</h4>
        <span className="mb-3">Silakan Login Dengan No Handphone</span>
        <Input
          type={"phone"}
          value={phoneNumber}
          autoFocus
          placeholder="No Handphone"
          onChange={handleChange}
        />
        <Button
          className="my-3"
          label="Masuk"
          disabled={onValidation()}
          onClick={onLogin}
        />

        <div className="text-xs">
          <p>
            Dengan mendaftar, Anda menyetujui{" "}
            <b className="text-primary100 cursor-pointer">Syarat & Ketentuan</b>{" "}
            dan{" "}
            <b className="text-primary100 cursor-pointer">Kebijakan Privasi</b>{" "}
            kami.
          </p>
        </div>

        <Separator className="my-3" />

        <Button
          type={"secondary"}
          label="Lanjut Sebagai Tamu"
          iconRight={IcRightGreen}
          onClick={onGuest}
        />
      </div>
    </div>
  );
};

export default Login;
