import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IcAstraPay,
  IcDana,
  IcGopay,
  IcLinkAja,
  IcQris,
  IcShopeePay,
  IcWallet,
} from "../assets";
import { ASTRAPAY, DANA, GOPAY, LINK_AJA, QRIS, SHOPEEPAY } from "../common";
import {
  Button,
  Container,
  InputOTPModal,
  InputPhoneNumberModal,
  PaymentMethodItem,
  RequestOTPModal,
} from "../components";
import { setFromGlobal } from "../features";
import { AppDispatch } from "../store";

interface EWallet {
  key: string;
  label: string;
  icon: any;
}

const dataEWalletDummy = [
  {
    key: QRIS,
    label: "QRIS",
    icon: IcQris,
  },
  {
    key: GOPAY,
    label: "GoPay",
    icon: IcGopay,
  },
  {
    key: DANA,
    label: "Dana",
    icon: IcDana,
  },
  {
    key: SHOPEEPAY,
    label: "ShopeePay",
    icon: IcShopeePay,
  },
  {
    key: LINK_AJA,
    label: "Link Aja",
    icon: IcLinkAja,
  },
  {
    key: ASTRAPAY,
    label: "Astrapay",
    icon: IcAstraPay,
  },
];

const SelectPaymentMethod = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [select, setSelect] = useState<boolean>(false);
  const [visibleInputPhoneNumber, setVisibleInputPhoneNumber] =
    useState<boolean>(false);
  const [visibleRequestOTP, setVisibleRequestOTP] = useState<boolean>(false);
  const [visibleInputOTP, setVisibleInputOTP] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>();

  const onDismiss = () => {
    navigate(-1);
  };

  const onSelect = () => {
    dispatch(
      setFromGlobal({
        type: "paymentMethod",
        value: selectedPayment,
      })
    );
    navigate(-1);
    // setVisibleInputOTP(true);
  };

  return (
    <Container title="Pilih Metode Pembayaran" onDismiss={onDismiss}>
      <div className="flex flex-col overflow-auto scrollbar-none flex-1">
        <div className="bg-white p-4 ">
          <p className="text-black70 mb-2.5">Saldo Anda</p>
          <PaymentMethodItem
            type="checkbox"
            label="Saldo"
            balance={0}
            isActive={false}
            icon={IcWallet}
            disabled={true}
            onSelect={() => setSelect((prev) => !prev)}
          />

          <p className="text-black70 mb-2.5 mt-4">EWallet</p>

          {dataEWalletDummy.map((item, index: number) => (
            <PaymentMethodItem
              key={item?.key}
              icon={item?.icon}
              label={item?.label}
              position={index}
              isActive={selectedPayment === item?.key}
              onSelect={() => setSelectedPayment(item?.key)}
            />
          ))}
        </div>
      </div>

      <div className="container-button-footer">
        <Button
          buttonType="lg"
          label="Pilih"
          disabled={!selectedPayment}
          onClick={onSelect}
        />
      </div>

      {/* MODALS */}
      {visibleInputPhoneNumber && (
        <InputPhoneNumberModal
          visible={visibleInputPhoneNumber}
          onDismiss={() => setVisibleInputPhoneNumber((prev) => !prev)}
          onClick={() => alert("coming soon")}
        />
      )}

      {visibleRequestOTP && (
        <RequestOTPModal
          visible={visibleRequestOTP}
          onDismiss={() => setVisibleRequestOTP((prev) => !prev)}
          onClick={() => alert("coming soon")}
        />
      )}

      {visibleInputOTP && (
        <InputOTPModal
          visible={visibleInputOTP}
          onDismiss={() => setVisibleInputOTP((prev) => !prev)}
          onClick={() => alert("coming soon")}
        />
      )}

      {/* END MODALS */}
    </Container>
  );
};

export default SelectPaymentMethod;
