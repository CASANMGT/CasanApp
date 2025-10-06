import { useEffect } from "react";
import { FaLeaf } from "react-icons/fa6";
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
  IcTicket,
} from "../../assets";
import NullPhotoImg from "../../assets/illustrations/null-photo.png";
import { CUSTOMER_SERVICES, VERSION } from "../../common";
import { Button, LoadingPage, MenuItem, Separator } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { fetchMilestoneList, fetchMyUser } from "../../features";
import { formatPhoneNumber, openWhatsApp, rupiah } from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import MilestoneView from "../Profile/MilestoneView";

const ProfileNew = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();

  const myUser = useSelector((state: RootState) => state.myUser);
  const milestoneList = useSelector((state: RootState) => state.milestoneList);

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

        <MilestoneView
          navigate={navigate}
          dataUser={myUser?.data}
          dataMilestone={milestoneList?.data}
        />

        <div
          onClick={onLogout}
          className="flex items-center justify-center mt-8 mb-4 gap-1.5 cursor-pointer"
        >
          <IcLogout />
          <span className="text-base text-red font-medium">Keluar Akun</span>
        </div>

        <span className="ml-4 text-xs text-black90">{`Version ${VERSION}`}</span>

        <div className="mb-[100px]" />
      </LoadingPage>
    </div>
  );
};

export default ProfileNew;
