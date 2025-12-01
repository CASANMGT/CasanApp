import { useEffect, useMemo, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcCartGreen, IcMotorcycleGreen, IcPinWhite } from "../../assets";
import { GeocodeResult, LIMIT_LIST } from "../../common";
import {
  Carousel,
  ChargingLocationCard,
  LoadingPage,
  ModalCarouselDetails,
  OngoingItem,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import {
  fetchChargingStation,
  fetchOnGoingSessionList,
  setFromGlobal,
} from "../../features";
import { Api } from "../../services";
import { getCurrentLocation, getGeoCode } from "../../services/ApiAddress";
import { AppDispatch, RootState } from "../../store";
import StatusRTO from "./StatusRTO";
import { IoIosPin } from "react-icons/io";

const HomePages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const chargingStation = useSelector(
    (state: RootState) => state.chargingStation
  );
  const global = useSelector((state: RootState) => state.global);
  const onGoingSessionList = useSelector(
    (state: RootState) => state.onGoingSessionList
  );

  const [loadingRTO, setLoadingRTO] = useState(false);
  const [page, setPage] = useState(1);
  const [dataRTO, setDataRTO] = useState<RTOProps>();
  const [typeVehicle, setTypeVehicle] = useState<string | number>("bike");
  const [place, setPlace] = useState<string>("terdekat");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [detailLocation, setDetailLocation] = useState<GeocodeResult>();

  useEffect(() => {
    setPage(1);
    getLocation();
    if (isAuthenticated) {
      getOngoing();
      getDataRTO();
    }
  }, []);

  useEffect(() => {
    getData();
  }, [currentLocation]);

  const getLocation = async () => {
    try {
      const check = await getCurrentLocation();

      const res: GeocodeResult = await getGeoCode({
        address: `${check[0]},${check[1]}`,
      });

      setCurrentLocation(check);
      setDetailLocation(res);
    } catch (error) {}
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
    const body = {
      page: 1,
      limit: 10,
      is_finish: 0,
    };
    dispatch(fetchOnGoingSessionList(body));
  };

  const getDataRTO = async () => {
    try {
      setLoadingRTO(true);
      const res = await Api.get({
        url: "rtos",
        params: { statuses: "1,2,3,4,5,8,9,11", page: 1, limit: 1 },
      });

      setDataRTO(res?.data?.[0] ?? undefined);
    } catch (error) {
    } finally {
      setLoadingRTO(false);
    }
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
          {/* INFORMATION */}
          {/* <div className="bg-[#D5F1EB] px-6 py-4 mb-6 -mx-4">
            <p className="text-black70">
              Casan.id - solusi pengisian daya EV yang mudah dan andal untuk
              sepeda dan motor listrik
            </p>
          </div> */}

          Coming Soon

          {/* LOCATION */}
          <div className="inline-flex items-center gap-2 mb-2 bg-primary30 py-2 px-4 rounded-full shadow-lg">
            <IoIosPin size={18} className="text-primary100" />
            <span className="text-black100 font-semibold">
              {detailLocation?.city}
            </span>
          </div>

          {/* SEARCH */}
          {/* <div className="row gap-3 mt-2.5 mb-5">
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
          </div> */}

          {/* CAROUSEL */}
          {/* dummy */}
          {false && <Carousel slides={[]} />}

          {/* ONGOING */}
          {isShowOngoing && (
            <div className="bg-white rounded-lg p-3 mt-5">
              <p className="font-medium mb-3">Sedang berlangsung</p>
              <div className="row gap-2 overflow-x-auto scrollbar-none">
                {onGoingSessionList?.data?.data.map(
                  (item: any, index: number) => (
                    <OngoingItem
                      key={index}
                      data={item}
                      onClick={() => navigate(`/charging/${item?.ID}`)}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* FILTER */}
          {/* <div className="between-x mt-5">
            <div className="row gap-3 flex-1">
              {optionsTypeVehicle.map((item, index: number) => (
                <AvailableTypeVehicleItem
                  key={index}
                  data={item}
                  isActive={item?.value === typeVehicle}
                  onClick={() => setTypeVehicle(item.value)}
                />
              ))}
            </div>

            <Dropdown
              select={place}
              type="sm"
              placeholder="Voltage"
              options={optionsPlace}
              onSelect={(select) => setPlace(select?.value.toString())}
              className="!w-[120px]"
            />
          </div> */}
        </div>

        {/* CHARGING SERVICE */}
        {/* dummy */}
        {false && (
          <div className="bg-white rounded-lg p-4 mt-4">
            <span className="text-base font-semibold">Layanan Casan</span>

            <div className="mt-5 between-x gap-2.5">
              <div
                onClick={() => navigate("/select-dealer")}
                className="row gap-2 p-2 rounded-lg border border-black10 flex-1 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-primary100 bg-primary10 center">
                  <IcMotorcycleGreen />
                </div>

                <span className="flex-1 text-blackBold">Isi Daya Motor</span>

                <FaChevronRight />
              </div>

              <div
                onClick={() => navigate("/select-rent-buy")}
                className="row gap-2 p-2 rounded-lg border border-black10 flex-1 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-primary100 bg-primary10 center">
                  <IcCartGreen />
                </div>

                <span className="flex-1 text-blackBold">Sewa Beli</span>

                <FaChevronRight />
              </div>
            </div>
          </div>
        )}

        {/* STATUS RTO */}
        {dataRTO?.ID && (
          <StatusRTO
            data={dataRTO}
            onClick={() => navigate(`/booking-details/${dataRTO?.ID}`)}
          />
        )}

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
                    navigate(`/charging-station-details/${item?.ID}`, {
                      state: { currentLocation },
                    })
                  }
                  onLoadMore={onLoadMore}
                />
              ))}
          </LoadingPage>
        </div>
      </div>

      {/* MODAL */}
      <ModalCarouselDetails
        visible={global?.openCarousel}
        data={global?.data}
        onDismiss={() =>
          dispatch(
            setFromGlobal({
              type: "openCarousel",
              value: false,
            })
          )
        }
      />
      {/* END MODAL */}
    </div>
  );
};

export default HomePages;
