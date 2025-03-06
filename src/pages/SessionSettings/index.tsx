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
} from "../../assets";
import {
  CalculateChargeBody,
  CalculateDurationBody,
  DataChargingStation,
  Device,
  FormDefaultSession,
  FormSession,
} from "../../common";
import {
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
import { fetchCalculateCharge, fetchCalculateDuration } from "../../features";
import {
  formatDuration,
  getIconPaymentMethod,
  getLabelPaymentMethod,
  rupiah,
  useForm,
} from "../../helpers";
import { setFormCharging } from "../../redux";
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
  const { id } = useParams<{ id: string }>();

  const sessionSetting = useSelector(
    (state: RootState) => state.sessionSetting
  );
  const calculateCharge = useSelector(
    (state: RootState) => state.calculateCharge
  );
  const calculateDuration = useSelector(
    (state: RootState) => state.calculateDuration
  );

  const [form, setForm] = useForm<FormSession>(FormDefaultSession);

  const [openInputHour, setOpenInputHour] = useState<boolean>(false);
  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);
  const [time, setTime] = useState<string>();
  const [total, setTotal] = useState<string>();
  const [selectedPayment, setSelectedPayment] = useState<string>();
  const [data, setdata] = useState<DataChargingStation>(location?.state?.data);
  const [selectedDevice, setSelectedDevice] = useState<Device>(
    location?.state?.selectedDevice
  );
  const [openVA, setOpenVA] = useState<boolean>(false);

  useEffect(() => {}, []);

  const onDismiss = () => {
    navigate(-1);
  };
  const formateCalculate = useCallback(() => {
    let value: string = "";
    if (form.selectedTab === "2" && calculateCharge?.data) {
      value = `Rp${rupiah(calculateCharge?.data)}`;
    } else if (calculateDuration?.data) {
      console.log("cek masuk", calculateDuration);

      value = formatDuration(calculateDuration?.data || 0);
    }

    return value;
  }, [form?.nominal, form.time, form.selectedTab, calculateCharge?.data]);

  const FormatPaymentMethod: () => JSX.Element = useCallback(() => {
    if (selectedPayment) {
      const Icon = getIconPaymentMethod(selectedPayment);
      const label = getLabelPaymentMethod(selectedPayment);
      return (
        <div className="row gap-1">
          <Icon className="w-[22px]" />

          <p className="font-medium">{label}</p>
        </div>
      );
    } else {
      return (
        <p className="text-xs text-primary100 font-medium">
          Pilih Metode Pemabayaran
        </p>
      );
    }
  }, [selectedPayment]);

  const validationButton = () => {
    let value: boolean = true;

    if (
      form?.selectedSocket !== undefined &&
      Number(total?.replace("Rp", "").replace(/\./g, "") || 0) > 0 &&
      selectedPayment
    )
      value = false;

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
    const body = {
      deviceId: id,
      price: Number(total?.replace("Rp", "").replace(/\./g, "")),
      port: Number(form?.selectedSocket) + 1,
      paymentMethod: selectedPayment,
    };

    dispatch(
      setFormCharging({
        type: "formData",
        value: body,
      })
    );

    navigate("/charging");
  };

  return (
    <Container title="Pengaturan Sesi" onDismiss={onDismiss}>
      <LoadingPage loading={sessionSetting?.loading}>
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
                      isActive={form?.selectedSocket === index}
                      onClick={() => setForm("selectedSocket", item)}
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
                  loading={false}
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
              Total: <a className="text-blackBold font-bold">{total}</a>
            </p>

            <Button
              className="!w-[130px]"
              label="Bayar"
              disabled={validationButton()}
              onClick={onNext}
            />
          </div>
        </div>
      </LoadingPage>

      {/* MODAL */}
      <ModalPaymentMethod
        visible={visiblePaymentMethod}
        select={selectedPayment || ""}
        onDismiss={() => setVisiblePaymentMethod(false)}
        onSelect={(value) => setSelectedPayment(value)}
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

const setDuration = (second: number) => {
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  const secs = second % 60;

  let value: string;

  if (hours) {
    if (minutes) value = `${hours} jam ${minutes} menit`;
    else value = `${hours} jam`;
  } else if (minutes) value = `${minutes} menit`;
  else value = `${secs} detik`;

  return value;
};
