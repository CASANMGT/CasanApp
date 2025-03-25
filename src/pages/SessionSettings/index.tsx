import { clone } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IcEditGreen,
  IcInfoCircleGreen,
  IcRightCircleGreen,
  IcRightGreen,
  IcSocketCircleGreen,
  IcWallet,
} from "../../assets";
import {
  AddSessionBody,
  CalculateChargeBody,
  CalculateDurationBody,
  ChargingStation,
  Device,
  FormDefaultSession,
  FormSession,
  Socket,
} from "../../common";
import {
  BetweenText,
  Button,
  Container,
  InputOTPModal,
  InputPhoneNumberModal,
  LoadingPage,
  ModalInputHour,
  ModalPaymentMethod,
  ModalVoltageAmpere,
  RequestOTPModal,
  Separator,
  Signal,
  SocketItem,
  Tabs,
} from "../../components";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAddSession,
  fetchCalculateCharge,
  fetchCalculateDuration,
  fetchDeviceById,
  fetchMyUser,
  fetchSendOTP,
  hideLoading,
  setFromGlobal,
  showLoading,
} from "../../features";
import {
  formatDuration,
  formatPhoneNumber,
  rupiah,
  useForm,
} from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import PriceInformation from "../ChargingStationDetails/PriceInformation";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";

const costMax: number = 800; //jam

const tabsNominalHour = [
  {
    id: "1",
    label: "Masukkan Nominal",
    content: "",
    // content: <InputNominal />,
  },
  {
    id: "2",
    label: "Masukkan Jam",
    content: "",
    // content: <InputHour />,
  },
];

const SessionSettings = () => {
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();
  const { id } = useParams<{ id?: string }>();

  const global = useSelector((state: RootState) => state.global);
  const addSession = useSelector((state: RootState) => state.addSession);
  const calculateCharge = useSelector(
    (state: RootState) => state.calculateCharge
  );
  const calculateDuration = useSelector(
    (state: RootState) => state.calculateDuration
  );
  const myUser = useSelector((state: RootState) => state.myUser);
  const deviceById = useSelector((state: RootState) => state.deviceById);

  const [form, setForm] = useForm<FormSession>(FormDefaultSession);

  const [openInputHour, setOpenInputHour] = useState<boolean>(false);
  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);
  const [total, setTotal] = useState<string>();
  const [data, setData] = useState<ChargingStation>(location?.state?.data);
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    location?.state?.selectedDevice
  );
  const [openVA, setOpenVA] = useState<boolean>(false);
  const [openInputPhoneNumber, setOpenInputPhoneNumber] =
    useState<boolean>(false);
  const [openRequestOTP, setOpenRequestOTP] = useState<boolean>(false);
  const [openInputOTP, setOpenInputOTP] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyUser());
    if (id) dispatch(fetchDeviceById(id));
  }, []);

  useEffect(() => {
    if (
      id &&
      deviceById?.data?.data &&
      deviceById?.data?.data?.ChargingStation
    ) {
      setData(deviceById?.data?.data?.ChargingStation);
      setSelectedDevice(deviceById?.data?.data);
    }
  }, [deviceById]);

  useEffect(() => {
    if (addSession?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (addSession?.data) {
      navigate(`/transaction-history-details/${addSession?.data?.ID}`, {
        replace: true,
        state: { isGoOrder: true },
      });
    }
  }, [addSession]);

  const onDismiss = () => {
    navigate(-1);
  };

  const getChargingNominal = useCallback(() => {
    let value: number = 0;

    if (form.selectedTab === "1")
      value = Number(form?.nominal.replace("Rp", "").replace(/\./g, ""));
    else if (calculateCharge?.data) value = calculateCharge?.data || 0;

    return value;
  }, [form.selectedTab, form.nominal, calculateCharge?.data]);

  const getTotalPrice = useCallback(() => {
    let value: number = 0;

    if (form?.paymentMethod?.priceType === "percentage") {
      const calculate =
        (chargingNominal * Number(form?.paymentMethod?.value || 0)) / 100;
      value = chargingNominal + calculate;
    } else value = chargingNominal + Number(form.paymentMethod?.value || 0);

    return value;
  }, [
    form.paymentMethod,
    form.selectedTab,
    form.nominal,
    calculateCharge?.data,
  ]);

  const formateCalculate = useCallback(() => {
    let value: string = "";
    if (form.selectedTab === "2" && calculateCharge?.data) {
      value = `Rp${rupiah(calculateCharge?.data)}`;
    } else if (calculateDuration?.data) {
      value = formatDuration(calculateDuration?.data || 0);
    }

    return value;
  }, [
    form?.nominal,
    form.time,
    form.selectedTab,
    calculateCharge?.data,
    calculateDuration?.data,
  ]);

  const FormatPaymentMethod: () => JSX.Element = useCallback(() => {
    if (form?.paymentMethod) {
      const Icon = form?.paymentMethod.icon;
      const isSelectBalance: boolean = form?.balance > 0;

      return (
        <div className="row gap-1">
          {isSelectBalance && (
            <div className="row gap-1">
              <IcWallet className="w-[22px]" />

              <p className="font-medium">{"Saldo Casan"}</p>
            </div>
          )}

          <div className="row gap-1">
            <Icon className="w-[22px]" />

            <p className="font-medium">{form?.paymentMethod.label}</p>
          </div>
        </div>
      );
    } else {
      return (
        <p className="text-xs text-primary100 font-medium">
          Pilih Metode Pembayaran
        </p>
      );
    }
  }, [form?.paymentMethod]);

  const onValidation = () => {
    let message = {
      title: "",
      body: "",
    };

    if (form?.selectedSocket == undefined) {
      message.title = "Pilih Socket Terlebih Dahulu";
      message.body =
        "Silakan pilih Socket sesuai yang akan anda gunakan untuk pengisian";
    } else if (form.selectedTab === "1") {
      if (!form?.nominal) {
        message.title = "Nominal Belum Terpilih";
        message.body = "Masukkan Nominal Terlebih Dahulu";
      } else if (!calculateDuration?.data) {
        message.title = "Durasi Belum Dihitung";
        message.body = "Silakan Hitung Durasi Terlebih Dahulu";
      }
    } else if (form.selectedTab === "2") {
      if (form.time === "00:00") {
        message.title = "Jam Belum Terpilih";
        message.body = "Masukkan Jam Terlebih Dahulu";
      } else if (!calculateCharge?.data) {
        message.title = "Nominal Belum Dihitung";
        message.body = "Silakan Hitung Nominal Terlebih Dahulu";
      }
    } else if (!form.paymentMethod?.key) {
      message.title = "Pilih Metode Pembayaran";
      message.body = "Silakan pilih metode pembayaran";
    }

    if (!message?.title) {
      if (isAuthenticated) onNext();
      else setOpenInputPhoneNumber(true);
    } else showAlert(message);
  };

  const onCalculate = (type: "duration" | "charge") => {
    if (type === "charge") {
      const splitTime = form.time.split(":");
      const duration =
        Number(splitTime[0] || 0) * 3600 + Number(splitTime[1] || 0) * 60;

      const body: CalculateChargeBody = {
        id: data.PriceSettingID,
        vehicle_type: 1,
        duration,
        watt: Number(form?.voltage || 0) * Number(form?.ampere || 0),
      };

      dispatch(fetchCalculateCharge(body));
    } else if (type === "duration") {
      const body: CalculateDurationBody = {
        id: data.PriceSettingID,
        total_charge: Number(form.nominal.replace("Rp", "").replace(/\./g, "")),
        vehicle_type: 1,
        watt: Number(form?.voltage || 0) * Number(form?.ampere || 0),
      };

      dispatch(fetchCalculateDuration(body));
    }
  };

  const onNext = () => {
    const body: AddSessionBody = {
      amount: chargingNominal,
      device_id: selectedDevice?.ID,
      payment_method: form.paymentMethod?.key || "",
      session_method: form.selectedTab === "1" ? 1 : 2,
      socket_id: form?.selectedSocket || 0,
      station_id: data?.ID,
      wallet_used_amount: 0,
    };

    dispatch(fetchAddSession(body));
  };

  const chargingNominal: number = getChargingNominal();
  const totalPrice: number = getTotalPrice();

  let dataSocket: Socket[] | null = null;

  if (selectedDevice?.Sockets && selectedDevice?.Sockets.length) {
    try {
      const cloneData: Socket[] = clone(selectedDevice?.Sockets);
      dataSocket = cloneData.sort((a, b) => a?.Port - b?.Port);
    } catch (error) {}
  }

  return (
    <Container title="Pengaturan Sesi" onDismiss={onDismiss}>
      <LoadingPage loading={deviceById?.loading}>
        <div className="flex-1 flex-col overflow-auto scrollbar-none">
          {/* LOCATION */}
          <div className="p-4 bg-white mb-2">
            <div className="between-x">
              <p className="text-blackBold font-medium">{data?.Name}</p>
              <div>
                <Button
                  type="primary-line"
                  buttonType="sm"
                  label="Kunjungi"
                  iconRight={IcRightGreen}
                  onClick={() => {}}
                />
              </div>
            </div>

            <Separator className="my-3" />

            <div className="between-x">
              <div className="row gap-2">
                <Signal signalValue={selectedDevice?.SignalValue} />

                <p className="text-xs font-medium">
                  {`${selectedDevice?.Name} - ${selectedDevice?.PileNumber}`}
                </p>
              </div>

              <p className="text-xs text-black90">{`Nomor Alat ${selectedDevice?.ID}`}</p>
            </div>
          </div>

          <div className="p-4">
            {/* SELECT SOCKET */}
            <div className="bg-white py-4 px-3 rounded-lg mb-3">
              <div className="row gap-2 mb-2">
                <IcSocketCircleGreen />
                <p className="text-blackBold font-medium">Pilih Socket</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {dataSocket &&
                  dataSocket.map((item, index: number) => (
                    <SocketItem
                      key={index}
                      data={item}
                      position={index + 1}
                      isActive={form?.selectedSocket === item?.ID}
                      onClick={() => {
                        setForm("selectedSocket", item?.ID);
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* INPUT NOMINAL */}
            <div className="bg-white py-4 px-3 rounded-lg mb-3">
              <Tabs
                tabs={tabsNominalHour}
                onSelect={(select) => setForm("selectedTab", select)}
              />

              {form?.selectedTab === "1" ? (
                <InputNominal
                  value={total || ""}
                  description="Silakan masukan nominal pengisian yang sesuai dengan daya pengisian tram"
                  loading={calculateDuration?.loading}
                  dataNominal={["400", "800", "1200", "full"]}
                  balance={myUser?.data?.Balance || 0}
                  form={form}
                  onChange={(value) => {
                    setTotal(value);
                    setForm("nominal", value);
                  }}
                  onCalculate={() => onCalculate("duration")}
                />
              ) : (
                <InputHour
                  value={form.time}
                  loading={calculateCharge?.loading}
                  form={form}
                  onChange={(value) => {
                    const formatted = `Rp${rupiah(
                      (Number(value || 0) / 60) * costMax
                    )}`;
                    setTotal(formatted);
                    setForm("time", value);
                  }}
                  onOpen={() => setOpenInputHour(true)}
                  onCalculate={() => onCalculate("charge")}
                />
              )}
            </div>

            {/* DURATION RANGE */}
            {false && (
              <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
                <div className="row gap-3 mb-2">
                  <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                    <IcInfoCircleGreen />
                  </div>

                  <p className="text-blackBold font-medium">Kisaran Durasi</p>
                </div>

                <p className="text-xs text-black100/70 mb-[14px]">
                  Durasi masih{" "}
                  <span className="text-bold text-xs text-black">
                    perkiraan
                  </span>
                  , bukan angka yang sesungguhnya.
                </p>

                <div className="between-x py-4 px-3 bg-primary100/10 rounded-lg">
                  <div>
                    <p className="text-xs text-black70 mb-2">Spesifikasi:</p>
                    <div
                      onClick={() => setOpenVA(true)}
                      className="row gap-2.5 cursor-pointer"
                    >
                      <p className="font-medium">{`${form?.voltage}V ${form?.ampere}A`}</p>

                      <IcEditGreen />
                    </div>
                  </div>

                  <div className="w-2/5">
                    <p className="text-xs text-black70 mb-2">
                      {form?.selectedTab === "1"
                        ? "Kisaran Durasi:"
                        : "Biaya Pengecasan"}
                    </p>
                    <p className="text-lg font-semibold">
                      {formateCalculate()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* COST INFORMATION */}
            <PriceInformation data={data} isHideParking />

            {/* PAYMENT DETAILS */}
            <div className="bg-white p-3 rounded-lg mt-3 drop-shadow">
              <div className="row gap-3 mb-2">
                <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                  <IcInfoCircleGreen />
                </div>

                <p className="text-blackBold font-medium">Rincian Pembayaran</p>
              </div>

              <BetweenText
                type="medium-content"
                labelLeft="Nominal Pengecasan"
                labelRight={`Rp${rupiah(chargingNominal)}`}
                className="bg-baseLightGray p-3 rounded-t"
              />

              <BetweenText
                type="medium-content"
                labelLeft="Biaya Layanan"
                labelRight={`Rp${rupiah(form.paymentMethod?.value || 0)}`}
                className="p-3"
              />
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="drop-shadow p-4 bg-white">
          <div
            onClick={() => setVisiblePaymentMethod(true)}
            className="between-x cursor-pointer"
          >
            <FormatPaymentMethod />

            <IcRightCircleGreen />
          </div>

          <Separator className="my-2.5" />

          <div className="between-x">
            <p className="text-base text-black100/70">
              Total:{" "}
              <a className="text-blackBold font-bold">{`Rp${rupiah(
                totalPrice
              )}`}</a>
            </p>

            <Button
              className="!w-[130px]"
              label="Bayar"
              onClick={onValidation}
            />
          </div>
        </div>
      </LoadingPage>

      {/* MODAL */}
      <ModalPaymentMethod
        visible={visiblePaymentMethod}
        select={form.paymentMethod}
        selectBalance={form?.balance}
        onDismiss={() => setVisiblePaymentMethod(false)}
        onSelect={(select) => setForm("paymentMethod", select)}
        onSelectBalance={(select) => setForm("balance", select)}
      />

      <ModalVoltageAmpere
        visible={global?.openVA}
        select={{
          voltage: form.voltage,
          ampere: form.ampere,
        }}
        onDismiss={() =>
          dispatch(setFromGlobal({ type: "openVA", value: false }))
        }
        onSelect={(select) => {
          const cloneData = clone(form);
          cloneData.voltage = select?.voltage || 0;
          cloneData.ampere = select?.ampere || 0;

          dispatch(setFromGlobal({ type: "openVA", value: false }));
          setForm("all", cloneData);
        }}
      />

      <ModalInputHour
        open={openInputHour}
        value={form.time}
        onDismiss={() => setOpenInputHour(false)}
        onChange={(value) => {
          setOpenInputHour(false);
          setForm("time", value);
        }}
      />

      <InputPhoneNumberModal
        open={openInputPhoneNumber}
        value={form.phoneNumber}
        onDismiss={() => setOpenInputPhoneNumber(false)}
        onChange={(value) => setForm("phoneNumber", value)}
        onClick={() => {
          setOpenInputPhoneNumber(false);
          setOpenRequestOTP(true);
        }}
      />

      <RequestOTPModal
        open={openRequestOTP}
        phoneNumber={`0${form.phoneNumber}`}
        onDismiss={() => setOpenRequestOTP(false)}
        onClick={() => {
          const formatPhone: string = formatPhoneNumber(`0${form.phoneNumber}`);

          dispatch(fetchSendOTP(formatPhone.replace(/\s+/g, "")));
          setOpenRequestOTP(false);
          setOpenInputOTP(true);
        }}
      />

      <InputOTPModal
        open={openInputOTP}
        phoneNumber={`0${form.phoneNumber}`}
        onDismiss={() => setOpenInputOTP(false)}
      />

      {/* END MODALS */}
    </Container>
  );
};

export default SessionSettings;
