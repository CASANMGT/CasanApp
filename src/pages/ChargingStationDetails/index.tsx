import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import {
  IcBackBlack,
  IcDownCircleGreen,
  IcFuel,
  IcShareGreen,
  ILNoImage,
} from "../../assets";
import { DataChargingStation } from "../../common";
import { DeviceListItem, Separator } from "../../components";
import { showToast } from "../../features/toastSlice";
import { getDistanceFromLatLonInKm, openGoogleMaps } from "../../helpers";
import { AppDispatch } from "../../store";
import BasicInformation from "./BasicInformation";
import PriceInformation from "./PriceInformation";
import { forEach } from "lodash";

const operatingHoursData = [1, 2];
const deviceListData = [1, 2, 3];
const dataCostInformation = [
  {
    id: 1,
    watt: "0-250W",
    price: 800,
  },
  {
    id: 1,
    watt: "251-500W",
    price: 1600,
  },
];
const dataDeviceList = [
  {
    id: "A",
    available: 2,
    location: "Pintu Masuk Barat (5)",
    signalValue: 30,
    disabled: false,
    isFull: false,
  },
  {
    id: "B",
    available: 5,
    location: "Pintu Masuk Utara (5)",
    signalValue: 30,
    disabled: false,
    isFull: true,
  },
  {
    id: "C",
    available: 5,
    location: "Pintu Masuk Timur (5)",
    signalValue: 0,
    disabled: true,
    isFull: false,
  },
];

const ChargingStationDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<DataChargingStation>(location?.state?.data);

  useEffect(() => {}, []);

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

  const getTotalAvailable = () => {
    let total: number = 0;

    data?.Devices.forEach((element) => {
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
  let photo: string = "";
  const isShowMore: boolean = data?.Devices.length > 3;

  const distance = getDistanceFromLatLonInKm(
    { lat: data?.Location?.Latitude, lon: data?.Location?.Longitude },
    location?.state?.currentLocation
  );

  if (data?.Devices && data?.Devices.length) {
    photo = data?.Devices[0].ChargingStation?.Image;
    available = getTotalAvailable();
  }

  return (
    <div
      onScroll={handleScroll}
      className="container-screen overflow-auto scrollbar-none "
    >
      {/* HEADER */}
      <div className="relative">
        <img
          src={data?.Image ? data?.Image : ILNoImage}
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
            src={data?.Image ? data?.Image : ILNoImage}
            alt="location 1"
            className="w-[50px] h-[50px] rounded-md"
          />

          <div className="flex flex-col justify-between">
            <p className="font-medium">{data?.Name || "-"}</p>
            <p className="text-2-line text-xs text-black90">
              {data?.Location?.Address || "-"}
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
              <div className="flex flex-row gap-1 relative">
                <p className="text-lg font-semibold">{available}</p>
                <p className="text-xs self-end mb-1 text-black50 font-medium">
                  tersedia
                </p>
              </div>
            )}
          </div>

          <div
            onClick={() =>
              openGoogleMaps(data?.Location.Latitude, data?.Location?.Longitude)
            }
            className="row gap-2 cursor-pointer"
          >
            <p className="text-xs text-primary100 font-medium">{`${distance}km dari anda`}</p>

            <div className="p-[5px] rounded-full bg-primary10">
              <IcShareGreen />
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATION */}
      <div className="p-4">
        {/* COST INFORMATION */}

        <PriceInformation data={data} />

        {/* BASIC INFORMATION  */}
        <BasicInformation data={data?.OperationalHours} />

        {/* DEVICE LIST */}
        <div className="bg-white p-3 rounded-lg mt-[14px] border drop-shadow">
          <p className="font-medium mb-4">Device List</p>

          {data?.Devices.map((item, index: number) => (
            <DeviceListItem
              key={index}
              data={item}
              position={index + 1}
              isLast={index === dataDeviceList.length - 1}
              onClick={() =>
                navigate("/session-settings", {
                  state: {
                    data: data,
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
  );
};

export default ChargingStationDetails;
