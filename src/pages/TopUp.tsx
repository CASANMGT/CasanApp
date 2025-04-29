import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcEditGreen, IcInfoCircleGreen, IcSolarGreen } from "../assets";
import {
  AddTransactionBody,
  ERROR_MESSAGE,
  FeeSettingsProps,
  NOMINAL_TOP_UP,
  REGEX_NUMBERS,
} from "../common";
import {
  BetweenText,
  Button,
  Card,
  Header,
  ModalPaymentMethod,
  NominalTopUpItem,
  SubTitle,
} from "../components";
import {
  fetchAddTransaction,
  fetchMyUser,
  hideLoading,
  resetDataAddTransaction,
  showLoading,
} from "../features";
import { checkCalculationPaymentMethod, rupiah, useForm } from "../helpers";
import { AppDispatch, RootState } from "../store";

interface FormTopUp {
  nominal: string;
  paymentMethod?: FeeSettingsProps | undefined;
}

const TopUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const addTransaction = useSelector(
    (state: RootState) => state?.addTransaction
  );

  const [form, setForm] = useForm<FormTopUp>({
    nominal: "",
  });

  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);

  useEffect(() => {
    if (addTransaction?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (addTransaction?.data) {
      navigate(`/transaction-history/details/${addTransaction?.data?.ID}`, {
        replace: true,
      });

      dispatch(fetchMyUser());
      dispatch(resetDataAddTransaction());
    }
  }, [addTransaction]);

  const onDismiss = () => {
    navigate(-1);
  };

  const handleChange = (e: string) => {
    const value = e.replace(REGEX_NUMBERS, "");
    const formatted: string = `Rp${rupiah(value)}`;

    setForm("nominal", formatted);
  };

  const validation = () => {
    let value: boolean = true;

    if (Number(form.nominal?.replace("Rp", "").replace(/\./g, "") || 0) > 0) {
      value = false;
    }

    return value;
  };

  const onPay = (select?: FeeSettingsProps) => {
    try {
      setVisiblePaymentMethod(false);
      setForm("paymentMethod", select);

      if (select?.key) {
        const body: AddTransactionBody = {
          amount: total,
          payment_method: select?.key || "",
          type: 1,
          wallet_used_amount: 0,
        };

        dispatch(fetchAddTransaction(body));
      }
    } catch (_) {
      alert(ERROR_MESSAGE);
    }
  };

  const { total, fee } = checkCalculationPaymentMethod(
    Number(form?.nominal?.replace("Rp", "").replace(/\./g, "") || 0),
    form?.paymentMethod
  );

  return (
    <div className="background-1 flex flex-col justify-between overflow-hidden">
      <Header type="secondary" title="Isi Saldo" onDismiss={onDismiss} />

      <div className="flex-1 overflow-auto scrollbar-none p-4">
        {/* SELECT NOMINAL TOP UP  */}
        <Card className="mb-4">
          <SubTitle
            icon={IcSolarGreen}
            label="Pilih Nominal Pengisian"
            className="mb-2"
          />

          <p className="text-xs text-black100/70 mb-[14px]">
            {
              "Silakan pilih nominal pengisian sesuai dengan daya kebutuhan anda"
            }
          </p>

          <div className="relative w-full mb-3">
            <input
              type="text"
              inputMode="numeric"
              value={form.nominal}
              placeholder="Masukan Nominal"
              className="w-full p-5 font-semibold text-base text-center bg-baseGray rounded-lg placeholder:text-black50 outline-none"
              onChange={(e) => handleChange(e?.target?.value)}
            />

            <div className="absolute bottom-2 right-2">
              <IcEditGreen />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {NOMINAL_TOP_UP.map((item, index: number) => (
              <NominalTopUpItem
                key={index}
                value={item}
                isActive={
                  item === form.nominal?.replace("Rp", "").replace(/\./g, "")
                }
                onClick={() => handleChange(item)}
              />
            ))}
          </div>
        </Card>

        {/* PAYMENT DETAILS */}
        <Card>
          <SubTitle
            icon={IcInfoCircleGreen}
            label="Rincian Pembayaran"
            className="mb-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Nominal Top Up"
            labelRight={`Rp${rupiah(
              form.nominal?.replace("Rp", "").replace(/\./g, "") || 0
            )}`}
            className="bg-baseLightGray p-3 rounded-t"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Admin Fee"
            labelRight={`Rp${rupiah(fee)}`}
            className="p-3"
          />
        </Card>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
        <div className="between-x">
          <p className="text-base text-black100/70">
            Total:{" "}
            <a className="text-blackBold font-bold">{`Rp${rupiah(total)}`}</a>
          </p>

          <Button
            label="Bayar"
            disabled={validation()}
            onClick={() => setVisiblePaymentMethod(true)}
            className="!w-[130px]"
          />
        </div>
      </div>

      {/* MODAL */}
      {/* <ModalPaymentMethod
        type={"top-up"}
        visible={visiblePaymentMethod}
        select={paymentMethod}
        onDismiss={() => setVisiblePaymentMethod(false)}
        onSelect={(select) => setPaymentMethod(select)}
      /> */}

      <ModalPaymentMethod
        type={"top-up"}
        visible={visiblePaymentMethod}
        select={form.paymentMethod}
        total={total}
        onDismiss={() => setVisiblePaymentMethod(false)}
        onSelect={(select) => onPay(select)}
      />
      {/* END MODAL */}
    </div>
  );
};

export default TopUp;
