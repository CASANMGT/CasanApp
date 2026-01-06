import { clone } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IcClose, IcWallet } from "../../../assets";
import { FeeSettingsProps } from "../../../common";
import { useAuth } from "../../../context/AuthContext";
import { fetchFeeSettings, fetchMyUser } from "../../../features";
import {
  checkCalculationPaymentMethod,
  getIconPaymentMethod,
  rupiah,
} from "../../../helpers";
import { AppDispatch, RootState } from "../../../store";
import { Button, LoadingPage } from "../../atoms";
import { PaymentMethodItem } from "../Items";
import ModalContainer from "./ModalContainer";

interface ModalPaymentMethodProps {
  type?: "top-up" | "credit" | "rto";
  visible: boolean;
  loading: boolean;
  select: FeeSettingsProps | undefined;
  selectBalance?: number;
  total?: number;
  deposit?: number;
  totalCredit?: number;
  label?: string;
  onDismiss: () => void;
  onSelect: (select: FeeSettingsProps | undefined, value?: number) => void;
}

const ModalPaymentMethod: React.FC<ModalPaymentMethodProps> = ({
  type,
  label,
  visible,
  select,
  loading,
  selectBalance,
  total,
  deposit,
  totalCredit,
  onDismiss,
  onSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

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
          if (item?.IsActive) {
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
          }
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

  const validation = () => {
    let value: boolean = true;

    if (selectedBalance && selectedBalance >= (total || 0) && !selectedPayment)
      value = false;
    else if (selectedPayment) value = false;

    return value;
  };

  const onChangeOptionPaymentMethod = (condition: boolean) => {
    if (optionsPaymentMethod && optionsPaymentMethod.length) {
      const newData: FeeSettingsProps[] = [];
      optionsPaymentMethod.forEach((element) => {
        const newItem: FeeSettingsProps = {
          ...clone(element),
          disabled: condition,
        };
        newData.push(newItem);
      });

      setOptionsPaymentMethod(newData);
    }
  };

  const onSelectWallet = () => {
    let value = selectedBalance > 0 ? 0 : myBalance;
    setSelectedBalance(value);

    if (!selectedBalance && total && value >= total) {
      setSelectedPayment(undefined);
      onChangeOptionPaymentMethod(true);
    } else onChangeOptionPaymentMethod(false);
  };

  const myBalance: number = myUser?.data?.Balance || 0;
  const calculate: { total: number; fee: number } =
    checkCalculationPaymentMethod(total || 0, selectedPayment);

  return (
    <ModalContainer isOpen={visible} isBottom onDismiss={onDismiss}>
      <div className="w-full bg-white rounded-t-xl between-y">
        <div className="flex-1 flex flex-col p-4 overflow-hidden relative">
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
            <div className="overflow-auto scrollbar-none">
              {type !== "top-up" && type !== "rto" && (
                <>
                  <p className="text-black70 mb-2.5">Saldo Anda</p>
                  <PaymentMethodItem
                    type="checkbox"
                    label="Saldo"
                    balance={myBalance}
                    isActive={selectedBalance > 0}
                    icon={IcWallet}
                    disabled={myBalance <= 0}
                    onSelect={onSelectWallet}
                  />

                  <div className="mb-4" />
                </>
              )}

              <p className="text-black70 mb-2.5">eWallet</p>

              {optionsPaymentMethod &&
                optionsPaymentMethod.map((item, index: number) => {
                  if (item?.key === "TRANSFER_TU") return null;

                  return (
                    <PaymentMethodItem
                      key={item?.key}
                      icon={item?.icon}
                      label={item?.label}
                      position={index}
                      isActive={selectedPayment?.key === item?.key}
                      disabled={item?.disabled}
                      onSelect={() => {
                        setSelectedPayment(
                          item?.key === selectedPayment?.key ? undefined : item
                        );
                      }}
                    />
                  );
                })}

              <div className="h-6" />
            </div>
          </LoadingPage>
        </div>

        {/* FOOTER */}
        <div className="container-button-footer">
          <div className="between-x">
            <div className="flex flex-col">
              {totalCredit && (
                <span>
                  {label ||
                    `${totalCredit} Kredit${deposit ? ` + Deposit` : ":"}`}
                </span>
              )}
              <p className="text-base text-black100/70">
                Total:{" "}
                <a className="text-blackBold font-bold">{`Rp${rupiah(
                  calculate?.total + (deposit || 0)
                )}`}</a>
              </p>
            </div>

            <Button
              label="Pilih"
              disabled={validation()}
              loading={loading}
              onClick={() => onSelect(selectedPayment, selectedBalance)}
              className="!w-[130px]"
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalPaymentMethod;
