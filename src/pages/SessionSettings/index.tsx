import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcEditGreen,
  IcInfoCircleGreen,
  IcRightCircleGreen,
  IcRightGreen,
  IcSocketCircleGreen,
} from "../../assets";
import {
  BetweenText,
  Button,
  Container,
  CostInformationItem,
  Separator,
  SocketItem,
  Tabs,
} from "../../components";
import { rupiah } from "../../helpers";
import InputHour from "./InputHour";
import InputNominal from "./InputNominal";
import { useState } from "react";

const socketDataDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const dataDummy = [1, 2];

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
  const [selectTabInput, setSelectTabInput] = useState<string>("1");

  const onDismiss = () => {
    navigate(-1);
  };

  const onView = () => {
    alert("coming soon");
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
      <div className="flex flex-col overflow-auto scrollbar-none">
        {/* LOCATION */}
        <div className="p-4 bg-white mb-2">
          <div className="between">
            <p className="text-blackBold ">Pasar Modern BSD City</p>

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
              {socketDataDummy.map((_, index: number) => (
                <SocketItem key={index} onClick={() => alert("coming soon")} />
              ))}
            </div>
          </div>

          {/* CHARGING DURATION */}
          {/* <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
            <div className="row gap-3 mb-2">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcSolarGreen />
              </div>

              <p className="text-blackBold font-medium">Durasi Pengisian</p>
            </div>

            <p className="text-xs text-black100/70 mb-[14px]">
              Silakan masukan durasi pengisian sesuai dengan daya kebutuhan anda
            </p>

            <div className="grid grid-cols-2 gap-3">
              {nominalDataDummy.map((_, index: number) => (
                <NominalTopUpItem key={index} isActive={false} />
              ))}
            </div>
          </div> */}

          {/* INPUT NOMINAL OR HOUR */}
          <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
            <Tabs
              tabs={tabsNominalHour}
              onSelect={(select) => setSelectTabInput(select)}
            />
          </div>

          {/* DURATION RANGE */}
          {selectTabInput === "1" && (
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
          )}

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
          <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
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
          </div>
        </div>
      </div>

      {/* PAYMENT METHOD */}
      <div className="drop-shadow p-4 bg-white">
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
      </div>
    </Container>
  );
};

export default SessionSettings;
