import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  InputOTPModal,
  InputPhoneNumberModal,
  PaymentMethodItem,
  RequestOTPModal,
} from "../components";

const dataDummy = [1, 2, 3];

const SelectPaymentMethod = () => {
  const navigate: NavigateFunction = useNavigate();

  const [select, setSelect] = useState<boolean>(false);
  const [visibleInputPhoneNumber, setVisibleInputPhoneNumber] =
    useState<boolean>(false);
  const [visibleRequestOTP, setVisibleRequestOTP] = useState<boolean>(false);
  const [visibleInputOTP, setVisibleInputOTP] = useState<boolean>(false);

  const onDismiss = () => {
    navigate(-1);
  };

  const onSelect = () => {
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
            balance={4000}
            isActive={select}
            onSelect={() => setSelect((prev) => !prev)}
          />

          <p className="text-black70 mb-2.5 mt-4">EWallet</p>

          {dataDummy.map((_, index: number) => (
            <PaymentMethodItem
              key={index}
              label="QRIS"
              position={index}
              isActive={false}
              onSelect={() => null}
            />
          ))}
        </div>
      </div>

      <div className="container-button-footer">
        <Button buttonType="lg" label="Pilih" onClick={onSelect} />
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
