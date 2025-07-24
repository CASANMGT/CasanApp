import { clone } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { HiOutlineTicket } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IcInfoCircle,
  IcInfoCircleGreen,
  IcRightGreen,
  IcSocketCircleGreen,
} from "../../assets";
import {
  AddSessionBody,
  CalculateChargeBody,
  CalculateDurationBody,
  ChargingStation,
  Device,
  FormDefaultSession,
  FormSession,
  INVALID_TOKEN,
  NOMINAL_SESSION,
  OptionsProps,
  Socket,
  Voucher,
} from "../../common";
import {
  BetweenText,
  Button,
  Container,
  InputOTPModal,
  InputPhoneNumberModal,
  LoadingPage,
  ModalInputHour,
  ModalInputNominal,
  ModalInputPin,
  ModalPaymentMethod,
  ModalSKVoucher,
  ModalVoltageAmpere,
  ModalVoucher,
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
  resetDataCalculateCharge,
  resetDataCalculateDuration,
  resetDataEditPin,
  resetDataLogin,
  setFromGlobal,
  showLoading,
} from "../../features";
import {
  formatPhoneNumber,
  openGoogleMaps,
  rupiah,
  useForm,
} from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import PriceInformation from "../ChargingStationDetails/PriceInformation";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";

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
  const { isAuthenticated, logout, login } = useAuth();
  const { showAlert } = useAlert();
  const { id } = useParams<{ id?: string }>();

  const global = useSelector((state: RootState) => state.global);
  const dataLogin = useSelector((state: RootState) => state.login);
  const addSession = useSelector((state: RootState) => state.addSession);
  const calculateCharge = useSelector(
    (state: RootState) => state.calculateCharge
  );
  const myUser = useSelector((state: RootState) => state.myUser);
  const deviceById = useSelector((state: RootState) => state.deviceById);
  const checkPin = useSelector((state: RootState) => state.checkPin);
  const editPin = useSelector((state: RootState) => state.editPin);

  const [form, setForm] = useForm<FormSession>(FormDefaultSession);

  const [loading, setLoading] = useState<boolean>(false);
  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);
  const [data, setData] = useState<ChargingStation>(location?.state?.data);
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    location?.state?.selectedDevice
  );
  const [openInputPhoneNumber, setOpenInputPhoneNumber] =
    useState<boolean>(false);
  const [openRequestOTP, setOpenRequestOTP] = useState<boolean>(false);
  const [openInputOTP, setOpenInputOTP] = useState<boolean>(false);
  const [openInputPin, setOpenInputPin] = useState<boolean>(false);
  const [openVoucher, setOpenVoucher] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyUser());
    if (id) dispatch(fetchDeviceById(id));

    dispatch(resetDataCalculateCharge());
    dispatch(resetDataCalculateDuration());
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
      if (addSession?.data?.Transaction?.Status === 1) {
        navigate(`/charging/${addSession?.data?.ID}`, {
          replace: true,
          state: { isGoOrder: true },
        });
      } else
        navigate(
          `/transaction-history/details/${addSession?.data?.TransactionID}`,
          {
            replace: true,
            state: { isGoOrder: true },
          }
        );
    }
  }, [addSession]);

  useEffect(() => {
    if (myUser?.error === INVALID_TOKEN) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [myUser?.error]);

  useEffect(() => {
    if (form.time !== "00:00" && form.selectedTab === "2")
      onCalculate("charge");
  }, [form.time, form?.ampere, form?.voltage]);

  useEffect(() => {
    if (form.nominal && form.nominal !== "Rp0" && form.selectedTab === "1") {
      onCalculate("duration");
    }
  }, [form.nominal, form?.ampere, form?.voltage]);

  useEffect(() => {
    if (dataLogin?.data) {
      dispatch(resetDataLogin());
      login();
      setOpenInputOTP(false);
      setVisiblePaymentMethod(true);
      navigate("/session-settings");
    }
  }, [dataLogin?.data]);

  // manage response check pin
  useEffect(() => {
    if (checkPin?.data?.data?.is_match) {
      onPay(form);
    }
  }, [checkPin]);

  // manage response edit pin
  useEffect(() => {
    if (editPin?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (editPin?.data) {
      dispatch(resetDataEditPin());
      onPay(form);
    }
  }, [editPin]);

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

  const onValidation = () => {
    let message = {
      title: "",
      body: "",
    };

    if (form?.selectedSocket == undefined) {
      message.title = "Pilih Socket Terlebih Dahulu";
      message.body =
        "Silakan pilih Socket sesuai yang akan anda gunakan untuk pengisian";
    } else if (form.selectedTab === "1" && !form?.nominal) {
      message.title = "Nominal Belum Terpilih";
      message.body = "Masukkan Nominal Terlebih Dahulu";
    } else if (form.selectedTab === "2" && form.time === "00:00") {
      message.title = "Jam Belum Terpilih";
      message.body = "Masukkan Jam Terlebih Dahulu";
    }

    if (!message?.title) {
      if (isAuthenticated) setVisiblePaymentMethod(true);
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
        watt: Number(
          (
            Number(form?.voltage?.value || 0) * Number(form?.ampere?.value || 0)
          ).toFixed(0)
        ),
      };

      dispatch(fetchCalculateCharge(body));
    } else if (type === "duration") {
      const body: CalculateDurationBody = {
        id: data.PriceSettingID,
        total_charge: Number(form.nominal.replace("Rp", "").replace(/\./g, "")),
        vehicle_type: 1,
        watt: Number(
          (
            Number(form?.voltage?.value || 0) * Number(form?.ampere?.value || 0)
          ).toFixed(0)
        ),
      };

      dispatch(fetchCalculateDuration(body));
    }
  };

  const onPay = (select: FormSession) => {
    const body: AddSessionBody = {
      amount: chargingNominal,
      device_id: selectedDevice?.ID,
      payment_method: select.paymentMethod?.key || "BALANCE_FU",
      session_method: select.selectedTab === "1" ? 1 : 2,
      socket_id: select?.selectedSocket || 0,
      station_id: data?.ID,
      voucher_id: [Number(form?.voucher?.value)],
      wallet_used_amount: select?.balance,
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

  const onHideModal = (type: string) => {
    dispatch(
      setFromGlobal({
        type,
        value: false,
      })
    );
  };

  return (
    <Container title="Pengaturan Sesi" onDismiss={onDismiss}>
      <LoadingPage loading={deviceById?.loading}>
        <div className="flex-1 flex-col overflow-auto scrollbar-none">
          {/* LOCATION */}
          <div className="p-4 bg-white ">
            <div className="between-x">
              <p className="text-blackBold font-medium">{data?.Name}</p>
              <div>
                <Button
                  type="primary-line"
                  buttonType="sm"
                  label="Kunjungi"
                  iconRight={IcRightGreen}
                  onClick={() =>
                    openGoogleMaps(
                      data?.Location?.Latitude,
                      data?.Location?.Longitude
                    )
                  }
                />
              </div>
            </div>

            <Separator className="my-3" />

            <div className="between-x">
              <div className="row gap-2">
                <Signal signalValue={selectedDevice?.SignalValue} />

                <p className="text-xs font-medium">{selectedDevice?.Name}</p>
              </div>

              <p className="text-xs text-black90">{`Nomor Alat ${selectedDevice?.ID}`}</p>
            </div>
          </div>

          <div className="bg-primary10 row gap-1.5 px-4">
            <IcInfoCircle className="w-5 text-primary100" />

            <p className="text-primary100 font-medium">
              Charger tidak boleh melebihi{" "}
              <span className="font-semibold">
                {getLabelWatt(selectedDevice?.MaxWatt)}
              </span>
            </p>
          </div>

          <div className="p-4 mt-2">
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
                  form={form}
                  description="Silakan masukkan nominal pengisian yang sesuai dengan kebutuhan anda"
                  dataNominal={NOMINAL_SESSION}
                  balance={myUser?.data?.Balance || 0}
                  onChange={(value) => {
                    const cloneData = clone(form);
                    cloneData.nominal = value;
                    cloneData.voucher = undefined;

                    setForm("all", cloneData);
                  }}
                />
              ) : (
                <InputHour
                  value={form.time}
                  form={form}
                  onChange={(value) => {
                    const cloneData = clone(form);
                    cloneData.time = value;
                    cloneData.voucher = undefined;

                    setForm("all", cloneData);
                  }}
                />
              )}
            </div>

            {/* PAYMENT DETAILS */}
            <div className="bg-white p-3 rounded-lg my-3 drop-shadow">
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

            {/* <div
              onClick={() => {}}
              className="row gap-3 mt-[22px] mb-5 cursor-pointer"
            >
              <span className="text-primary100 font-medium">
                Informasi biaya
              </span>
              <div className="w-[22px] h-[22px] rounded-full bg-primary10 center">
                <IcRightCircleGreen />
              </div>
            </div> */}

            {/* COST INFORMATION */}
            {/* DUMMY */}
            {false && <PriceInformation data={data} isHideParking />}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="drop-shadow p-4 bg-white">
          <div className="between-x">
            <div className="row gap-2">
              <HiOutlineTicket className="text-primary100" size={16} />
              <span className="font-medium text-blackBold">Voucher</span>
            </div>

            <button
              type="button"
              onClick={() => setOpenVoucher(true)}
              className="row gap-2"
            >
              {form?.voucher?.value ? (
                <p className="border border-primary100 text-[10px] text-primary100 py-0.5 px-1 bg-primary10 font-medium">
                  {formatDiscount(form.voucher, chargingNominal)}
                </p>
              ) : (
                <span className="text-black90">Pilih Voucher</span>
              )}
              <FaChevronRight size={12} className="" />
            </button>
          </div>

          <Separator className="my-3" />

          <div className="between-x">
            <p className="text-base text-black100/70">
              Total:{" "}
              <a className="text-blackBold font-bold">{`Rp${rupiah(
                totalPrice
              )}`}</a>
            </p>

            <Button
              className="!w-[130px]"
              loading={loading}
              label="Bayar"
              onClick={onValidation}
            />
          </div>
        </div>
      </LoadingPage>

      {/* MODAL */}
      <>
        <ModalPaymentMethod
          visible={visiblePaymentMethod}
          select={form.paymentMethod}
          selectBalance={form?.balance}
          total={chargingNominal}
          onDismiss={() => setVisiblePaymentMethod(false)}
          onSelect={(select, value) => {
            const cloneData = clone(form);
            cloneData.paymentMethod = select;
            cloneData.balance = value || 0;

            setForm("all", cloneData);

            if (cloneData?.balance > 0) {
              setVisiblePaymentMethod(false);
              setOpenInputPin(true);
            } else onPay(cloneData);
          }}
        />
        <ModalVoltageAmpere
          visible={global?.openVA}
          select={{
            voltage: form.voltage,
            ampere: form.ampere,
          }}
          onDismiss={() => onHideModal("openVA")}
          onSelect={(select) => {
            const cloneData = clone(form);
            cloneData.voltage = select?.voltage || undefined;
            cloneData.ampere = select?.ampere || undefined;

            onHideModal("openVA");
            setForm("all", cloneData);
          }}
        />
        <ModalInputNominal
          open={global?.openInputNominal}
          value={form.nominal}
          balance={myUser?.data?.Balance || 0}
          onDismiss={() => onHideModal("openInputNominal")}
          onChangeText={(value) => {
            onHideModal("openInputNominal");
            setForm("nominal", value);
          }}
        />
        <ModalInputHour
          open={global?.openInputHour}
          value={form.time}
          onDismiss={() => onHideModal("openInputHour")}
          onChange={(value) => {
            onHideModal("openInputHour");
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
            const formatPhone: string = formatPhoneNumber(
              `0${form.phoneNumber}`
            );

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
        <ModalInputPin
          isOpen={openInputPin}
          onDismiss={() => setOpenInputPin(false)}
        />

        {openVoucher && (
          <ModalVoucher
            visible={openVoucher}
            select={form?.voucher}
            total={chargingNominal}
            userId={myUser?.data?.ID}
            chargingStationID={data?.ID}
            onDismiss={() => setOpenVoucher(false)}
            onSelect={(select) => {
              setOpenVoucher(false);
              setForm("voucher", select);
            }}
          />
        )}

        {global?.openSKVoucher && (
          <ModalSKVoucher
            visible={global?.openSKVoucher}
            data={global?.data}
            onDismiss={() => onHideModal("openSKVoucher")}
          />
        )}
      </>
      {/* END MODALS */}
    </Container>
  );
};

export default SessionSettings;

export const getLabelWatt = (value: number) => {
  let label: string = "";

  if (value >= 1000) label = `${value / 1000}kW`;
  else label = `${value}W`;

  return label;
};

const formatDiscount = (data: OptionsProps | undefined, nominal: number) => {
  const dataVoucher: Voucher = data?.data;
  let value: string = "";

  if (data?.value) {
    if (dataVoucher?.VoucherType === 1) {
      value = `Pot. Harga ${
        dataVoucher?.DiscountType === 1
          ? dataVoucher?.DiscountValue
          : (nominal * dataVoucher?.DiscountValue) / 100
      }`;
    } else {
      value = dataVoucher?.VoucherName;
    }
  }

  return value;
};
