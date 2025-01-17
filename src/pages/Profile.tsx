import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcCashBlack,
  IcChatBlack,
  IcEditWhite,
  IcElectricityBlack,
  IcNotificationGreen,
  IcPasswordBlack,
  IcSettingBlack,
  IcVehicleBlack,
} from "../assets";
import NullPhotoImg from "../assets/illustrations/null-photo.png";
import { Button, MenuItem, Separator } from "../components";
import { rupiah } from "../helpers";

const Profile = () => {
  const phoneNumber: string = "08120810812";
  const navigate: NavigateFunction = useNavigate();

  const onEdit = () => {
    alert("coming soon");
  };

  const onNotification = () => {
    alert("coming soon");
  };

  const onRefund = () => {
    alert("coming soon");
  };

  const onTopUp = () => {
    alert("coming soon");
  };

  const onMyVehicle = () => {
    alert("coming soon");
  };

  const onNext = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="container-screen flex flex-col overflow-auto scrollbar-none">
      {/* HEADER */}
      <div className="bg-primary100 pt-3 px-4 pb-[82px]">
        <div className="between">
          <div className="row gap-2 flex">
            <img
              src={NullPhotoImg}
              alt="photo"
              className="w-[44px] h-[44px] rounded-full"
            />

            <span className="text-xl text-white font-semibold">
              {phoneNumber}
            </span>
            <IcEditWhite onClick={onEdit} className="cursor-pointer" />
          </div>

          <div
            onClick={onNotification}
            className="center w-10 h-10 rounded-full bg-baseLightGray/70 cursor-pointer"
          >
            <IcNotificationGreen />
          </div>
        </div>
      </div>

      {/* BALANCE */}
      <div className="mx-4 -mt-[62px] bg-secondary100 rounded-lg">
        <div className="bg-white rounded-lg px-2.5 py-4 between">
          <div>
            <p className="text-xs">Saldo Tersimpan</p>
            <div className="font-semibold text-blackBold row gap-0.5">
              <p className="text-xs">Rp</p>
              <p className="text-lg">{rupiah(50000)}</p>
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
              label="Refund"
              onClick={onRefund}
            />
            <Button buttonType="sm" label="Top Up" onClick={onTopUp} />
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
        <MenuItem
          icon={IcVehicleBlack}
          label="Kendaraan Saya"
          onClick={onMyVehicle}
        />

        <Separator className="my-4" />

        <MenuItem
          icon={IcPasswordBlack}
          label="Atur Pin Cazz"
          onClick={() => onNext("input-pin")}
        />
      </div>

      {/* MENU 2 */}
      <div className="mx-4 mt-4 px-3 py-4 bg-white rounded-lg">
        <MenuItem
          icon={IcCashBlack}
          label="Riwayat Transaksi"
          onClick={() => onNext("transaction-history")}
        />

        <Separator className="my-4" />

        <MenuItem icon={IcCashBlack} label="Akun Bank" onClick={onMyVehicle} />

        <Separator className="my-4" />

        <MenuItem
          icon={IcChatBlack}
          label="Customer Support"
          onClick={onMyVehicle}
        />

        <Separator className="my-4" />

        <MenuItem
          icon={IcSettingBlack}
          label="Pengaturan"
          onClick={onMyVehicle}
        />
      </div>

      <div className="mb-[100px]" />
    </div>
  );
};

export default Profile;
