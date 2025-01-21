import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcEditGreen,
  IcInfoCircleGreen,
  IcRightGreen,
  IcSocketCircleGreen,
} from "../../assets";
import { REGEX_NUMBERS, socketProps } from "../../common";
import {
  Button,
  Container,
  CostInformationItem,
  LoadingPage,
  NominalTopUpItem,
  Separator,
  SocketItem,
  SubTitle,
} from "../../components";
import { rupiah } from "../../helpers";
import { fetchSessionSetting } from "../../services/request";
import { AppDispatch, RootState } from "../../store";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";

const socketDataDummy: socketProps[] = [
  { socket: 1, status: "available" },
  { socket: 2, status: "available" },
  { socket: 3, status: "available" },
  { socket: 4, status: "available" },
  { socket: 5, status: "available" },
  { socket: 6, status: "used" },
  { socket: 7, status: "available" },
  { socket: 8, status: "available" },
  { socket: 9, status: "available" },
  { socket: 10, status: "broken" },
];
const dataDummy = [1, 2];
const nominalDataDummy = ["2000", "4000", "6000", "full"];

const tabsNominalHour = [
  {
    id: "1",
    label: "Masukan Nominal",
    content: <InputNominal />,
  },
  {
    id: "2",
    label: "Masukan Jam",
    content: <InputHour />,
  },
];

const tabsCostInformation = [
  {
    id: "1",
    label: "07:00 - 11:59",
    content: (
      <div className="p-3 bg-primary10 rounded-lg">
        {dataDummy.map((_, index: number) => (
          <CostInformationItem
            key={index}
            isLast={index === dataDummy.length - 1}
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
        {dataDummy.map((_, index: number) => (
          <CostInformationItem
            key={index}
            isLast={index === dataDummy.length - 1}
          />
        ))}
      </div>
    ),
  },
];

const SessionSettings = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, data } = useSelector((state: RootState) => state.sessionSetting);

  const [selectTabInput, setSelectTabInput] = useState<string>("1");
  const [selectSocket, setSelectSocket] = useState<number>();
  const [nominal, setNominal] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(fetchSessionSetting(861435073571321));
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `Rp${rupiah(value)}`;

    setNominal(formatted);
  };

  const validationNominal = (select: string) => {
    let value = false;

    const convert = nominal?.replace(REGEX_NUMBERS, "");

    if (convert === select) value = true;

    return value;
  };

  const onSelectNominal = (select: string) => {
    let value: string = "";

    if (select === "full") value = "50000";
    else value = select.replace(REGEX_NUMBERS, "");

    const formatted: string = `Rp${rupiah(value)}`;

    setNominal(formatted);
  };

  const onView = () => {
    alert("coming soon");
  };

  const onEditPrice = () => {
    alert("coming soon");
  };

  const onNext = () => {
    navigate("/charging");
  };

  const onEditDuration = () => {
    alert("coming soon");
  };

  const onSelectPayment = () => {
    navigate("/select-payment-method");
  };

  const onPay = () => {
    navigate("/charging");
    // navigate("/input-pin");
  };

  return (
    <Container title="Pengaturan Sesi" onDismiss={onDismiss}>
      <LoadingPage loading={loading}>
        <div className="flex-1 flex-col overflow-auto scrollbar-none">
          {/* LOCATION */}
          <div className="p-4 bg-white mb-2">
            <div className="between">
              <p className="text-blackBold font-medium">
                Pasar Modern BSD City
              </p>

              <div className="row gap-2 cursor-pointer" onClick={onView}>
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

              <p className="text-xs text-black90">Nomor Alat 1544</p>
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
                {socketDataDummy.map((item, index: number) => (
                  <SocketItem
                    key={index}
                    data={item}
                    isActive={selectSocket === item?.socket}
                    onClick={() => setSelectSocket(item?.socket)}
                  />
                ))}
              </div>
            </div>

            {/* INPUT NOMINAL */}
            <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
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
                {/* <p className="text-base font-semibold">{`Rp${rupiah(8000)}`}</p> */}
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
            </div>

            {/* DURATION RANGE */}
            <div className="bg-white p-3 rounded-lg mb-3 center flex-col gap-3 drop-shadow">
              <span className="font-medium">Kisaran durasi yang didapat:</span>

              <span className="text-xl text-primary100 font-semibold">
                4 jam 3 menit
              </span>

              <p className="text-xs">
                Durasi masih <a className="font-medium text-xs">perkiraan</a>,
                bukan angka yang sesungguhnya.
              </p>
            </div>
            {/* {selectTabInput === "1" && (
            <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
              <div className="row gap-3 mb-2">
                <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                  <IcInfoCircleGreen />
                </div>

                <p className="text-blackBold font-medium">Kisaran Durasi</p>
              </div>

              <p className="text-xs text-black100/70 mb-[14px]">
                Durasi masih perkiraan, bukan angka yang sesungguhnya.
              </p>

              <div className="between py-4 px-3 bg-primary100/10 rounded-lg">
                <div
                  onClick={onEditDuration}
                  className="row gap-2.5 cursor-pointer"
                >
                  <p className="text-primary100 font-medium">48V 2A</p>

                  <IcEditGreen />
                </div>

                <p className="text-lg font-semibold">4 jam 3 menit</p>
              </div>
            </div>
          )} */}

            {/* COST INFORMATION */}
            {/* <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
            <div className="row gap-3 mb-4">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcInfoCircleGreen />
              </div>

              <p className="text-blackBold font-medium">Informasi Biaya</p>
            </div>

            <Tabs tabs={tabsCostInformation} />
          </div> */}

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
        {/* <div className="drop-shadow p-4 bg-white">
        <div onClick={onSelectPayment} className="between cursor-pointer">
          <p className="text-xs text-primary100 font-medium">
            Pilih Metode Pemabayaran
          </p>
          <IcRightCircleGreen />
        </div>

        <Separator className="my-2.5" />

        <div className="between">
          <p className="text-base text-black100/70">
            Total:{" "}
            <a className="text-blackBold font-bold">{`Rp${rupiah(9000)}`}</a>
          </p>

          <Button
            className="!w-[130px]"
            label="Bayar"
            disabled={false}
            onClick={onPay}
          />
        </div>
      </div> */}

        {/* FOOTER */}
        <div className="container-button-footer">
          <Button buttonType="lg" label="Lanjutkan" onClick={onNext} />
        </div>
      </LoadingPage>
    </Container>
  );
};

export default SessionSettings;
