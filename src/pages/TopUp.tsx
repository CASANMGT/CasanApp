import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  IcInfoCircleGreen,
  IcRightCircleGreen,
  IcSolarGreen
} from "../assets";
import { AddTransactionBody, FeeSettingsProps } from "../common";
import {
  BetweenText,
  Button,
  Card,
  Header,
  ModalPaymentMethod,
  Separator,
  SubTitle,
} from "../components";
import {
  fetchMyUser,
  hideLoading,
  resetDataAddTransaction,
  showLoading
} from "../features";
import { rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";
import InputNominal from "./SessionSettings/InputNominal";

const nominalDataDummy = [1, 2, 3];

const TopUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const addTransaction = useSelector(
    (state: RootState) => state?.addTransaction
  );

  const [nominal, setNominal] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<FeeSettingsProps>();
  const [visiblePaymentMethod, setVisiblePaymentMethod] =
    useState<boolean>(false);

  useEffect(() => {
    if (addTransaction?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (addTransaction?.data) {
      dispatch(resetDataAddTransaction());
      fetchMyUser();
      onDismiss();
    }
  }, [addTransaction]);

  const onDismiss = () => {
    navigate(-1);
  };

  const FormatPaymentMethod: () => JSX.Element = useCallback(() => {
    if (paymentMethod) {
      const Icon = paymentMethod.icon;
      return (
        <div className="row gap-1">
          <Icon className="w-[22px]" />

          <p className="font-medium">{paymentMethod.label}</p>
        </div>
      );
    } else {
      return (
        <p className="text-xs text-primary100 font-medium">
          Pilih Metode Pemabayaran
        </p>
      );
    }
  }, [paymentMethod]);

  const validation = () => {
    let value: boolean = true;

    if (
      Number(nominal?.replace("Rp", "").replace(/\./g, "") || 0) > 0 &&
      paymentMethod
    ) {
      value = false;
    }

    return value;
  };

  const onPay = () => {
    const body: AddTransactionBody = {
      amount: Number(nominal?.replace("Rp", "").replace(/\./g, "") || 0),
      payment_method: paymentMethod?.key || "",
      type: 1,
      wallet_used_amount: 0,
    };

    console.log("cek b", body);
    // dispatch(fetchAddTransaction(body))
  };

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

          <InputNominal
            value={nominal || ""}
            description="Silakan pilih nominal pengisian sesuai dengan daya kebutuhan anda"
            dataNominal={["5000", "10000", "20000", "50000"]}
            onChange={(value) => setNominal(value)}
          />
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
            labelLeft="Nominal Top Uo"
            labelRight={`Rp${rupiah(
              nominal?.replace("Rp", "").replace(/\./g, "") || 0
            )}`}
            className="bg-baseLightGray p-3 rounded-t"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Admin Fee"
            labelRight={`Rp${rupiah(paymentMethod?.value || 0)}`}
            className="p-3"
          />
        </Card>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
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
              Number(nominal?.replace("Rp", "").replace(/\./g, "") || 0) +
                Number(paymentMethod?.value || 0)
            )}`}</a>
          </p>

          <Button
            className="!w-[130px]"
            label="Bayar"
            disabled={validation()}
            onClick={onPay}
          />
        </div>
      </div>

      {/* MODAL */}
      <ModalPaymentMethod
        type={"top-up"}
        visible={visiblePaymentMethod}
        select={paymentMethod}
        onDismiss={() => setVisiblePaymentMethod(false)}
        onSelect={(select) => setPaymentMethod(select)}
      />
      {/* END MODAL */}
    </div>
  );
};

export default TopUp;
