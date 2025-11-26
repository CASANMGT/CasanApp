import { useEffect, useState } from "react";
import { FaChevronRight, FaLock, FaUser } from "react-icons/fa6";
import { FiEdit3, FiNavigation } from "react-icons/fi";
import {
  MdHistory,
  MdInfo,
  MdOutlineStorefront,
  MdPhoneInTalk,
} from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { TbRoute } from "react-icons/tb";
import { WiTime4 } from "react-icons/wi";
import { useNavigate, useParams } from "react-router-dom";
import { ILNoImage, ILPin } from "../../assets";
import { DaysOfWeek, ERROR_MESSAGE, FeeSettingsProps } from "../../common";
import {
  BetweenText,
  Button,
  Header,
  IconText,
  LoadingPage,
  ModalPaymentMethod,
  ModalVehicleDetails,
  Separator,
} from "../../components";
import { moments, openGoogleMaps, openWhatsApp, rupiah } from "../../helpers";
import { Api } from "../../services";
import Container from "./Container";
import Status from "./Status";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchMyUser } from "../../features";
import { useSelector } from "react-redux";

const BookingDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const myUser = useSelector((state: RootState) => state.myUser);

  const [loading, setLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);
  const [data, setData] = useState<RTOProps>();
  const [openVehicleDetails, setOpenVehicleDetails] = useState<boolean>(false);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<FeeSettingsProps>();

  useEffect(() => {
    if (id) {
      if (isAuthenticated) dispatch(fetchMyUser());
      getData();
    } else navigate(-1);
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await Api.get({
        url: `rtos/${id}`,
      });

      setData(res?.data);
    } catch (error: any) {
      const err = error?.response?.data?.message || "";

      if (err === "record not found") {
        alert("Unable to access this RTO.");
        navigate("/home/index");
      } else alert(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const onPayBills = async (select: FeeSettingsProps | undefined) => {
    try {
      setLoadingPay(true);
      if (select?.key) {
        const body: AddTransactionRTOBodyProps = {
          paymentMethod: select?.key,
          paymentProof: "",
          reference: "",
          rtoid: Number(data?.ID ?? 0),
        };

        await Api.post({
          url: "rto-transactions/overdue",
          body,
        });

        getData();
      } else {
        throw new Error("Payment method not found.");
      }
    } catch (error) {
      alert(ERROR_MESSAGE);
    } finally {
      setLoadingPay(false);
    }
  };

  const onBuy = () => {
    if (status === 4 || status === 7) {
      setOpenPaymentMethod(true);
    } else {
      const next =
        status === 2
          ? `/transaction-rto-history/details/${dataTransaction?.ID}`
          : "/buy-credit";

      navigate(next, { state: data });
    }
  };

  const status = data?.Status || 0;
  const dataVehicle: VehicleProps | undefined = data?.Vehicle;
  const color: ColorVehicleModelProps | null = dataVehicle?.Colors?.[0] ?? null;
  const dataVehicleModel: VehicleModelProps | undefined =
    dataVehicle?.VehicleModel;
  const dataStation: ChargingStation | undefined =
    data?.Vehicle?.ChargingStation;
  const operationalHour: OperationalHour | null =
    dataStation?.OperationalHours.filter((e) => !e?.IsClosed)[0] ?? null;
  const dataDayCredit: RTOCreditProps | null =
    data?.DayCredits.filter((e) => e?.DayCount === 1)[0] ?? null;

  const current = data?.CreditPaid || 1;
  const total = data?.Payment || 1;

  const dataTransaction: RTOTransactionProps | undefined = data?.RTOTransactions
    ?.length
    ? data?.RTOTransactions?.reduce((latest, item) => {
        return new Date(item.CreatedAt) > new Date(latest.CreatedAt)
          ? item
          : latest;
      })
    : undefined;

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header
        type="booking"
        title="Detail Booking"
        onDismiss={() => navigate(-1)}
        onPress={() => {}}
      />

      <LoadingPage loading={loading}>
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <div className="flex-1 overflow-auto scrollbar-none space-y-3 px-4 pb-7 pt-6 ">
            <Status status={status} />
            {(status === 2 || status === 3 || status === 4 || status === 7) && (
              <Container className="">
                <div className="between-x mb-2">
                  <span className="text-xs text-blackBold">
                    Tagihan Tersisa
                  </span>
                  <div className="row gap-1.5">
                    <span className="text-xs text-primary100 font-medium">
                      Lihat riwayat
                    </span>
                    <MdHistory size={14} className="text-primary100" />
                  </div>
                </div>

                <div className="row gap-1.5 mb-1">
                  <span className="text-blackBold font-semibold">
                    {data?.CreditLeft || 0}
                  </span>
                  <span className="text-xs text-black90">Kredit Hari</span>
                </div>

                <div className="flex-1 h-3 bg-black10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary100 transition-all duration-300"
                    style={{
                      width: `${(current / total) * 100}%`,
                    }}
                  />
                </div>
                {status !== 2 && (
                  <div className="row gap-1.5 mt-1">
                    <span className="text-xs text-black70">Jatuh Tempo</span>
                    <span className="text-xs ">
                      {moments(data?.NextPaymentDate || undefined)
                        .add(1, "days")
                        .format("DD MMMM YYYY")}
                    </span>
                    {(status === 3 ||
                      status === 4 ||
                      status === 7 ||
                      status === 5) && (
                      <span className="text-xs">{data?.CutOffTime}</span>
                    )}

                    {(status === 4 || status === 7) && (
                      <span className="text-red text-xs font-medium ml-2">
                        Terlambat {data?.OverdueCount || 0} Hari
                      </span>
                    )}
                  </div>
                )}

                <Separator className="my-3" />

                <div className="between-x">
                  <Button
                    label={
                      status === 4 || status === 7
                        ? "Bayar Tagihan"
                        : status === 2
                        ? "Lanjutkan Pembayaran"
                        : "Beli Kredit harian"
                    }
                    iconRight={FaChevronRight}
                    loading={loadingPay}
                    onClick={onBuy}
                    className="flex-1"
                  />

                  <div className="flex-1 row gap-1 center">
                    {(status === 4 || status === 7) && (
                      <>
                        <div className="center rounded-full w-5 h-5 bg-lightRed">
                          <PiWarningCircleFill size={12} className="text-red" />
                        </div>

                        <span className="text-blackBold font-semibold">{`Rp${rupiah(
                          (data?.OverdueCount || 0) *
                            (dataDayCredit?.Price || 1)
                        )}`}</span>
                      </>
                    )}
                  </div>
                </div>
              </Container>
            )}
            <Container className="mt-2">
              <div className="row gap-4 ">
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-blackBold font-semibold">
                    {data?.Vehicle?.VehicleModel?.ModelName || "-"}

                    {(status === 3 ||
                      status === 4 ||
                      status === 5 ||
                      status === 6 ||
                      status === 7) && (
                      <span className="text-black70 font-semibold">{` (${
                        data?.LicensePlate || "-"
                      })`}</span>
                    )}
                  </p>

                  <span className="text-black70 text-xs">{`${dataVehicleModel?.BatteryCapacity}W ${dataVehicleModel?.Volt}V ${dataVehicleModel?.Ampere}Ah (jarak ${dataVehicleModel?.Range}km)`}</span>

                  {status !== 2 && status !== 8 && status !== 10 && (
                    <span
                      onClick={() => setOpenVehicleDetails(true)}
                      className="text-xs text-primary100 font-medium cursor-pointer"
                    >
                      {"Lihat Detail >"}
                    </span>
                  )}
                </div>

                <div className="relative w-[78px] h-[78px]">
                  <img
                    src={color?.ImageURL || ILNoImage}
                    alt="photo"
                    className="w-full h-full rounded-lg bg-baseLightGray "
                  />

                  {(status === 7 || status === 11) && (
                    <div className="center absolute top-0 left-0 right-0 bottom-0 bg-black100/50 rounded-lg">
                      <FaLock size={32} className="text-white z-10" />
                    </div>
                  )}
                </div>
              </div>

              {false && (
                <>
                  <Separator className="my-3" />

                  <div className="row gap-1.5">
                    <div className="flex-1 p-3 h-[70x] flex flex-col justify-center gap-2 bg-baseLightGray rounded-sm">
                      <span className="text-xs text-black90 ">
                        Lokasi Kendaraan
                      </span>
                      <div className="row gap-2">
                        <span className="text-blackBold text-xs font-medium">
                          Tangerang
                        </span>
                        <div className="center w-6 h-6 rounded-full border border-primary100 bg-primary10">
                          <FiNavigation size={12} className="text-primary100" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-3 h-[70x] flex flex-col justify-center gap-2 bg-baseLightGray rounded-sm">
                      <span className="text-xs text-black90 ">
                        Jarak Tempuh Hari ini
                      </span>
                      <span className="text-black100 text-base font-medium">
                        10km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline">
                    <div className="row gap-1.5 bg-primary10 border border-primary100 rounded-full px-3 py-2 mt-3">
                      <span className="text-xs text-primary100 font-medium">
                        Lihat Perjalanan Saya
                      </span>
                      <TbRoute size={12} className="text-primary100" />
                    </div>
                  </div>
                </>
              )}
            </Container>
            {(status === 2 || status === 8 || status === 10) && (
              <Container className="flex flex-col gap-2">
                <span className="text-blackBold">
                  Informasi{" "}
                  {status === 8 || status === 10
                    ? "Pengembalian"
                    : "Pengambilan"}
                </span>

                <div className="row gap-1.5">
                  <span className="text-xs text-black90">ID</span>
                  <span className="text-xs text-blackBold font-medium">
                    {id}
                  </span>
                </div>

                <Separator className="my-1" />

                <div className="flex gap-4">
                  <div className="space-y-2 flex flex-col">
                    <div className="row gap-1">
                      <MdOutlineStorefront
                        size={16}
                        className="text-primary100"
                      />
                      <span className="text-primary100 text-xs font-medium">
                        Alamat{" "}
                        {status === 8 || status === 10
                          ? "Pengembalian"
                          : "Pengambilan"}
                      </span>
                    </div>

                    <span className="text-xs text-blackBold font-medium">
                      {dataStation?.Name || "-"}
                    </span>

                    <span className="text-xs text-black90">
                      {dataStation?.Location?.Address || "-"}
                    </span>
                  </div>

                  <img
                    src={ILPin}
                    alt="Pin"
                    onClick={() =>
                      openGoogleMaps(
                        dataStation?.Location?.Latitude || 0,
                        dataStation?.Location?.Longitude || 0
                      )
                    }
                    className="w-16 h-16 rounded-sm cursor-pointer"
                  />
                </div>

                {status === 2 && (
                  <>
                    {" "}
                    <Separator className="my-1" />
                    <div className="row gap-1">
                      <WiTime4 size={16} className="text-primary100" />
                      <span className="text-primary100 text-xs font-medium">
                        Jam Operasional
                      </span>
                    </div>
                    <div className="row gap-1.5">
                      <span className="text-xs text-black90">Buka:</span>
                      <span className="text-xs text-blackBold font-medium">
                        {operationalHour?.From}
                      </span>
                      <span className="pl-1.5 text-xs text-black90">
                        Tutup:
                      </span>
                      <span className="text-xs text-blackBold font-medium">
                        {operationalHour?.To}
                      </span>
                    </div>
                  </>
                )}

                {status !== 10 && (
                  <>
                    <Separator className="my-1" />

                    <div className="between-x">
                      <span className="text-blackBold font-medium">
                        Hubungi Kami:
                      </span>

                      <div
                        onClick={() => openWhatsApp(dataStation?.Phone || "")}
                        className="row gap-1.5 px-3 py-1.5 bg-primary10 border border-primary100 rounded-full cursor-pointer"
                      >
                        <MdPhoneInTalk size={16} className="text-primary100" />
                        <span className="text-xs text-primary100 font-medium">
                          Dealer
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </Container>
            )}
            {false && (
              <Container>
                <span className="text-blackBold font-medium">
                  Alasan Penolakan
                </span>

                <div className="p-3 mt-4 rounded-sm font-medium bg-baseLightGray">
                  Dokumen Palsu
                </div>
              </Container>
            )}
            {(status === 2 ||
              status === 3 ||
              status === 6 ||
              status === 7 ||
              status === 8 ||
              status === 10) && (
              <Container>
                <IconText
                  icon={MdInfo}
                  label="Informasi Skema RTO"
                  className="mb-3"
                />

                <BetweenText
                  labelLeft="Cicilan"
                  labelRight={`Rp${rupiah(dataDayCredit?.Price || 0)}/hari`}
                  classNameLabelRight="font-semibold"
                  className="p-3 rounded-t bg-baseLightGray"
                />
                <BetweenText
                  labelLeft="Total Pembayaran"
                  labelRight={`(Rp${rupiah(
                    (dataDayCredit?.Price || 0) * (data?.Payment || 0)
                  )}) ${
                    (dataDayCredit?.DayCount || 0) * (data?.Payment || 0)
                  } hari`}
                  classNameLabelRight="font-semibold"
                  className="p-3 "
                />
                <BetweenText
                  labelLeft="Deposit"
                  labelRight={`Rp${rupiah(data?.Deposit || 0)}`}
                  classNameLabelRight="font-semibold"
                  className={`p-3 bg-baseLightGray ${
                    status === 3 && "rounded-b"
                  }`}
                />
                <BetweenText
                  labelLeft="Perkiraan Selesai"
                  labelRight={moments(data?.TargetFinishDate).format(
                    "DD MMMM YYYY"
                  )}
                  classNameLabelRight="font-semibold"
                  className="p-3 "
                />
                <BetweenText
                  labelLeft="Libur Pembayaran"
                  labelRight={`Setiap ${
                    data?.PauseDayType === 1 ? "Hari" : "Tanggal"
                  } ${
                    data?.PauseDayType === 1
                      ? DaysOfWeek[Number(data?.PauseDay || 0)]
                      : data?.PauseDay.split(",").join(", ")
                  }`}
                  classNameLabelRight="font-semibold"
                  className={`p-3 bg-baseLightGray ${
                    status !== 6 && status !== 7 && "rounded-b"
                  }`}
                />
                {status !== 6 && status !== 7 && (
                  <BetweenText
                    labelLeft="Progres"
                    labelRight={`${current}/${total}`}
                    classNameLabelRight="font-semibold"
                    className="p-3 "
                  />
                )}
              </Container>
            )}
            {false && (
              <Container>
                <div className="between-x">
                  <IconText
                    icon={FaUser}
                    label="Biodata Diri"
                    className="flex-1"
                  />

                  <div onClick={() => {}} className="row gap-1 cursor-pointer">
                    <span className="text-xs text-primary100 font-medium">
                      Ubah
                    </span>
                    <FiEdit3 size={12} className="text-primary100" />
                  </div>
                </div>

                <div className="p-3 bg-baseLightGray rounded-sm mt-4 row gap-2">
                  <span className="text-base text-black80">Nama</span>
                  <span className="text-base text-black100 font-medium">
                    Tedy Iman
                  </span>
                  <span className="text-xs text-primary100 font-medium bg-primary10 rounded-sm p-1">
                    Diterima
                  </span>
                </div>
              </Container>
            )}
            {/* {(status === 1 || status === 2) && (
              <Container>
                <IconText
                  icon={MdInfo}
                  label="Informasi Skema RTO"
                  className="mb-3"
                />

                <BetweenText
                  labelLeft="Cicilan"
                  labelRight={`Rp${rupiah(0)}/hari`}
                  classNameLabelRight="font-semibold"
                  className="p-3 rounded-t bg-baseLightGray"
                />
                <BetweenText
                  labelLeft="Total Pembayaran"
                  labelRight={`(Rp${rupiah(0)}) 6 bulan`}
                  classNameLabelRight="font-semibold"
                  className="p-3 "
                />
                <BetweenText
                  labelLeft="Deposit"
                  labelRight={`Rp${rupiah(data?.Deposit || 0)}`}
                  classNameLabelRight="font-semibold"
                  className="p-3 rounded-b bg-baseLightGray"
                />
              </Container>
            )} */}
          </div>
        </div>
      </LoadingPage>

      {/* MODALS */}
      {openVehicleDetails && (
        <ModalVehicleDetails
          isOpen={openVehicleDetails}
          data={dataVehicle}
          onClose={() => setOpenVehicleDetails(false)}
        />
      )}

      {openPaymentMethod && (
        <ModalPaymentMethod
          visible={openPaymentMethod}
          select={paymentMethod}
          selectBalance={myUser?.data?.Balance || 0}
          total={(dataDayCredit?.Price || 0) * (data?.OverdueCount || 0)}
          loading={false}
          label={`Keterlambatan ${data?.OverdueCount || 0} Hari`}
          onDismiss={() => setOpenPaymentMethod(false)}
          onSelect={(select, value) => onPayBills(select)}
        />
      )}
      {/* END MODALS */}
    </div>
  );
};

export default BookingDetails;
