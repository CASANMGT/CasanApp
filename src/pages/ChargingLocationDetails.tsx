import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcBackBlack,
  IcCopyBlack,
  IcDownCircleGreen,
  IcFuelGreen,
  IcFuelRed,
  IcPhoneGreen,
  IcShareGreen,
} from "../assets";
import {
  CostInformationItem,
  DeviceListItem,
  OperatingHoursItem,
  Separator,
} from "../components";
import { showToast } from "../features/toastSlice";
import { formatPhoneNumber } from "../helpers/formatter";
import { AppDispatch } from "../store";

const costData = [1, 2];
const operatingHoursData = [1, 2];
const deviceListData = [1, 2, 3];

const ChargingLocationDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

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

  return (
    <div
      onScroll={handleScroll}
      className="container-screen overflow-auto scrollbar-none "
    >
      {/* HEADER */}
      <div className="relative">
        <img
          src="https://img.pikbest.com/wp/202342/charging-car-electric-station-a-glimpse-into-the-future-of-green-technology-3d-rendering_9861448.jpg!sw800"
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
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ddBLsjXELeexn4zWAEUxkClXVovj3Q_h2g&s"
            }
            alt="location 1"
            className="w-[50px] h-[50px] rounded-md"
          />

          <div className="flex flex-col justify-between">
            <p className="font-medium">The Breeze</p>
            <p className="text-2-line text-xs text-black90">
              Jl. BSD Green Office Park Jl. BSD Grand Boulevard, Sampora, BSD,
              Kabupaten Tangerang - Banten
            </p>
          </div>
        </div>

        <div className="between mt-4">
          <div className="row gap-2.5">
            <div
              className={`h-[30px] w-[30px] rounded p-2 ${
                isFull ? "bg-lightRed" : "bg-primary100/10"
              }`}
            >
              {isFull ? <IcFuelRed /> : <IcFuelGreen />}
            </div>

            {isFull ? (
              <div>
                <p className="font-semibold text-xs text-red">Sedang Penuh</p>
                <p className="text-[10px] text-red">30 menit lagi</p>
              </div>
            ) : (
              <div className="flex flex-row gap-1 relative">
                <p className="text-lg font-semibold">{5}</p>
                <p className="text-xs self-end mb-1 text-black50 font-medium">
                  /10
                </p>
              </div>
            )}
          </div>

          <div className="row gap-2">
            <p className="text-xs text-primary100 font-medium">2km dari anda</p>

            <div className="p-[5px] rounded-full bg-primary10">
              <IcShareGreen />
            </div>
          </div>
        </div>
      </div>

      {/* INFORMATION */}
      <div className="p-4">
        {/* COST INFORMATION */}
        <div className="bg-white p-3 rounded-lg mt-[14px] border drop-shadow">
          <p className="font-medium">Informasi Biaya</p>

          <div className="bg-primary10 rounded-lg p-3 mt-2">
            {costData.map((_, index: number) => (
              <CostInformationItem
                key={index}
                isLast={index === costData.length - 1}
              />
            ))}
          </div>

          <p className="mt-4 mb-2 font-medium">Biaya Parkir</p>

          <p className="text-black90 text-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            dapibus faucibus nulla, vitae tincidunt nunc euismod tempor. Quisque
            sed eros eget ligula mattis rutrum et a justo.
          </p>
        </div>

        {/* BASIC INFORMATION  */}
        <div className="bg-white p-3 rounded-lg mt-[14px] border drop-shadow">
          <p className="font-medium mb-4"> Informasi Dasar</p>

          <p className="text-xs text-black90 mb-2">Jam Operasional: </p>
          {operatingHoursData.map((_, index: number) => (
            <OperatingHoursItem
              key={index}
              isLast={index === operatingHoursData.length - 1}
            />
          ))}

          <Separator className="my-3 " />

          <div className="between ">
            <div className="row gap-1.5">
              <IcPhoneGreen />

              <p className="text-xs text-black90">Customer Service</p>
            </div>

            <div className="row gap-1.5 cursor-pointer" onClick={onCopy}>
              <p className="font-semibold">
                {formatPhoneNumber(phoneNumber).replace("+62 ", "0")}
              </p>
              <IcCopyBlack />
            </div>
          </div>
        </div>

        {/* DEVICE LIST */}
        <div className="bg-white p-3 rounded-lg mt-[14px] border drop-shadow">
          <p className="font-medium mb-4">Device List</p>

          {deviceListData.map((_, index: number) => (
            <DeviceListItem
              key={index}
              isLast={index === deviceListData.length - 1}
              onClick={() => alert('coming soon')}
            />
          ))}

          <Separator className="my-3" />

          <div className="between cursor-pointer" onClick={onSeeMore}>
            <p className="text-primary100 text-xs font-medium">
              Lihat lebih banyak
            </p>

            <IcDownCircleGreen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingLocationDetails;
