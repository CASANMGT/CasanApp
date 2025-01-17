import { useNavigate } from "react-router-dom";
import {
  IcEditGreen,
  IcPlusCircleGreen,
  IcSolarGreen,
  IcWalletGreen2,
} from "../assets";
import { Button, Header, Separator, SubTitle } from "../components";
import { rupiah } from "../helpers";
import { useState } from "react";

const Withdraw = () => {
  const navigate = useNavigate();

  const [nominal, setNominal] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = e?.target?.value;
    setNominal(value);
  };

  const onSelect = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 flex flex-col justify-between overflow-hidden">
      <Header
        type="secondary"
        title="Withdraw"
        onDismiss={() => navigate(-1)}
      />

      <div className="flex-1 p-4 overflow-auto scrollbar-none">
        {/* TRANSFER TO ACCOUNT */}
        <div className="container-card mb-4">
          <SubTitle
            label="Transfer ke Rekening"
            icon={IcWalletGreen2}
            className="mb-2"
          />

          {true ? (
            <>
              <p className="text-xs text-blackBold font-medium">
                Bank Mandiri - 1440024861665
              </p>
              <p className="text-xs mt-1">TEDY IMAN PRIYO TANTO</p>
            </>
          ) : (
            <p className="text-xs text-black70">
              Tidak ada rekening bank yang terdeteksi.
            </p>
          )}

          <Separator className="my-3" />

          <div className="row gap-2 cursor-pointer">
            {true ? (
              <>
                <IcEditGreen />{" "}
                <span className="text-primary100 font-medium">
                  Ubah Rekening Bank
                </span>
              </>
            ) : (
              <>
                <IcPlusCircleGreen />

                <span className="text-primary100 font-medium">
                  Tambah Rekening Bank
                </span>
              </>
            )}
          </div>
        </div>

        {/* WITHDRAWAL AMOUNT */}
        <div className="container-card mb-4">
          <SubTitle
            label="Jumlah Penarikan"
            icon={IcSolarGreen}
            className="mb-2"
          />

          <p className="text-xs text-black70">
            Silakan masukan nominal penarikan anda
          </p>

          <div className="row gap-0.5">
            <span className="text-xs text-blackBold">Rp</span>

            <input
              type={"number"}
              placeholder={"0"}
              value={nominal}
              onChange={handleChange}
              className="h-full w-full text-2xl font-semibold p-0 bg-transparent text-black100 focus:outline-none"
            />
          </div>

          <Separator className="mt-1 mb-3" />

          <div className="between">
            <span className="text-xs text-black70">Saldo Anda</span>

            <span className="text-base font-semibold">{`Rp${rupiah(
              50000
            )}`}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
        <Button buttonType="lg" label="Konfirmasi" onClick={onSelect} />
      </div>
    </div>
  );
};

export default Withdraw;
