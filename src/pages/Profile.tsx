import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcBalance,
  IcBank,
  IcCashBlack,
  IcChatBlack,
  IcCreditCard,
  IcEditWhite,
  IcElectricityBlack,
  IcLogout,
  IcPasswordBlack,
} from "../assets";
import NullPhotoImg from "../assets/illustrations/null-photo.png";
import { CUSTOMER_SERVICES, VERSION } from "../common";
import { Button, MenuItem, Separator } from "../components";
import { useAuth } from "../context/AuthContext";
import { fetchMyUser } from "../features";
import { formatPhoneNumber, openWhatsApp, rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();

  const myUser = useSelector((state: RootState) => state.myUser);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    dispatch(fetchMyUser());
  }, []);

  const onNext = (path: string) => {
    navigate(`/${path}`);
  };

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="container-screen flex flex-col overflow-auto scrollbar-none">
      {/* HEADER */}
      <div className="bg-primary100 pt-3 px-4 pb-[82px]">
        <div className="between-x">
          <div className="row gap-2 flex">
            <img
              src={NullPhotoImg}
              alt="photo"
              className="w-[44px] h-[44px] rounded-full"
            />

            <span className="text-xl text-white font-semibold">
              {formatPhoneNumber(myUser?.data?.Phone || "")}
            </span>

            <IcEditWhite
              onClick={() => navigate("/edit-profile")}
              className="cursor-pointer"
            />
          </div>

          {/* <div
            onClick={onNotification}
            className="center w-10 h-10 rounded-full bg-baseLightGray/70 cursor-pointer"
          >
            <IcNotificationGreen />
          </div> */}
        </div>
      </div>

      {/* BALANCE */}
      <div className="mx-4 -mt-[62px] bg-secondary100 rounded-lg">
        <div className="bg-white rounded-lg px-2.5 py-4 between-x">
          <div>
            <p className="text-xs">Saldo Tersimpan</p>
            <div className="font-semibold text-blackBold row gap-0.5">
              <p className="text-xs">Rp</p>
              <p className="text-lg">{rupiah(myUser?.data?.Balance)}</p>
            </div>

            <div className="row gap-1.5 mt-3">
              <p className="text-[10px] text-black100/70">Sedang Terpakai</p>
              <p className="text-red text-xs">Rp{rupiah(0)}</p>
            </div>
          </div>

          <div className="row gap-3">
            <Button
              type="secondary"
              buttonType="sm"
              label="Withdraw"
              onClick={() => navigate("/withdraw")}
            />
            <Button
              buttonType="sm"
              label="Top Up"
              onClick={() => navigate("/top-up")}
            />
          </div>
        </div>

        <div className="row gap-1 px-3 py-2">
          <IcElectricityBlack />
          <p className="text-xs text-blackBold font-medium">
            Sisa pengecasan akan terkonversi menjadi saldo
          </p>
        </div>
      </div>

      {/* MENU 1 */}
      <div className="mx-4 mt-3 px-3 py-4 bg-white rounded-lg">
        {/* <MenuItem
          icon={IcVehicleBlack}
          label="Kendaraan Saya"
          onClick={onMyVehicle}
        /> */}

        {/* <Separator className="my-4" /> */}

        <MenuItem
          icon={IcPasswordBlack}
          label="Atur Pin Cazz"
          onClick={() => onNext("setting-pin")}
        />
      </div>

      {/* MENU 2 */}
      <div className="mx-4 mt-4 px-3 py-4 bg-white rounded-lg">
        <MenuItem
          icon={IcBalance}
          label="Riwayat Saldo"
          onClick={() => onNext("balance-history")}
        />

        <Separator className="my-4" />

        <MenuItem
          icon={IcCashBlack}
          label="Riwayat Transaksi"
          onClick={() => onNext("transaction-history")}
        />

        <Separator className="my-4" />

        <MenuItem
          icon={IcCreditCard}
          label="Riwayat Penarikan Saldo"
          onClick={() => onNext("withdrawal-history")}
        />

        <Separator className="my-4" />

        <MenuItem
          icon={IcBank}
          label="Akun Bank"
          onClick={() => navigate("/bank-account")}
        />

        <Separator className="my-4" />

        <MenuItem
          icon={IcChatBlack}
          label="Customer Support"
          onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
        />

        {/* <Separator className="my-4" />

        <MenuItem
          icon={IcSettingBlack}
          label="Pengaturan"
          onClick={onMyVehicle}
        /> */}
      </div>

      <div
        onClick={onLogout}
        className="flex items-center justify-center mt-8 mb-4 gap-1.5 cursor-pointer"
      >
        <IcLogout />
        <span className="text-base text-red font-medium">Keluar Akun</span>
      </div>

      <span className="ml-4 text-xs text-black90">{`Version ${VERSION}`}</span>

      <div className="mb-[100px]" />
    </div>
  );
};

export default Profile;
