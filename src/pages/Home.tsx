import { useState } from "react";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  IcNotificationBadgesGreen,
  IcNotificationGreen,
  IcPinWhite,
  IcSearchGray,
} from "../assets";
import { AVAILABLE_PLACE } from "../common";
import {
  AvailablePlaceItem,
  Carousel,
  ChargingLocationCard,
  OngoingItem,
} from "../components";

const dataOngoingDummy = [1, 2, 3];
const slidesDummy = [
  { id: 1, image: "https://via.placeholder.com/300x150", title: "Slide 1" },
  { id: 2, image: "https://via.placeholder.com/300x150", title: "Slide 2" },
  { id: 3, image: "https://via.placeholder.com/300x150", title: "Slide 3" },
];

const chargingLocationDummy: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Home = () => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const [place, setPlace] = useState<string>("Terdekat");

  const onSearch = () => {
    alert("coming soon");
  };

  const onNotification = () => {
    alert("coming soon");
  };

  return (
    <div className="overflow-hidden flex">
      <div className="px-4 py-3 flex flex-col overflow-hidden">
        <div>
          {/* LOCATION */}
          <div className="row gap-1">
            <IcPinWhite />
            <span className="opacity-90 text-white text-xs">
              <a className="font-semibold">Tangerang,</a> Indonesia
            </span>
          </div>

          {/* SEARCH */}
          <div className="row gap-3 mt-2.5 mb-5">
            <div
              onClick={onSearch}
              className="row px-3 h-10 rounded-full bg-baseLightGray/70 gap-2.5 flex-1 cursor-pointer"
            >
              <IcSearchGray />

              <span className="text-black opacity-50 text-xs">
                Cari lokasi pengecasan
              </span>
            </div>

            <div
              onClick={onNotification}
              className="h-10 w-10 rounded-full bg-baseLightGray/70 items-center justify-center flex cursor-pointer"
            >
              {true ? <IcNotificationBadgesGreen /> : <IcNotificationGreen />}
            </div>
          </div>

          {/* CAROUSEL */}
          <Carousel slides={slidesDummy} />

          {/* ONGOING */}
          <div className="bg-white rounded-lg p-3 mt-5">
            <p className="font-medium mb-3">Sedang berlangsung</p>
            <div className="row gap-2 overflow-x-auto scrollbar-none">
              {dataOngoingDummy.map((_, index: number) => (
                <OngoingItem key={index} />
              ))}
            </div>
          </div>

          {/* FILTER */}
          <div className="row gap-3 mt-5">
            {AVAILABLE_PLACE.map((item: string, index: number) => (
              <AvailablePlaceItem
                key={index}
                label={item}
                isActive={item === place}
                onClick={() => setPlace(item)}
              />
            ))}
          </div>
        </div>

        {/* CHARGING LIST */}
        <div className="flex flex-col overflow-auto scrollbar-none pt-3">
          {chargingLocationDummy.map((item: number, index: number) => (
            <ChargingLocationCard
              key={index}
              onClick={() => navigate("/charging-location-details")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
