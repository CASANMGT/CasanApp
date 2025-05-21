import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IcBackBlack,
  IcBike,
  IcDownCircleGreen,
  IcFuel,
  ILNoImage,
} from "../../assets";
import { DeviceListItem, LoadingPage, Separator } from "../../components";
import { fetchChargingStationById } from "../../features";
import { showToast } from "../../features/toastSlice";
import { AppDispatch, RootState } from "../../store";
import BasicInformation from "./BasicInformation";
import PriceInformation from "./PriceInformation";

const ChargingStationDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const chargingStationById = useSelector(
    (state: RootState) => state?.chargingStationById
  );

  useEffect(() => {
    getData();
  }, []);

  const isFull: boolean = false;
  const phoneNumber = "081208120812";

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e?.target;
    const position = Math.ceil(
      (scrollTop / (scrollHeight - clientHeight)) * 100
    );

    const maxScroll = 40; // Define the scroll range for the effect
    const newOpacity = Math.min(position / maxScroll, 1); // Calculate opacity
  };

  const getData = () => {
    dispatch(fetchChargingStationById(id || ""));
  };

  const getTotalAvailable = () => {
    let total: number = 0;

    chargingStationById?.data?.Devices &&
      chargingStationById?.data?.Devices.forEach((element) => {
        if (element?.Sockets && element?.Sockets.length) {
          element?.Sockets.forEach((e) => {
            if (
              element?.SignalValue > 0 &&
              e?.SessionStatus !== 1 &&
              e?.SessionStatus !== 2 &&
              e?.SessionStatus !== 3 &&
              e?.SessionStatus !== 4 &&
              e?.SessionStatus !== 5 &&
              e?.IsCharging === 0
            ) {
              total++;
            }
          });
        }
      });

    return total;
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(phoneNumber);
    dispatch(showToast("Copied to clipboard"));
  };

  const onSeeMore = () => {
    alert("coming soon");
  };

  let available: number = 0;
  const isShowMore: boolean =
    chargingStationById?.data?.Devices &&
    chargingStationById?.data?.Devices.length > 3
      ? true
      : false;

  if (
    chargingStationById?.data?.Devices &&
    chargingStationById?.data?.Devices.length
  ) {
    available = getTotalAvailable();
  }

  console.log('cek d', chargingStationById);
  

  return (
    <LoadingPage loading={chargingStationById?.loading}>
      <div
        onScroll={handleScroll}
        className="container-screen overflow-auto scrollbar-none "
      >
        {/* HEADER */}
        <div className="relative">
          <img
            src={
              chargingStationById?.data?.Image
                ? chargingStationById?.data?.Image
                : ILNoImage
            }
            alt="details"
            className="block mx-auto w-full h-[200px] object-cover"
          />

          <div
            onClick={onDismiss}
            className="absolute top-2.5 left-4 bg-baseLightGray/70 w-10 h-10 rounded-full center cursor-pointer"
          >
            <IcBackBlack />
          </div>
        </div>

        {/* LOCATION */}
        <div className="bg-white p-4 drop-shadow">
          <div className="row gap-3">
            <img
              src={
                chargingStationById?.data?.Image
                  ? chargingStationById?.data?.Image
                  : ILNoImage
              }
              alt="location 1"
              className="w-[50px] h-[50px] rounded-md"
            />

            <div className="flex flex-col justify-between">
              <p className="font-medium">
                {chargingStationById?.data?.Name || "-"}
              </p>
              <p className="text-2-line text-xs text-black90">
                {chargingStationById?.data?.Location?.Address || "-"}
              </p>
            </div>
          </div>

          <div className="between-x mt-4">
            <div className="row gap-2.5">
              <div
                className={`h-[30px] w-[30px] rounded p-2 ${
                  isFull ? "bg-lightRed" : "bg-primary100/10"
                }`}
              >
                <IcFuel className={isFull ? "text-red" : "text-primary100"} />
              </div>

              {isFull ? (
                <div>
                  <p className="font-semibold text-xs text-red">Sedang Penuh</p>
                  <p className="text-[10px] text-red">30 menit lagi</p>
                </div>
              ) : (
                <div className="row gap-2 relative">
                  <IcBike className="text-primary100" />

                  <div className="flex gap-1 items-end">
                    <p className="text-lg font-semibold">{available}</p>
                    <p className="text-xs self-end mb-1 text-black50 font-medium">
                      tersedia
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* <div
              onClick={() =>
                openGoogleMaps(
                  chargingStationById?.data?.Location.Latitude,
                  chargingStationById?.data?.Location?.Longitude
                )
              }
              className="row gap-2 cursor-pointer"
            >
              <p className="text-xs text-primary100 font-medium">{`${distance}km dari anda`}</p>

              <div className="p-[5px] rounded-full bg-primary10">
                <IcShareGreen />
              </div>
            </div> */}
          </div>
        </div>

        {/* INFORMATION */}
        <div className="p-4">
          {/* COST INFORMATION */}

          <PriceInformation data={chargingStationById?.data} />

          {/* BASIC INFORMATION  */}
          <BasicInformation
            phone={chargingStationById?.data?.Phone || ""}
            data={chargingStationById?.data?.OperationalHours}
          />

          {/* DEVICE LIST */}
          <div className="bg-white p-3 rounded-lg mt-[14px] border drop-shadow">
            <div className="row gap-2 mb-4">
              <IcBike className="text-primary100" />
              <p className="font-medium">Device List</p>
            </div>

            {chargingStationById?.data?.Devices &&
              chargingStationById?.data?.Devices.map((item, index: number) => (
                <DeviceListItem
                  key={index}
                  data={item}
                  position={index + 1}
                  isLast={
                    index ===
                    ((chargingStationById?.data?.Devices &&
                      chargingStationById?.data?.Devices.length) ||
                      0) -
                      1
                  }
                  onClick={() =>
                    navigate("/session-settings", {
                      state: {
                        data: chargingStationById?.data,
                        selectedDevice: item,
                      },
                    })
                  }
                />
              ))}

            {isShowMore && (
              <>
                <Separator className="my-3" />

                <div className="between cursor-pointer" onClick={onSeeMore}>
                  <p className="text-primary100 text-xs font-medium">
                    Lihat lebih banyak
                  </p>

                  <IcDownCircleGreen />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LoadingPage>
  );
};

export default ChargingStationDetails;
