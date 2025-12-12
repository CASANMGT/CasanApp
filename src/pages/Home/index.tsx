import { useEffect, useMemo, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { IoIosPin } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  IcCartGreen,
  IcCasanCircle,
  IcLogo,
  IcMakaCircle,
  IcMotorcycleGreen,
  IcTangkasCircle,
  IcUnitedCircle,
} from "../../assets";
import { ChargeBrandOption, GeocodeResult, LIMIT_LIST } from "../../common";
import {
  Carousel,
  ChargingLocationCard,
  DropdownCheckbox,
  LoadingPage,
  ModalCarouselDetails,
  OngoingItem,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { fetchOnGoingSessionList, setFromGlobal } from "../../features";
import { Api } from "../../services";
import { getCurrentLocation, getGeoCode } from "../../services/ApiAddress";
import { AppDispatch, RootState } from "../../store";
import StatusRTO from "./StatusRTO";

type ResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const global = useSelector((state: RootState) => state.global);
  const onGoingSessionList = useSelector(
    (state: RootState) => state.onGoingSessionList
  );

  const [loading, setLoading] = useState(false);
  const [loadingRTO, setLoadingRTO] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ResponseProps>();
  const [dataRTO, setDataRTO] = useState<RTOProps>();
  const [typeVehicle, setTypeVehicle] = useState<string | number>("bike");
  const [place, setPlace] = useState<string>("terdekat");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [detailLocation, setDetailLocation] = useState<GeocodeResult>();
  const [filter, setFilter] = useState<OptionsProps[]>([]);

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
  }, [currentLocation, filter]);

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

  const getData = async (nextPage?: number) => {
    try {
      setLoading(true);
      const body: ChargingStationBody = {
        page: nextPage || page,
        limit: LIMIT_LIST,
        is_admin: false,
      };

      if (currentLocation?.length) {
        body.latitude = currentLocation[0];
        body.longitude = currentLocation[1];
      }

      if (filter?.length) {
        const value = filter.map((e) => Number(e?.value));
        body.brands = JSON.stringify(value);
      }

      const res = await Api.get({
        url: "stations/locations",
        params: body,
      });

      setData(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
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
          <div className="bg-[#D5F1EB] row gap-4 p-4 -mx-4 mb-6">
            <IcLogo />
            <p className="text-black70">
              Casan.id - Solusi pengisian daya untuk sepeda dan motor listrik
            </p>
          </div>

          {/* LOCATION */}
          <div className="between-x">
            <div className="inline-flex items-center gap-2 mb-2 bg-primary30 py-2 px-4 rounded-full shadow-lg">
              <IoIosPin size={18} className="text-primary100" />
              <span className="text-black100 font-semibold">
                {detailLocation?.city}
              </span>
            </div>

            <DropdownCheckbox
              selected={filter}
              options={ChargeBrandOption}
              onApply={(s) => setFilter(s)}
            />
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
          <LoadingPage loading={!data?.data && loading}>
            {data?.data &&
              data?.data.map((item, index: number) => (
                <ChargingLocationCard
                  key={index}
                  data={item}
                  loading={loading}
                  currentLocation={currentLocation}
                  isLast={
                    data?.data &&
                    index === data?.data.length - 1 &&
                    page * LIMIT_LIST == data?.data.length
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

export default Home;


