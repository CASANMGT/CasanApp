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
import { REGEX_NUMBERS } from "../../common";
import {
  Button,
  Container,
  CostInformationItem,
  LoadingPage,
  Separator,
  SocketItem,
  Tabs,
} from "../../components";
import {
  getIconPaymentMethod,
  getLabelPaymentMethod,
  rupiah,
} from "../../helpers";
import { setFormCharging } from "../../redux";
import { fetchSessionSetting } from "../../services/request";
import { AppDispatch, RootState } from "../../store";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";

const costMax: number = 800; //jam
const dataPortStatusDummy: number[] = [0, 0];
const dataCostInformation = [
  {
    id: 1,
    watt: "0-250W",
    price: 800,
  },
  {
    id: 1,
    watt: "251-500W",
    price: 1600,
  },
];

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

const tabsCostInformation = [
  {
    id: "1",
    label: "07:00 - 11:59",
    content: (
      <div className="p-3 bg-primary10 rounded-lg">
        {dataCostInformation.map((item, index: number) => (
          <CostInformationItem
            key={index}
            data={item}
            isLast={index === dataCostInformation.length - 1}
          />
        ))}
      </div>
    ),
  },
  {
    id: "2",
    label: "12:00 - 19:00",
    content: (
      <div className="p-3 bg-primary10 rounded-lg">
        {dataCostInformation.map((item, index: number) => (
          <CostInformationItem
            key={index}
            data={item}
            isLast={index === dataCostInformation.length - 1}
          />
        ))}
      </div>
    ),
  },
];

const SessionSettings = () => {
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const { loading, data, error } = useSelector(
    (state: RootState) => state.sessionSetting
  );
  const { formData } = useSelector((state: RootState) => state.formCharging);
  const global = useSelector((state: RootState) => state.global);

  const [selectTabInput, setSelectTabInput] = useState<string>("1");
  const [selectSocket, setSelectSocket] = useState<number>();
  const [nominal, setNominal] = useState<string>();
  const [time, setTime] = useState<string>();
  const [total, setTotal] = useState<string>();

  useEffect(() => {
    // getData();
  }, []);

  const getData = () => {
    if (id) dispatch(fetchSessionSetting(id));
    else {
      alert("perangkat tidak ditemukan");
      navigate("/home", { replace: true });
    }
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `Rp${rupiah(value)}`;

    setNominal(formatted);
  };

  const getTotalDuration = useCallback(() => {
    const currentNominal: number = Number(
      nominal?.replace("Rp", "").replace(/\./g, "") || 0
    );
    let value: string = "Rp0";

    if (currentNominal > 0 && selectTabInput === "1") {
      const totalSecond: number = (currentNominal / costMax) * 3600;
      value = setDuration(totalSecond);
    } else if (selectTabInput === "2" && Number(time) > 0) {
      value = `Rp${rupiah((Number(time || 0) / 60) * costMax)}`;
    }

    return value;
  }, [nominal, time, selectTabInput]);

  const FormatPaymentMethod: () => JSX.Element = useCallback(() => {
    if (global?.paymentMethod) {
      const Icon = getIconPaymentMethod(global?.paymentMethod);
      const label = getLabelPaymentMethod(global?.paymentMethod);
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
  }, [global?.paymentMethod]);

  const validationNominal = (select: string) => {
    let value = false;

    const convert = nominal?.replace(REGEX_NUMBERS, "");

    if (convert === select) value = true;

    return value;
  };

  const validationButton = () => {
    let value: boolean = true;

    if (
      selectSocket !== undefined &&
      Number(total?.replace("Rp", "").replace(/\./g, "") || 0) > 0 &&
      global?.paymentMethod
    )
      value = false;

    return value;
  };

  const onSelectNominal = (select: string) => {
    let value: string = "";

    if (select === "full") value = "50000";
    else value = select.replace(REGEX_NUMBERS, "");

    const formatted: string = `Rp${rupiah(value)}`;

    setNominal(formatted);
  };

  const onNext = () => {
    const body = {
      deviceId: id,
      price: Number(nominal?.replace("Rp", "").replace(/\./g, "")),
      port: Number(selectSocket) + 1,
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
      <LoadingPage loading={loading}>
        <div className="flex-1 flex-col overflow-auto scrollbar-none">
          {/* LOCATION */}
          <div className="p-4 bg-white mb-2">
            <div className="between">
              <p className="text-blackBold font-medium">
                Pasar Modern Intermoda
              </p>

              <div className="row gap-2 cursor-pointer" onClick={() => {}}>
                <p className="text-xs text-primary100 font-medium">Lihat</p>
                <IcRightGreen />
              </div>
            </div>

            <Separator className="my-3" />

            <div className="between">
              <div className="row gap-2">
                <div className="w-[22px] h-[22px] rounded-full center bg-primary30">
                  <p className="text-[10px] text-primary100 font-semibold">A</p>
                </div>

                <p className="text-xs font-medium">Pintu Masuk Barat</p>
              </div>

              <p className="text-xs text-black90">{`Nomor Alat ${
                formData?.deviceId || "1544"
              }`}</p>
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
                {/* {data?.portStatus &&
                  data?.portStatus.map((item, index: number) => ( */}
                {dataPortStatusDummy &&
                  dataPortStatusDummy.map((item, index: number) => (
                    <SocketItem
                      key={index}
                      data={item}
                      position={index + 1}
                      isActive={selectSocket === index}
                      onClick={() => setSelectSocket(index)}
                    />
                  ))}
              </div>
            </div>

            {/* INPUT NOMINAL */}
            {/* <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
              <SubTitle
                icon={IcInfoCircleGreen}
                label="Masukan Nominal Pengisian"
                className="mb-3"
              />

              <p className="text-xs text-black100/70 mb-[14px]">
                Silakan masukan nominal pengisian yang sesuai dengan daya
                pengisian tram
              </p>

              <div className="center relative  rounded-lg bg-baseGray mb-3">
                <p className="text-base font-semibold">{`Rp${rupiah(8000)}`}</p>
                <input
                  type={"text"}
                  placeholder={"0"}
                  value={nominal}
                  onChange={handleChange}
                  className="w-auto text-center p-5 w-full text-base font-semibold bg-transparent"
                />
                <div className="absolute p-2 bottom-0 right-0 ">
                  <IcEditGreen />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {nominalDataDummy.map((item, index: number) => (
                  <NominalTopUpItem
                    key={index}
                    value={item}
                    isActive={validationNominal(item)}
                    onClick={() => onSelectNominal(item)}
                  />
                ))}
              </div>
            </div> */}

            <div className="bg-white py-4 px-3 rounded-lg mb-3">
              <Tabs
                tabs={tabsNominalHour}
                onSelect={(select) => setSelectTabInput(select)}
              />

              {selectTabInput === "1" ? (
                <InputNominal
                  value={total || ""}
                  onChange={(value) => {
                    setTotal(value);
                    setNominal(value);
                  }}
                />
              ) : (
                <InputHour
                  value={time || ""}
                  onChange={(value) => {
                    const formatted = `Rp${rupiah(
                      (Number(value || 0) / 60) * costMax
                    )}`;
                    setTotal(formatted);
                    setTime(value);
                  }}
                />
              )}
            </div>

            {/* DURATION RANGE */}
            {/* {Number(nominal?.replace("Rp", "")) > 0 && (
              <div className="bg-white p-3 rounded-lg mb-3 center flex-col gap-3 drop-shadow">
                <span className="font-medium">
                  Kisaran durasi yang didapat:
                </span>

                <span className="text-xl text-primary100 font-semibold">
                  4 jam 3 menit
                </span>

                <p className="text-xs">
                  Durasi masih <a className="font-medium text-xs">perkiraan</a>,
                  bukan angka yang sesungguhnya.
                </p>
              </div>
            )} */}
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

              <div className="between py-4 px-3 bg-primary100/10 rounded-lg">
                <div>
                  <p className="text-xs text-black70 mb-2">Spesifikasi:</p>
                  <div
                    onClick={() => {}}
                    className="row gap-2.5 cursor-pointer"
                  >
                    <p className="text-primary100 font-medium">48V 2A</p>

                    <IcEditGreen />
                  </div>
                </div>

                <div className="w-2/5">
                  <p className="text-xs text-black70 mb-2">
                    {selectTabInput === "1"
                      ? "Kisaran Durasi:"
                      : "Biaya Pengecasan"}
                  </p>
                  <p className="text-lg font-semibold">{getTotalDuration()}</p>
                </div>
              </div>
            </div>

            {/* COST INFORMATION */}
            <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
              <div className="row gap-3 mb-4">
                <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                  <IcInfoCircleGreen />
                </div>

                <p className="text-blackBold font-medium">Informasi Biaya</p>
              </div>

              <Tabs tabs={tabsCostInformation} />
            </div>

            {/* FINANCING  DETAILS*/}
            {/* <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
            <div className="row gap-3 mb-2">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcInfoCircleGreen />
              </div>

              <p className="text-blackBold font-medium">Rincian Pembiayaan</p>
            </div>

            <BetweenText
              type="medium-content"
              labelLeft="Tarif Dasar"
              labelRight={`Rp${rupiah(8000)}`}
              className="bg-baseLightGray p-3 rounded-t"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Biaya Transaksi"
              labelRight={`Rp${rupiah(1000)}`}
              className="p-3"
            />
          </div> */}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="drop-shadow p-4 bg-white">
          <div
            onClick={() =>
              navigate("/select-payment-method", {
                state: { nominal, time, selectSocket },
              })
            }
            className="between cursor-pointer"
          >
            <FormatPaymentMethod />

            <IcRightCircleGreen />
          </div>

          <Separator className="my-2.5" />

          <div className="between">
            <p className="text-base text-black100/70">
              Total: <a className="text-blackBold font-bold">{total}</a>
            </p>

            <Button
              className="!w-[130px]"
              label="Bayar"
              disabled={validationButton()}
              onClick={() => navigate("/session-details")}
            />
          </div>
        </div>

        {/* FOOTER */}
        {/* <div className="container-button-footer">
          <Button
            buttonType="lg"
            label="Lanjutkan"
            disabled={validationButton()}
            onClick={onNext}
          />
        </div> */}
      </LoadingPage>
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
