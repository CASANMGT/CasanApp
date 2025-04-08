import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IcClose, IcWallet } from "../../../assets";
import { FeeSettingsProps } from "../../../common";
import { useAlert } from "../../../context/AlertContext";
import { useAuth } from "../../../context/AuthContext";
import { fetchFeeSettings, fetchMyUser } from "../../../features";
import { getIconPaymentMethod } from "../../../helpers";
import { AppDispatch, RootState } from "../../../store";
import { Button, LoadingPage } from "../../atoms";
import { PaymentMethodItem } from "../Items";
import ModalContainer from "./ModalContainer";

interface ModalPaymentMethodProps {
  type?: "top-up";
  visible: boolean;
  select: FeeSettingsProps | undefined;
  selectBalance: number;
  total?: number;
  onDismiss: () => void;
  onSelect: (select: FeeSettingsProps | undefined, value?: number) => void;
}

const ModalPaymentMethod: React.FC<ModalPaymentMethodProps> = ({
  type,
  visible,
  select,
  selectBalance,
  total,
  onDismiss,
  onSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  const feeSettings = useSelector((state: RootState) => state.feeSettings);
  const myUser = useSelector((state: RootState) => state.myUser);

  const [optionsPaymentMethod, setOptionsPaymentMethod] =
    useState<FeeSettingsProps[]>();
  const [selectedPayment, setSelectedPayment] = useState<FeeSettingsProps>();
  const [selectedBalance, setSelectedBalance] = useState<number>(
    selectBalance || 0
  );

  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);

  useEffect(() => {
    if (feeSettings?.data) {
      if (feeSettings?.data && feeSettings?.data.length) {
        const dataTopUp = feeSettings?.data.filter(
          (item) => item.Code.split("_")[1] === "TU"
        );
        const newDataTop: FeeSettingsProps[] = [];

        dataTopUp.forEach((item) => {
          const newItem: FeeSettingsProps = {
            key: item.Code,
            icon: getIconPaymentMethod(
              item.Code.split("_")[0].toLocaleLowerCase()
            ),
            label: item.Name,
            priceType: item?.IsPercentage ? "percentage" : "fixed",
            value: item.Value.toString(),
          };

          newDataTop.push(newItem);
        });

        setOptionsPaymentMethod(newDataTop);
      }
    }
  }, [feeSettings?.data]);

  const getData = () => {
    setSelectedPayment(select);
    dispatch(fetchFeeSettings());

    if (isAuthenticated) dispatch(fetchMyUser());
  };

  const onValidation = () => {
    let message = {
      title: "",
      body: "",
    };

    if (!selectedBalance && !selectedPayment) {
      message.title = "Pilih Metode Pembayaran";
      message.body = "Pilih Metode Pembayaran terlebih dahulu";
    } else if (
      selectedBalance > 0 &&
      selectedBalance < (total || 0) &&
      !selectedPayment
    ) {
      message.title = "Saldo tidak cukup";
      message.body = "Saldo Casan anda tidak mencukupi";
    }

    if (!message?.title) {
      onSelect(selectedPayment, selectedBalance);
    } else showAlert(message);
  };

  const myBalance = myUser?.data?.Balance || 0;

  return (
    <ModalContainer isOpen={visible} isBottom onDismiss={onDismiss}>
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="between-x mb-6">
            <label className="text-base font-semibold">
              Pilih Metode Pembayaran
            </label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <LoadingPage
            loading={feeSettings?.loading || myUser?.loading}
            color="primary100"
          >
            <div className="overflow-auto">
              {type !== "top-up" && (
                <>
                  <p className="text-black70 mb-2.5">Saldo Anda</p>
                  {/* DUMMY  value 1000*/}
                  <PaymentMethodItem
                    type="checkbox"
                    label="Saldo"
                    balance={myBalance}
                    isActive={selectedBalance > 0}
                    icon={IcWallet}
                    disabled={myBalance <= 0}
                    onSelect={() => {
                      let value = selectedBalance > 0 ? 0 : myBalance;
                      setSelectedBalance(value);
                    }}
                  />

                  <div className="mb-4" />
                </>
              )}

              <p className="text-black70 mb-2.5">eWallet</p>

              {optionsPaymentMethod &&
                optionsPaymentMethod.map((item, index: number) => {
                  if(item?.key==="TRANSFER_TU") return null
                  
                  return (
                    <PaymentMethodItem
                      key={item?.key}
                      icon={item?.icon}
                      label={item?.label}
                      position={index}
                      isActive={selectedPayment?.key === item?.key}
                      onSelect={() => setSelectedPayment(item)}
                    />
                  );
                })}

              <div className="h-6" />
            </div>
          </LoadingPage>
        </div>

        {/* FOOTER */}
        <div className="">
          <Button buttonType="lg" label="Pilih" onClick={onValidation} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalPaymentMethod;
