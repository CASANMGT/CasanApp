import { useEffect, useState } from "react";
import { FaGasPump } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiErrorWarningFill } from "react-icons/ri";
import { TbLocation } from "react-icons/tb";
import { useDispatch } from "react-redux";
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
  ILNoImage,
} from "../../assets";
import { DeviceListItem, LoadingPage, Separator } from "../../components";
import { showToast } from "../../features/toastSlice";
import { getDistanceFromLatLonInKm, openGoogleMaps } from "../../helpers";
import { Api } from "../../services";
import { AppDispatch } from "../../store";
import NotFound from "../NotFound";
import BasicInformation from "./BasicInformation";
import PriceInformation from "./PriceInformation";

const StationDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ChargingStation>();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const phoneNumber = "081208120812";

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e?.target;
    const position = Math.ceil(
      (scrollTop / (scrollHeight - clientHeight)) * 100
    );

    const maxScroll = 40; // Define the scroll range for the effect
    const newOpacity = Math.min(position / maxScroll, 1); // Calculate opacity
  };

  const getData = async () => {
    try {
      if (id) {
        setLoading(true);
        const res = await Api.get({
          url: `stations/${id}`,
        });

        setData(res?.data);
      }
    } catch (error: any) {
      if (error?.message) setIsNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAvailable = () => {
    let total: number = 0;

    data?.Devices &&
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
              e?.IsCharging === 0 &&
              e?.IsActive
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
    data?.Devices && data?.Devices.length > 3 ? true : false;

  if (data?.Devices && data?.Devices.length) {
    available = getTotalAvailable();
  }

  const distance = getDistanceFromLatLonInKm(
    {
      lat: data?.Location?.Latitude,
      lon: data?.Location?.Longitude,
    },
    location?.state?.currentLocation
  );

  if (!id || isNotFound) return <NotFound onDismiss={onDismiss} />;

  return (
    <LoadingPage loading={loading}>
      <div
        onScroll={handleScroll}
        className="container-screen overflow-auto scrollbar-none"
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

          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2 text-white between-x">
            <div className="flex flex-row gap-1 ">
              <div className="h-[30px] w-auto aspect-square bg-white/30 rounded-full border border-white center">
                <FaGasPump size={14} />
              </div>
              <span className="text-lg pl-1">{available}</span>{" "}
              <span className="text-xs self-end mb-1 font-medium">
                tersedia
              </span>
            </div>

            <div className="row gap-2">
              <span className="text-xs font-medium">{`${distance}km dari anda`}</span>

              <div
                onClick={() =>
                  openGoogleMaps(
                    data?.Location?.Latitude || 0,
                    data?.Location?.Longitude || 0
                  )
                }
                className="h-[22px] w-auto aspect-square rounded-full bg-primary10 center cursor-pointer"
              >
                <TbLocation size={14} className="text-primary100" />
              </div>
            </div>
          </div>
        </div>

        {data?.IsClosed && (
          <div className="row gap-3 bg-lightRed p-4 mb-[1px]">
            <RiErrorWarningFill size={18} className="text-red" />

            <span className="font-semibold text-red">
              Lokasi Tutup Sementara
            </span>
          </div>
        )}

        <div className="bg-white p-4 mb-[1px]">
          <span className="font-medium text-blackBold">
            {data?.Name || "-"}
          </span>
        </div>

        <div className="bg-white p-4 row gap-3 mb-2">
          <HiOutlineLocationMarker size={20} className="text-primary100" />

          <span className="flex-1 text-xs text-black90">
            {data?.Location?.Address || "-"}
          </span>
        </div>

        {/* INFORMATION */}
        <div className="space-y-4 mb-10">
          {/* DEVICE LIST */}
          <div className="bg-white p-3 border drop-shadow">
            <div className="row gap-2 mb-4">
              <IcBike className="text-primary100" />
              <p className="font-medium flex-1">Device List</p>
            </div>

            {data?.Devices &&
              data?.Devices.map((item, index: number) => (
                <DeviceListItem
                  key={index}
                  data={item}
                  closed={data?.IsClosed}
                  position={index + 1}
                  isLast={
                    index === ((data?.Devices && data?.Devices.length) || 0) - 1
                  }
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

          {/* COST INFORMATION */}
          <PriceInformation data={data} />

          {/* BASIC INFORMATION  */}
          <BasicInformation
            phone={data?.Phone || ""}
            data={data?.OperationalHours}
          />
        </div>
      </div>
    </LoadingPage>
  );
};

export default StationDetails;
