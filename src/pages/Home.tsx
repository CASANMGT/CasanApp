import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcNotificationBadgesGreen,
  IcNotificationGreen,
  IcPinWhite,
  IcSearchGray,
} from "../assets";
import {
  AVAILABLE_PLACE,
  ChargingStationBody,
  LatLng,
  LIMIT_LIST,
  SessionListBody,
} from "../common";
import {
  AvailablePlaceItem,
  ChargingLocationCard,
  LoadingPage,
  OngoingItem,
} from "../components";
import { useAuth } from "../context/AuthContext";
import { fetchChargingStation, fetchOnGoingSessionList } from "../features";
import { AppDispatch, RootState } from "../store";

const Home = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const chargingStation = useSelector(
    (state: RootState) => state.chargingStation
  );
  const onGoingSessionList = useSelector(
    (state: RootState) => state.onGoingSessionList
  );

  const [page, setPage] = useState(1);
  const [place, setPlace] = useState<string>("Terdekat");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  useEffect(() => {
    setPage(1);
    getCurrentLocation();
    getOngoing();
  }, []);

  useEffect(() => {
    getData();
  }, [currentLocation]);

  const getCurrentLocation = () => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            console.log("User denied the request for Geolocation.");
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            console.log("Location information is unavailable.");
          } else if (err.code === err.TIMEOUT) {
            console.log("The request to get user location timed out.");
          } else {
            console.log("An unknown error occurred.");
          }
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  const getData = (nextPage?: number) => {
    const body: ChargingStationBody = {
      page: nextPage || page,
      limit: LIMIT_LIST,
      is_admin: false,
    };

    if (currentLocation?.length) {
      body.latitude = currentLocation[0];
      body.longitude = currentLocation[1];
    }

    dispatch(fetchChargingStation(body));
  };

  const getOngoing = () => {
    const body: SessionListBody = {
      page: 1,
      limit: 10,
      is_finish: 0,
    };
    dispatch(fetchOnGoingSessionList(body));
  };

  const onSearch = () => {
    alert("coming soon");
  };

  const onNotification = () => {
    alert("coming soon");
  };

  const onLoadMore = () => {
    const nextPage: number = page + 1;
    setPage(nextPage);
    getData(nextPage);
  };

  const isShowOngoing: boolean = useMemo(
    () =>
      onGoingSessionList?.data?.data && onGoingSessionList?.data?.data.length
        ? true
        : false,
    [onGoingSessionList?.data]
  );

  return (
    <div className="overflow-hidden flex w-full">
      <div className="px-4 py-3 flex flex-col w-full overflow-hidden">
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
              {false ? <IcNotificationBadgesGreen /> : <IcNotificationGreen />}
            </div>
          </div>

          {/* CAROUSEL */}
          {/* <Carousel slides={slidesDummy} /> */}

          {/* ONGOING */}
          {isShowOngoing && <div className="bg-white rounded-lg p-3 mt-5">
            <p className="font-medium mb-3">Sedang berlangsung</p>
            <div className="row gap-2 overflow-x-auto scrollbar-none">
              {onGoingSessionList?.data?.data.map((item, index: number) => (
                <OngoingItem
                  key={index}
                  data={item}
                  onClick={() => navigate(`/charging/${item?.ID}`)}
                />
              ))}
            </div>
          </div>}

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
          <LoadingPage
            loading={!chargingStation?.data?.data && chargingStation?.loading}
          >
            {chargingStation?.data?.data &&
              chargingStation?.data?.data.map((item, index: number) => (
                <ChargingLocationCard
                  key={index}
                  data={item}
                  loading={chargingStation?.loading}
                  currentLocation={currentLocation}
                  isLast={
                    chargingStation?.data?.data &&
                    index === chargingStation?.data?.data.length - 1 &&
                    page * LIMIT_LIST == chargingStation?.data?.data.length
                  }
                  onClick={() =>
                    navigate("/charging-station-details", {
                      state: { data: item, currentLocation },
                    })
                  }
                  onLoadMore={onLoadMore}
                />
              ))}
          </LoadingPage>
        </div>
      </div>
    </div>
  );
};

export default Home;
