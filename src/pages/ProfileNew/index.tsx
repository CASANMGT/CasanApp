import { useEffect, useState } from "react";
import { FaLeaf } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { MdOutlineHistory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  IcTicket,
  ILNotFound,
} from "../../assets";
import NullPhotoImg from "../../assets/illustrations/null-photo.png";
import { CUSTOMER_SERVICES, VERSION } from "../../common";
import {
  AlertModal,
  Button,
  LoadingPage,
  MenuItem,
  ModalChangelog,
  Separator,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { fetchMilestoneList, fetchMyUser } from "../../features";
import { formatPhoneNumber, openWhatsApp, rupiah } from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import MilestoneView from "./MilestoneView";

const ProfileNew = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();

  const myUser = useSelector((state: RootState) => state.myUser);
  const milestoneList = useSelector((state: RootState) => state.milestoneList);

  const [openNotAvailable, setOpenNotAvailable] = useState(false);
  const [openChangelog, setOpenChangelog] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (myUser?.error === "not authorized") {
      logout();
      navigate("/login", { replace: true });
    }
  }, [myUser?.error]);

  const getData = async () => {
    dispatch(fetchMyUser());
    dispatch(fetchMilestoneList());
  };

  const onNext = (path: string) => {
    navigate(`/${path}`);
  };

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isGreenRider: boolean = myUser?.data?.MilestoneID ? true : false;

  return (
    <div className="container-screen flex flex-col overflow-auto scrollbar-none">
      <LoadingPage loading={myUser?.loading || milestoneList?.loading}>
        {/* HEADER */}
        <div className="bg-primary100 pt-3 px-4 pb-[82px]">
          <div className="between-x">
            <div className="row gap-2 flex">
              <img
                src={NullPhotoImg}
                alt="photo"
                className="w-[44px] h-[44px] rounded-full"
              />

              <div>
                <div className="row gap-2">
                  <span className="text-xl text-white font-semibold">
                    {formatPhoneNumber(myUser?.data?.Phone || "")}
                  </span>

                  <IcEditWhite
                    onClick={() => navigate("/edit-profile")}
                    className="cursor-pointer"
                  />
                </div>

                {isGreenRider && (
                  <div className="row gap-1">
                    <FaLeaf size={16} className="text-white" />

                    <span className="text-white font-medium">Green Rider</span>
                  </div>
                )}
              </div>
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
                onClick={() => setOpenNotAvailable(true)}
                // onClick={() => navigate("/withdraw")}
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

        {/* CO2 */}
        <MilestoneView
          navigate={navigate}
          dataUser={myUser?.data}
          dataMilestone={milestoneList?.data}
        />

        {/* MENU 1 */}
        <div className="mx-4 mt-3 px-3 py-4 bg-white rounded-lg">
          <MenuItem
            icon={IcTicket}
            label="Voucher Saya"
            onClick={() => onNext("voucher")}
          />

          <Separator className="my-4" />

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

          <Separator className="my-4" />

          <MenuItem
            icon={FiInfo}
            label="Tentang Kami"
            onClick={() => window.open("https://about.casan.id/", "_blank")}
          />

          <Separator className="my-4" />

          <MenuItem
            icon={MdOutlineHistory}
            label="Changelog"
            onClick={() => setOpenChangelog(true)}
          />
        </div>

        <div
          onClick={onLogout}
          className="flex items-center justify-center mt-8 mb-4 gap-1.5 cursor-pointer"
        >
          <IcLogout />
          <span className="text-base text-red font-medium">Keluar Akun</span>
        </div>

        <span
          role="button"
          tabIndex={0}
          onClick={() => setOpenChangelog(true)}
          onKeyDown={(e) => e.key === "Enter" && setOpenChangelog(true)}
          className="ml-4 text-xs text-black90 cursor-pointer underline decoration-dotted"
        >
          {`Version ${VERSION} · Lihat Changelog`}
        </span>

        <div className="mb-[100px]" />
      </LoadingPage>

      {/* MODAL */}
      <AlertModal
        visible={openNotAvailable}
        icon={ILNotFound}
        title="Fitur Tidak Tersedia"
        description="Maaf, saat ini fitur sedang dalam proses perbaikan maksimal sampai 5 Januari 2026. Silakan cek berkala."
        typeButtonRight="primary"
        labelButtonRight="Tutup"
        onDismiss={() => setOpenNotAvailable(false)}
      />

      <ModalChangelog
        isOpen={openChangelog}
        onDismiss={() => setOpenChangelog(false)}
      />
      {/* END MODAL */}
    </div>
  );
};

export default ProfileNew;
