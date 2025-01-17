import { useNavigate } from "react-router-dom";
import {
  Button,
  Header,
  NominalTopUpItem,
  Separator,
  SubTitle,
} from "../components";
import { IcEditGreen, IcRightCircleGreen, IcSolarGreen } from "../assets";
import { rupiah } from "../helpers";

const nominalDataDummy = [1, 2, 3];

const TopUpBalance = () => {
  const navigate = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  const onEditPrice = () => {
    alert("coming soon");
  };

  const onSelectPayment = () => {
    alert("coming soon");
  };

  const onPay = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 flex flex-col justify-between overflow-hidden">
      <Header type="secondary" title="Isi Saldo" onDismiss={onDismiss} />

      <div className="flex-1 overflow-auto scrollbar-none p-4">
        <div className="bg-white p-3 rounded-lg shadow">
          <SubTitle icon={IcSolarGreen} label="Pilih Nominal Pengisian" />

          <p className="mt-2 mb-3 text-xs text-black100/70">
            Silakan pilih nominal pengisian sesuai dengan daya kebutuhan anda
          </p>

          <div className="center relative p-5 rounded-lg bg-baseGray mb-3 flex flex-col gap-3">
            <p className="text-base font-semibold">{`Rp${rupiah(8000)}`}</p>

            <Separator className="bg-black10" />

            <div className="row gap-1 text-black70">
              <p className="font-bold">150W</p>
              <p className="font-medium">selama</p>
              <p className="font-bold">3</p>
              <p className="font-medium">jam</p>
            </div>
            <div
              onClick={onEditPrice}
              className="absolute p-2 bottom-0 right-0 cursor-pointer"
            >
              <IcEditGreen />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nominalDataDummy.map((_, index: number) => (
              <NominalTopUpItem key={index} isActive={true} />
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
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
    </div>
  );
};

export default TopUpBalance;
