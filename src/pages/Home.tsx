import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcBike, IcPinWhite, ILCarousel1, ILCarousel2 } from "../assets";
import {
  ChargingStationBody,
  GeocodeResult,
  LatLng,
  LIMIT_LIST,
  OptionsProps,
  SessionListBody,
} from "../common";
import {
  Carousel,
  ChargingLocationCard,
  LoadingPage,
  ModalCarouselDetails,
  OngoingItem,
} from "../components";
import { useAuth } from "../context/AuthContext";
import {
  fetchChargingStation,
  fetchOnGoingSessionList,
  setFromGlobal,
} from "../features";
import { getCurrentLocation, getGeoCode } from "../services/ApiAddress";
import { AppDispatch, RootState } from "../store";

const Home = () => {
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

  const [page, setPage] = useState(1);
  const [typeVehicle, setTypeVehicle] = useState<string | number>("bike");
  const [place, setPlace] = useState<string>("terdekat");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [detailLocation, setDetailLocation] = useState<GeocodeResult>();

  useEffect(() => {
    setPage(1);
    getLocation();
    if (isAuthenticated) getOngoing();
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
    const body: SessionListBody = {
      page: 1,
      limit: 10,
      is_finish: 0,
    };
    dispatch(fetchOnGoingSessionList(body));
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
          <div className="row gap-1 mb-2">
            <IcPinWhite />
            <span className="opacity-90 text-white font-semibold">
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
          <Carousel slides={slidesDummy} />

          {/* ONGOING */}
          {isShowOngoing && (
            <div className="bg-white rounded-lg p-3 mt-5">
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

export default Home;

const optionsPlace: OptionsProps[] = [
  { name: "Terdekat", value: "terdekat" },
  { name: "Termurah", value: "termurah" },
  { name: "Tersedia", value: "tersedia" },
];

const optionsTypeVehicle: OptionsProps[] = [
  { name: "Motor", value: "bike", icon: IcBike },
  // { name: "Mobile", value: "car", icon: IcCar },
];

const slidesDummy = [
  {
    id: 1,
    image: ILCarousel1,
    title: "Carousel 1",
    details: {
      validityPeriod: "4 Agustus 2025 00:00 - 31 Agustus 2025 2025 23:59",
      termsCondition: [
        "Voucher berlaku untuk pengguna baru tanpa ada minimal charging.",
        "Diskon hanya berlaku satu kali per transaksi pengecasan.",
        "Tidak dapat digabungkan dengan promo atau voucher lain.",
        "Voucher tidak dapat diuangkan atau dikembalikan dalam bentuk uang.",
        "Berlaku di seluruh stasiun pengecasan resmi yang bekerja sama dengan aplikasi.",
        "Pihak penyedia layanan berhak membatalkan voucher apabila ditemukan kecurangan atau pelanggaran terhadap syarat & ketentuan penggunaan.",
      ],
    },
  },
  {
    id: 1,
    image: ILCarousel2,
    title: "Carousel 2",
    details: {
      validityPeriod: "4 Agustus 2025 00:00 - 31 Agustus 2025 2025 23:59",
      termsCondition: [
        "Voucher berlaku untuk pembayaran dengan minimal charging Rp5.000.",
        "Tunjukkan voucher ke kasir untuk penukaran maksimal 1x24 jam.",
        "Tidak dapat digabungkan dengan promo atau voucher lain.",
        "Voucher tidak dapat diuangkan atau dikembalikan dalam bentuk uang.",
        "Berlaku khusus di stasiun pengecasan Warkop Cerdig.",
        "Pihak penyedia layanan berhak membatalkan voucher apabila ditemukan kecurangan atau pelanggaran terhadap syarat & ketentuan penggunaan.",
      ],
    },
  },
];
