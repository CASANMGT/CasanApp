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
import {
  AddWithdrawBody,
  BankAccountList,
  ERROR_MESSAGE,
  REGEX_NUMBERS,
} from "../common";
import {
  AlertModal,
  Button,
  Header,
  ModalSelectBank,
  Separator,
  SubTitle,
} from "../components";
import {
  fetchAddWithdraw,
  fetchBankAccountList,
  hideLoading,
  resetDataAddWithdraw,
  showLoading,
} from "../features";
import { rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";

const Withdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const myUser = useSelector((state: RootState) => state.myUser);
  const bankAccountList = useSelector(
    (state: RootState) => state.bankAccountList
  );
  const addWithdraw = useSelector((state: RootState) => state.addWithdraw);

  const [nominal, setNominal] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openSelectBank, setOpenSelectBank] = useState<boolean>(false);
  const [selectBank, setSelectBank] = useState<BankAccountList>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  // manage response bank account list
  useEffect(() => {
    if (bankAccountList?.data?.length) {
      setSelectBank(bankAccountList?.data[0]);
    }
  }, [bankAccountList]);

  // manage response add withdraw
  useEffect(() => {
    if (addWithdraw?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (addWithdraw?.data) {
      dispatch(resetDataAddWithdraw());
      setOpenSuccess(true);
    }
  }, [addWithdraw]);

  const getData = () => {
    dispatch(fetchBankAccountList());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError("");

    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `${rupiah(value)}`;

    setNominal(formatted);
  };

  const onChange = () => {
    if (isAvailable) setOpenSelectBank(true);
    else navigate("/select-bank");
  };

  const onValidation = () => {
    let err: string = "";

    const withdraw: number = Number(nominal.replace(/\./g, "") || 0);

    if (withdraw > (myUser?.data?.Balance || 0))
      err = "Angka melebihi saldo yang tersedia";
    else if (withdraw < 15000) err = "Min. Withdraw Rp15.000";

    if (err) setError(err);
    else onConfirm();
  };

  const onConfirm = () => {
    if (selectBank) {
      const body: AddWithdrawBody = {
        amount: Number(nominal.replace(/\./g, "") || 0),
        bank_account_id: selectBank?.ID,
      };

      dispatch(fetchAddWithdraw(body));
    } else alert(ERROR_MESSAGE);
  };

  const isAvailable: boolean = selectBank ? true : false;

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
                {`${selectBank?.Code.replace("ID_", "")} - ${
                  selectBank?.Number
                }`}
              </p>
              <p className="text-xs mt-1">{selectBank?.Name}</p>
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
                0
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

              <div className="mb-3 mt-1">
                <Separator className={error ? "bg-red" : ""} />

                {error && <span className="text-xs text-red">{error}</span>}
              </div>

              <div className="between-x">
                <span className="text-xs text-black70">Saldo Anda</span>

                <span className="text-base font-semibold">{`Rp${rupiah(
                  myUser?.data?.Balance || 0
                )}`}</span>
              </div>

              <Separator className="my-3" />

              <div className="px-4 py-3 border border-primary100 bg-primary10 rounded-md">
                <p className="text-xs">
                  Penarikan akan diproses maksimal{" "}
                  <span className="text-xs font-medium">2x24 jam</span> di hari
                  kerja (tidak termasuk hari Sabtu, Minggu, serta hari
                  libur/cuti bersama
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {isAvailable && (
        <div className="container-button-footer">
          <Button buttonType="lg" label="Konfirmasi" onClick={onValidation} />
        </div>
      )}

      {/* MODAL */}
      <AlertModal
        visible={openSuccess}
        icon={IcSuccessGreen}
        title="Penarikan Dana telah diajukan"
        description="Penarikan Dana telah diajukan, proses ini membutuhkan waktu maksimal 24 jam"
        labelButtonLeft="Konfirmasi"
        onClick={() => navigate("/withdrawal-history")}
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
