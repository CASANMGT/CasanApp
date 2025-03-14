import { clone } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import {
  IcEditGreen,
  IcInfoCircleGreen,
  IcRightCircleGreen,
  IcRightGreen,
  IcSocketCircleGreen,
} from "../../assets";
import {
  AddSessionBody,
  CalculateChargeBody,
  CalculateDurationBody,
  DataChargingStation,
  Device,
  FormDefaultSession,
  FormSession,
} from "../../common";
import {
  BetweenText,
  Button,
  Container,
  LoadingPage,
  ModalInputHour,
  ModalPaymentMethod,
  ModalVoltageAmpere,
  Separator,
  Signal,
  SocketItem,
  Tabs,
} from "../../components";
import {
  fetchAddSession,
  fetchCalculateCharge,
  fetchCalculateDuration,
  hideLoading,
  showLoading,
} from "../../features";
import { formatDuration, rupiah, useForm } from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import PriceInformation from "../ChargingStationDetails/PriceInformation";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";

const costMax: number = 800; //jam

const tabsNominalHour = [
  {
    id: "1",
    label: "Masukan Nominal",
    content: "",
    // content: <InputNominal />,
  },
  {
    id: "2",
    label: "Masukan Jam",
    content: "",
    // content: <InputHour />,
  },
];

const SessionSettings = () => {
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const calculateCharge = useSelector(
    (state: RootState) => state.calculateCharge
  );
  const addSession = useSelector((state: RootState) => state.addSession);
  const calculateDuration = useSelector(
    (state: RootState) => state.calculateDuration
  );

  const [form, setForm] = useForm<FormSession>(FormDefaultSession);

  const [openInputHour, setOpenInputHour] = useState<boolean>(false);
  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);
  const [total, setTotal] = useState<string>();
  const [data] = useState<DataChargingStation>(location?.state?.data);
  const [selectedDevice] = useState<Device>(location?.state?.selectedDevice);
  const [openVA, setOpenVA] = useState<boolean>(false);

  useEffect(() => {
    if (addSession?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (addSession?.data) {
      navigate(`/transaction-history-details/session/${addSession?.data?.ID}`);
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
      return (
        <div className="row gap-1">
          <Icon className="w-[22px]" />

          <p className="font-medium">{form?.paymentMethod.label}</p>
        </div>
      );
    } else {
      return (
        <p className="text-xs text-primary100 font-medium">
          Pilih Metode Pemabayaran
        </p>
      );
    }
  }, [form?.paymentMethod]);

  const validation = () => {
    let value: boolean = true;

    if (
      form?.selectedSocket !== undefined &&
      Number(total?.replace("Rp", "").replace(/\./g, "") || 0) > 0 &&
      form.paymentMethod
    ) {
      if (form.selectedTab === "1") {
        if (calculateDuration?.data && form.nominal) value = false;
      } else if (
        form.selectedTab === "2" &&
        (Number(form.time[0]) || Number(form.time[1]))
      ) {
        if (calculateCharge?.data) value = false;
      }
    }

    return value;
  };

  const onCalculate = (type: "duration" | "charge") => {
    if (type === "charge") {
      const duration =
        Number(form?.time[0] || 0) * 3600 + Number(form?.time[1] || 0) * 60;

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

  return (
    <Container title="Pengaturan Sesi" onDismiss={onDismiss}>
      <LoadingPage loading={false}>
        <div className="flex-1 flex-col overflow-auto scrollbar-none">
          {/* LOCATION */}
          <div className="p-4 bg-white mb-2">
            <div className="between-x">
              <p className="text-blackBold font-medium">
                {data?.Location?.Mark || data?.Location?.Name || "-"}
              </p>
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

                <p className="text-xs font-medium">{selectedDevice?.Name}</p>
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
                {selectedDevice?.Sockets &&
                  selectedDevice?.Sockets.map((item, index: number) => (
                    <SocketItem
                      key={index}
                      data={item}
                      position={index + 1}
                      isActive={form?.selectedSocket === item?.ID}
                      onClick={() => {
                        console.log("cek ", item);

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
            <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
              <div className="row gap-3 mb-2">
                <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                  <IcInfoCircleGreen />
                </div>

                <p className="text-blackBold font-medium">Kisaran Durasi</p>
              </div>

              <p className="text-xs text-black100/70 mb-[14px]">
                Durasi masih{" "}
                <span className="text-bold text-xs text-black">perkiraan</span>,
                bukan angka yang sesungguhnya.
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
                  <p className="text-lg font-semibold">{formateCalculate()}</p>
                </div>
              </div>
            </div>

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
                labelRight={`Rp${rupiah(0)}`}
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
                chargingNominal
              )}`}</a>
            </p>

            <Button
              className="!w-[130px]"
              label="Bayar"
              disabled={validation()}
              onClick={onNext}
            />
          </div>
        </div>
      </LoadingPage>

      {/* MODAL */}
      <ModalPaymentMethod
        visible={visiblePaymentMethod}
        select={form.paymentMethod}
        onDismiss={() => setVisiblePaymentMethod(false)}
        onSelect={(select) => setForm("paymentMethod", select)}
      />

      <ModalVoltageAmpere
        visible={openVA}
        select={{
          voltage: form.voltage,
          ampere: form.ampere,
        }}
        onDismiss={() => setOpenVA(false)}
        onSelect={(select) => {
          const cloneData = clone(form);
          cloneData.voltage = select?.voltage || 0;
          cloneData.ampere = select?.ampere || 0;

          setOpenVA(false);
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
    </Container>
  );
};

export default SessionSettings;
