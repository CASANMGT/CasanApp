import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  IcEditGreen,
  IcPlus,
  IcSolarGreen,
  IcSuccessGreen,
  IcWalletGreen2,
} from "../assets";
import { BankAccountList, REGEX_NUMBERS } from "../common";
import {
  AlertModal,
  Button,
  Header,
  ModalSelectBank,
  Separator,
  SubTitle,
} from "../components";
import { fetchBankAccountList } from "../features";
import { rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";

const Withdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const bankAccountList = useSelector(
    (state: RootState) => state.bankAccountList
  );

  const [nominal, setNominal] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openSelectBank, setOpenSelectBank] = useState<boolean>(false);
  const [selectBank, setSelectBank] = useState<BankAccountList>();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(fetchBankAccountList());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `${rupiah(value)}`;

    setNominal(formatted);
  };

  const onChange = () => {
    if (isAvailable) setOpenSelectBank(true);
    else {
    }
  };

  const onSelect = () => {
    setOpenSuccess(true);
  };

  const isAvailable: boolean = true;

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

          {isAvailable ? (
            <>
              <p className="text-xs text-blackBold font-medium">
                Bank Mandiri - 1440024861665
              </p>
              <p className="text-xs mt-1">TEDY IMAN PRIYO TANTO</p>
            </>
          ) : (
            <p className="text-xs text-black70">Belum ada akun bank</p>
          )}

          <Separator className="my-3" />

          <div onClick={onChange} className="row gap-2 cursor-pointer">
            {isAvailable ? (
              <>
                <IcEditGreen />{" "}
                <span className="text-primary100 font-medium">
                  Ganti Rekening Bank
                </span>
              </>
            ) : (
              <>
                <IcPlus />

                <span className="text-primary100 font-medium">
                  Tambah Akun Bank
                </span>
              </>
            )}
          </div>
        </div>

        {/* WITHDRAWAL AMOUNT */}
        {isAvailable && (
          <div className="bg-primary10 rounded-lg">
            <p className="text-black90 text-xs py-2 px-2.5">
              Biaya layanan{" "}
              <span className="text-xs text-blackBold font-medium">{`Rp${rupiah(
                500
              )}`}</span>
            </p>
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
                  type={"text"}
                  placeholder={"0"}
                  value={nominal}
                  onChange={handleChange}
                  className="h-full w-full text-2xl font-semibold p-0 bg-transparent text-black100 focus:outline-none"
                />
              </div>

              <Separator className="mt-1 mb-3" />

              <div className="between-x">
                <span className="text-xs text-black70">Saldo Anda</span>

                <span className="text-base font-semibold">{`Rp${rupiah(
                  50000
                )}`}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {isAvailable && (
        <div className="container-button-footer">
          <Button buttonType="lg" label="Konfirmasi" onClick={onSelect} />
        </div>
      )}

      {/* MODAL */}
      <AlertModal
        visible={openSuccess}
        icon={IcSuccessGreen}
        title="Penarikan Dana telah diajukan"
        description="Penarikan Dana telah diajukan, proses ini membutuhkan waktu maksimal 24 jam"
        labelButtonLeft="Konfirmasi"
        onClick={() => {}}
      />

      <ModalSelectBank
        isOpen={openSelectBank}
        onDismiss={() => setOpenSelectBank(false)}
        onAddBank={() => navigate("/select-bank")}
        onSelect={(select) => {
          setOpenSelectBank(false);
          setSelectBank(select);
        }}
      />
      {/* END MODAL */}
    </div>
  );
};

export default Withdraw;
