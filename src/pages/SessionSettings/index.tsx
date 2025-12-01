import { clone } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  IcBattery2,
  IcEditGreen,
  IcInfoCircle,
  IcRightGreen,
  IcSocketCircleGreen,
} from "../../assets";
import {
  ERROR_MESSAGE,
  FormDefaultSession,
  INVALID_TOKEN,
  REGEX_TIME,
  Voucher,
} from "../../common";
import {
  Button,
  Container,
  InputOTPModal,
  InputPhoneNumberModal,
  LoadingPage,
  ModalFullyCharge,
  ModalInputHour,
  ModalInputNominal,
  ModalInputPin,
  ModalInputPower,
  ModalPaymentMethod,
  ModalPriceDetails,
  ModalResetPin,
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
  fetchDeviceById,
  fetchMyUser,
  hideLoading,
  resetDataEditPin,
  resetDataLogin,
  setFromGlobal,
  showLoading,
} from "../../features";
import {
  convertToHours,
  formatPhoneNumber,
  getCurrentSlot,
  openGoogleMaps,
  rupiah,
  timeToSeconds,
  useForm,
} from "../../helpers";
import { Api } from "../../services";
import { AppDispatch, RootState } from "../../store";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";
import InputPower from "./InputPower";

const SessionSettings = () => {
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, logout, login } = useAuth();
  const { showAlert } = useAlert();
  const { id, socketId } = useParams();

  console.log("cek id", id);
  console.log("cek socketId", socketId);

  const global = useSelector((state: RootState) => state.global);
  const dataLogin = useSelector((state: RootState) => state.login);
  const addSession = useSelector((state: RootState) => state.addSession);

  const myUser = useSelector((state: RootState) => state.myUser);
  const deviceById = useSelector((state: RootState) => state.deviceById);
  const checkPin = useSelector((state: RootState) => state.checkPin);
  const editPin = useSelector((state: RootState) => state.editPin);

  const [form, setForm] = useForm<FormSession>(FormDefaultSession);

  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<ChargingStation>(location?.state?.data);
  const [dataCalculateGross, setDataCalculateGross] =
    useState<CalculateGrossProps>();
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    location?.state?.selectedDevice
  );
  const [channel, setChannel] = useState<number>(2);
  const [valueCalculate, setValueCalculate] = useState<number>(0);
  const [loadingCalculate, setLoadingCalculate] = useState<boolean>(false);
  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);
  const [openInputPhoneNumber, setOpenInputPhoneNumber] =
    useState<boolean>(false);
  const [openRequestOTP, setOpenRequestOTP] = useState<boolean>(false);
  const [openInputOTP, setOpenInputOTP] = useState<boolean>(false);
  const [openInputPin, setOpenInputPin] = useState<boolean>(false);
  const [openVoucher, setOpenVoucher] = useState<boolean>(false);
  const [openPriceDetails, setOpenPriceDetails] = useState<boolean>(false);
  const [openVA, setOpenVA] = useState<boolean>(false);
  const [openFullyCharger, setOpenFullyCharger] = useState(false);
  const [openResetPin, setOpenResetPin] = useState(false);
  const [priceType, setPriceType] = useState<number>();
  const [tabs, setTabs] = useState<TabItemProps[]>();
  const [typePriceDetails, setTypePriceDetails] = useState<"fully-charge">();
  const [typeInputPin, setTypeInputPin] = useState<"new-pin" | "">("");
  const [condition, setCondition] = useState<"quick">();

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyUser());
    if (id) {
      dispatch(fetchDeviceById(id));
      if (Number(socketId || 0) > 0) {
        setForm("selectedSocket", Number(socketId || 0));
      }
    }
  }, []);

  useEffect(() => {
    if (data?.ID) {
      const setUp = () => {
        const _priceType: number = data?.PriceSetting?.BikePriceType;

        const newTabs: TabItemProps[] = [
          _priceType === 2 && { id: "power", label: "Daya", content: "" },
          { id: "nominal", label: "Nominal", content: "" },
          _priceType === 1 && {
            id: "duration",
            label: "Duration",
            content: "",
          },
        ].filter(Boolean) as TabItemProps[];

        setTabs(newTabs);
        setPriceType(_priceType);
        setForm("selectedTab", _priceType === 2 ? "power" : "nominal");
      };

      setUp();
    }
  }, [data]);

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
    const sockets = selectedDevice?.Sockets;
    if (
      selectedDevice?.ID &&
      sockets?.length === 1 &&
      sockets?.[0]?.IsCharging === 0
    ) {
      setForm("selectedSocket", sockets[0]?.ID);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (addSession?.loading) dispatch(showLoading());
    else {
      if (openFullyCharger) setOpenFullyCharger(false);
      setLoading(false);
      dispatch(hideLoading());
    }

    if (addSession?.data) {
      setVisiblePaymentMethod(false);
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
      onPay(form, condition);
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

  useEffect(() => {
    const isTime = REGEX_TIME.test(form?.value);
    let v: string | number = "";

    if (isTime) v = convertToHours(form?.value);
    else
      v = form?.value.replace("Rp", "").replace(/\./g, "").replace(" kWh", "");

    if (Number(v || 0) > 0) onCalculate(v);
  }, [form.value, form?.ampere, form?.voltage]);

  useEffect(() => {
    const getCalculateGross = async () => {
      try {
        const res = await Api.post({
          url: "sessions/calculate-gross",
          body: {
            price_setting_id: data?.PriceSetting?.ID,
            amount:
              (myUser?.data?.Balance || 0) > 50000
                ? 50000
                : myUser?.data?.Balance || 0,
          },
        });
        setDataCalculateGross(res?.data);
      } catch (error) {
        alert(ERROR_MESSAGE);
      }
    };

    if (form.selectedSocket) {
      if ((myUser?.data?.Balance || 0) > 1000 && data?.PriceSetting?.ID) {
        setOpenFullyCharger(true);
        getCalculateGross();
      }
    }
  }, [form?.selectedSocket]);

  const onDismiss = () => {
    navigate(-1);
  };

  const getChargingNominal = useCallback(() => {
    let value: number = 0;

    if (form.selectedTab === "nominal")
      value = Number(form.value.replace("Rp", "").replace(/\./g, ""));
    else if (valueCalculate) value = valueCalculate || 0;

    const power: number =
      form?.selectedTab === "nominal"
        ? valueCalculate
        : form?.selectedTab === "power"
        ? Number(form?.value.replace(" kWh", ""))
        : Number(
            (
              Number(form?.voltage?.value || 0) *
              Number(form?.ampere?.value || 0)
            ).toFixed(0) || 0
          );

    const dataOtherFee: OtherFeesProps[] | undefined =
      data?.PriceSetting?.OtherFees;
    const selectedBaseRule: PriceBaseRule | null =
      data?.PriceSetting?.PriceBaseRules.find(
        (item) => power >= item.From && power <= item.To
      ) ?? null;
    const selectedPriceTimeRule: PriceBaseTime | undefined =
      getCurrentSlot(selectedBaseRule);
    const timeSlotFee: number = selectedPriceTimeRule?.Value || 0;
    const totalFee: number = dataOtherFee?.length
      ? dataOtherFee.reduce(
          (sum, item) =>
            sum + (item?.Type === 1 ? item.Value : (item.Value * value) / 100),
          0
        )
      : 0;

    return value + totalFee + timeSlotFee;
  }, [form.value, valueCalculate]);

  const getTotalPrice: () => number = useCallback(() => {
    if (!isShowTotal) return 0;

    const dataOtherFee: OtherFeesProps[] | undefined =
      data?.PriceSetting?.OtherFees;
    const power: number =
      form?.selectedTab === "nominal"
        ? valueCalculate
        : form?.selectedTab === "power"
        ? Number(form?.value.replace(" kWh", ""))
        : Number(
            (
              Number(form?.voltage?.value || 0) *
              Number(form?.ampere?.value || 0)
            ).toFixed(0) || 0
          );

    const selectedBaseRule: PriceBaseRule | null =
      data?.PriceSetting?.PriceBaseRules.find(
        (item) => power >= item.From && power <= item.To
      ) ?? null;
    const selectedPriceTimeRule: PriceBaseTime | undefined =
      getCurrentSlot(selectedBaseRule);

    const totalBasicEnergyPrice: number =
      form?.selectedTab === "nominal"
        ? Number(form?.value.replace("Rp", "").replace(/\./g, ""))
        : valueCalculate;
    const timeSlotFee: number = selectedPriceTimeRule?.Value || 0;
    const totalFee: number = dataOtherFee?.length
      ? dataOtherFee.reduce(
          (sum, item) =>
            sum +
            (item?.Type === 1
              ? item.Value
              : (item.Value * totalBasicEnergyPrice) / 100),
          0
        )
      : 0;
    const milestone: number =
      ((totalBasicEnergyPrice + timeSlotFee + totalFee) *
        (myUser?.data?.Milestone?.DiscountPercent || 0)) /
      100;
    const voucher: number =
      form?.voucher?.data?.VoucherType === 1 ||
      form?.voucher?.data?.VoucherType === 3
        ? form?.voucher?.data?.DiscountType === 1
          ? form?.voucher?.data?.DiscountValue
          : ((totalBasicEnergyPrice + timeSlotFee + totalFee) *
              form?.voucher?.data?.DiscountValue) /
            100
        : 0;
    const pju: number = Number(
      ((totalBasicEnergyPrice * (data?.PriceSetting?.PJU || 0)) / 100).toFixed(
        0
      )
    );
    const subTotal: number = Number(
      (
        totalBasicEnergyPrice +
        timeSlotFee +
        totalFee -
        milestone -
        voucher +
        pju
      ).toFixed(0)
    );
    const ppn: number = Number(
      ((subTotal * (data?.PriceSetting?.PPN || 0)) / 100).toFixed(0)
    );
    const total: number = subTotal + ppn;

    return total >= 0 ? total : 0;
  }, [
    form.paymentMethod,
    form.value,
    valueCalculate,
    form?.voucher,
    myUser?.data?.Milestone,
  ]);

  const onValidation = () => {
    try {
      let message = {
        title: "",
        body: "",
      };

      if (form?.selectedSocket == undefined) {
        message.title = "Pilih Socket Terlebih Dahulu";
        message.body =
          "Silakan pilih Socket sesuai yang akan anda gunakan untuk pengisian";
      } else if (form.selectedTab === "power" && !form?.value) {
        message.title = "Daya Belum Terpilih";
        message.body = "Masukkan Daya Terlebih Dahulu";
      } else if (form.selectedTab === "nominal" && !form?.value) {
        message.title = "Nominal Belum Terpilih";
        message.body = "Masukkan Nominal Terlebih Dahulu";
      } else if (form.selectedTab === "duration" && form.value === "00:00") {
        message.title = "Jam Belum Terpilih";
        message.body = "Masukkan Jam Terlebih Dahulu";
      }

      if (!message?.title) {
        if (isAuthenticated) {
          if (totalPrice === 0) onPay(form);
          else setVisiblePaymentMethod(true);
        } else setOpenInputPhoneNumber(true);
      } else showAlert(message);
    } catch (error) {}
  };

  const onCalculate = async (value: string | number) => {
    try {
      setLoadingCalculate(true);

      if (form?.selectedTab === "nominal") {
        let url: string = "";
        const body: CalculateDurationOrEnergyBody = {
          vehicle_type: selectedDevice?.VehicleType,
        };

        if (priceType === 1) {
          url = "price-settings/calculate-duration";
          body.id = data?.PriceSettingID;
          body.total_charge = Number(value || 0);
          body.watt = Number(
            (
              Number(form?.voltage?.value || 0) *
              Number(form?.ampere?.value || 0)
            ).toFixed(0)
          );
        } else if (priceType === 2) {
          url = "sessions/calculate-energy";
          body.price_setting_id = data?.PriceSettingID;
          body.charge = Number(value || 0);
          body.watt = selectedDevice?.SocketRating;
        }

        const res = await Api.post({
          url,
          body,
        });

        setValueCalculate(res?.data?.energy_kwh || res?.data?.duration || 0);
      } else if (form?.selectedTab === "duration") {
        const splitTime = form?.value.split(":");
        const duration =
          Number(splitTime[0] || 0) * 3600 + Number(splitTime[1] || 0) * 60;

        const body: CalculateChargeBody = {
          id: data.PriceSettingID,
          vehicle_type: selectedDevice?.VehicleType,
          duration,
          watt: Number(
            (
              Number(form?.voltage?.value || 0) *
              Number(form?.ampere?.value || 0)
            ).toFixed(0)
          ),
        };
        const res = await Api.post({
          url: "price-settings/calculate-charge",
          body,
        });

        setValueCalculate(res?.data?.charge || 0);
      } else if (form?.selectedTab === "power") {
        const body: CalculateChargeBody = {
          energy: Number(value || 0),
          price_setting_id: data?.PriceSettingID,
          vehicle_type: selectedDevice?.VehicleType,
          watt: selectedDevice?.SocketRating,
        };

        const res = await Api.post({
          url: "sessions/calculate-charge",
          body,
        });

        setValueCalculate(res?.data?.charge || 0);
      }

      setLoadingCalculate(false);
    } catch (error) {
      alert(ERROR_MESSAGE);
      setLoadingCalculate(false);
    }
  };

  const onPay = (select: FormSession, type?: "quick") => {
    try {
      setLoading(true);
      const amount =
        type === "quick"
          ? dataCalculateGross?.ChargingUsage || 0
          : form.selectedTab === "nominal"
          ? Number(form.value.replace("Rp", "").replace(/\./g, ""))
          : valueCalculate || 0;

      const paid_kwh: number =
        type === "quick"
          ? dataCalculateGross?.KwhUsed || 0
          : form.selectedTab === "power"
          ? Number(form.value.replace(" kWh", ""))
          : valueCalculate || 0;

      const body: AddSessionBody = {
        amount,
        paid_kwh,
        device_id: selectedDevice?.ID,
        payment_method:
          type === "quick"
            ? "BALANCE_FU"
            : totalPrice > 0 && select.paymentMethod?.key
            ? select.paymentMethod?.key
            : "BALANCE_FU",
        session_method: select?.selectedTab === "duration" ? 2 : 1,
        socket_id: select?.selectedSocket || 0,
        station_id: data?.ID,
        voucher_id: [Number(form?.voucher?.value)],
        wallet_used_amount: Math.floor(
          type === "quick"
            ? dataCalculateGross?.Total || 0
            : select?.balance || 0
        ),
      };

      dispatch(fetchAddSession(body));
    } catch (error) {}
  };

  const isShowTotal = useMemo(
    () =>
      Number(
        form?.value.replace("Rp", "").replace(/\./g, "").replace(" kWh", "")
      ) > 0,
    [form?.value]
  );
  const chargingNominal: number = getChargingNominal();
  const totalPrice: number = getTotalPrice();

  let dataSocket: Socket[] | null = null;

  if (selectedDevice?.Sockets && selectedDevice?.Sockets.length) {
    try {
      const cloneData: Socket[] = clone(selectedDevice?.Sockets);
      dataSocket = cloneData.sort((a, b) => a?.Port - b?.Port);
    } catch (error) {}
  }

  const onFullyCharge = (socketId: number) => {
    setForm("selectedSocket", socketId);
  };

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

          <div className="bg-primary10 between-x px-4">
            <div className="row gap-1.5">
              <IcInfoCircle className="w-5 text-primary100" />

              <p className="text-primary100 font-medium">
                Charger tidak boleh melebihi{" "}
                <span className="font-semibold">
                  {getLabelWatt(selectedDevice?.MaxWatt)}
                </span>
              </p>
            </div>

            {!!data?.Devices?.some((e) => e?.Protocol === 3) && (
              <div className="row gap-1.5">
                <IcBattery2 className="text-primary100" />
                <span className="text-xs font-medium">Ultra Fast Charging</span>
              </div>
            )}
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
                      onClick={() => onFullyCharge(item?.ID)}
                    />
                  ))}
              </div>
            </div>

            {/* INPUT NOMINAL */}
            <div className="bg-white py-4 px-3 rounded-lg mb-3">
              {tabs && (
                <Tabs
                  active={form?.selectedTab}
                  tabs={tabs}
                  onSelect={(select) => {
                    const cloneData = clone(form);
                    cloneData.selectedTab = select;
                    cloneData.value = "";

                    setValueCalculate(0);
                    setForm("all", cloneData);
                  }}
                />
              )}

              {form?.selectedTab === "nominal" && (
                <InputNominal
                  value={form.value}
                  form={form}
                  calculate={valueCalculate}
                  priceType={priceType}
                  onChange={(value) => {
                    const cloneData = clone(form);
                    cloneData.value = value;
                    cloneData.voucher = undefined;

                    setForm("all", cloneData);
                  }}
                />
              )}

              {form?.selectedTab === "duration" && (
                <InputHour
                  value={form.value || "00:00"}
                  form={form}
                  calculate={valueCalculate}
                  onChange={(value) => {
                    const cloneData = clone(form);
                    cloneData.value = value;
                    cloneData.voucher = undefined;

                    setForm("all", cloneData);
                  }}
                />
              )}

              {form?.selectedTab === "power" && (
                <InputPower
                  value={form.value}
                  form={form}
                  calculate={valueCalculate}
                  onChange={(value) => {
                    const cloneData = clone(form);
                    cloneData.value = value;
                    cloneData.voucher = undefined;

                    setForm("all", cloneData);
                  }}
                />
              )}

              <Separator className="my-4" />

              {priceType === 1 && (
                <div className="between-x p-3 rounded-lg bg-primary10 ">
                  <span className="text-xs text-black70">Spesifikasi:</span>
                  <div className="row font-medium">
                    <span className="text-xs">{form.voltage?.name}</span>
                    <span className="text-xs ml-1.5 mr-3">
                      {form.ampere?.name}
                    </span>
                    <span className="text-xs mr-2.5">{`${(
                      Number(form?.voltage?.value || 0) *
                      Number(form?.ampere?.value || 0)
                    ).toFixed(0)}W`}</span>
                    <div
                      onClick={() => setOpenVA(true)}
                      className="cursor-pointer"
                    >
                      <IcEditGreen />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-5">
                <span
                  onClick={() => {
                    if (isShowTotal) setOpenPriceDetails(true);
                  }}
                  className={`font-medium ${
                    isShowTotal
                      ? "text-primary100 cursor-pointer"
                      : "text-black50 cursor-not-allowed"
                  }`}
                >
                  {"Lihat Rincian ->"}
                </span>
              </div>
            </div>
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
              loading={false}
              label="Bayar"
              onClick={onValidation}
            />
          </div>
        </div>
      </LoadingPage>

      {/* MODAL */}
      <>
        {visiblePaymentMethod && (
          <ModalPaymentMethod
            visible={visiblePaymentMethod}
            select={form.paymentMethod}
            selectBalance={form?.balance}
            total={totalPrice}
            loading={loading || addSession?.loading}
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
        )}

        {global?.openInputNominal && (
          <ModalInputNominal
            open={global?.openInputNominal}
            value={form.value}
            balance={myUser?.data?.Balance || 0}
            onDismiss={() => onHideModal("openInputNominal")}
            onChangeText={(value) => {
              onHideModal("openInputNominal");
              setForm("value", value);
            }}
          />
        )}

        {global?.openInputHour && (
          <ModalInputHour
            open={global?.openInputHour}
            value={form.value}
            onDismiss={() => onHideModal("openInputHour")}
            onChange={(value) => {
              onHideModal("openInputHour");
              setForm("value", value);
            }}
          />
        )}

        {global?.openInputPower && (
          <ModalInputPower
            open={global?.openInputPower}
            value={form.value}
            onDismiss={() => onHideModal("openInputPower")}
            onChange={(value) => {
              onHideModal("openInputPower");
              setForm("value", value);
            }}
          />
        )}

        {openVA && (
          <ModalVoltageAmpere
            visible={openVA}
            select={{
              voltage: form.voltage,
              ampere: form.ampere,
            }}
            onDismiss={() => setOpenVA(false)}
            onSelect={(select) => {
              const cloneData = clone(form);
              cloneData.voltage = select?.voltage || undefined;
              cloneData.ampere = select?.ampere || undefined;

              setOpenVA(false);
              setForm("all", cloneData);
            }}
          />
        )}

        {openInputPhoneNumber && (
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
        )}
        {openRequestOTP && (
          <RequestOTPModal
            open={openRequestOTP}
            phoneNumber={`0${form.phoneNumber}`}
            onDismiss={() => setOpenRequestOTP(false)}
            onClick={async () => {
              const formatPhone: string = formatPhoneNumber(
                `0${form.phoneNumber}`
              );

              await Api.post({
                url: "send-otp",
                body: {
                  phone_number: formatPhone.replace(/\s+/g, ""),
                  channel,
                },
              });

              // setChannel((prev) => (prev === 1 ? 2 : 1));
              setOpenRequestOTP(false);
              setOpenInputOTP(true);
            }}
          />
        )}

        {openInputOTP && (
          <InputOTPModal
            open={openInputOTP}
            phoneNumber={`0${form.phoneNumber}`}
            onDismiss={() => setOpenInputOTP(false)}
          />
        )}

        {openInputPin && (
          <ModalInputPin
            type={typeInputPin}
            isOpen={openInputPin}
            onDismiss={() => setOpenInputPin(false)}
            onReset={() => {
              if (typeInputPin) setTypeInputPin("");
              setOpenInputPin(false);
              setOpenResetPin(true);
            }}
          />
        )}

        {openResetPin && (
          <ModalResetPin
            isOpen={openResetPin}
            data={myUser?.data}
            onDismiss={() => setOpenResetPin(false)}
            onConfirm={() => {
              setTypeInputPin("new-pin");
              setOpenInputPin(true);
            }}
          />
        )}

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
            data={global?.data?.data}
            onDismiss={() => onHideModal("openSKVoucher")}
          />
        )}

        {openFullyCharger && (
          <ModalFullyCharge
            isOpen={openFullyCharger}
            loading={loading || addSession?.loading}
            dataPriceSetting={data?.PriceSetting}
            data={dataCalculateGross}
            onClose={() => setOpenFullyCharger(false)}
            onClick={() => {
              setCondition("quick");
              setOpenInputOTP(true);
            }}
          />
        )}

        {openPriceDetails && (
          <ModalPriceDetails
            type={typePriceDetails}
            isOpen={openPriceDetails}
            dataUser={myUser?.data}
            dataPriceSetting={data?.PriceSetting}
            dataVoucher={form?.voucher?.data}
            dataDevice={selectedDevice}
            power={
              form?.selectedTab === "nominal"
                ? valueCalculate
                : form?.selectedTab === "power"
                ? form?.value.replace(" kWh", "")
                : Number(
                    (
                      Number(form?.voltage?.value || 0) *
                      Number(form?.ampere?.value || 0)
                    ).toFixed(0) || 0
                  )
            }
            duration={
              form.selectedTab === "duration"
                ? timeToSeconds(form?.value || "00:00")
                : valueCalculate
            }
            price={
              form?.selectedTab === "nominal"
                ? form?.value.replace("Rp", "").replace(/\./g, "")
                : valueCalculate
            }
            onClose={() => setOpenPriceDetails(false)}
          />
        )}
      </>
      {/* END MODALS */}
    </Container>
  );
};

export default SessionSettings;

const getLabelWatt = (value: number) => {
  let label: string = "";

  if (value >= 1000) label = `${value / 1000}kW`;
  else label = `${value}W`;

  return label;
};

const formatDiscount = (data: OptionsProps | undefined, nominal: number) => {
  const dataVoucher: Voucher = data?.data;
  let value: string = "";

  if (data?.value) {
    if (dataVoucher?.VoucherType === 1 || dataVoucher?.VoucherType === 3) {
      value = `${dataVoucher?.VoucherName} (disc Rp${rupiah(
        dataVoucher?.DiscountType === 1
          ? dataVoucher?.DiscountValue
          : (nominal * dataVoucher?.DiscountValue) / 100
      )})`;
    } else {
      value = dataVoucher?.VoucherName;
    }
  }

  return value;
};
