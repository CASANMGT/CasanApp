import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcCheckCircle } from "../assets";
import {
  FeeSettingsResponseProps,
  FormSelectBank,
  OptionsProps,
  REGEX_PHONE_NUMBER_HALF,
  ValidateBankBody,
} from "../common";
import { Button, Dropdown, Header, Input, LoadingPage } from "../components";
import {
  fetchFeeSettings,
  fetchValidateBank,
  resetDataValidateBank,
} from "../features";
import { useForm } from "../helpers";
import { AppDispatch, RootState } from "../store";

const SelectBank = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const feeSettings = useSelector((state: RootState) => state.feeSettings);
  const validateBank = useSelector((state: RootState) => state.validateBank);
  const myUser = useSelector((state: RootState) => state.myUser);
  const bankAccountList = useSelector(
    (state: RootState) => state.bankAccountList
  );

  const [optionsBank, setOptionsBank] = useState<OptionsProps[]>();
  const [error, setError] = useState<string>("");

  const [form, setForm] = useForm<FormSelectBank>({
    bankName: {
      name: "",
      value: "",
    },
    accountNumber: "",
  });

  useEffect(() => {
    dispatch(resetDataValidateBank());
    dispatch(fetchFeeSettings());
  }, []);

  // manage response fee settings
  useEffect(() => {
    const setUpFeeSetting = () => {
      const newData: OptionsProps[] = [];

      feeSettings?.data?.length &&
        feeSettings?.data.forEach((element) => {
          if (element?.IsWithdraw && element?.IsActive) {
            const newItem: OptionsProps = {
              name: element?.Name,
              value: element?.Code,
              data: element,
            };

            newData.push(newItem);
          }
        });

      setOptionsBank(newData);
    };

    if (feeSettings?.data) setUpFeeSetting();
  }, [feeSettings?.data]);

  // manage response validate bank account
  useEffect(() => {
    if (validateBank?.data) {
      if (!validateBank?.data?.is_found)
        setError("Nomor rekening tidak ditemukan. Cek kembali, ya");
    }
  }, [validateBank?.data]);

  const validationCheck = () => {
    let value: boolean = true;

    if (form?.bankName?.value && form.accountNumber.trim()) {
      if (form.bankName?.data?.IsEWallet) {
        let isPhoneValid: boolean = !REGEX_PHONE_NUMBER_HALF.test(
          form.accountNumber
        );
        value = isPhoneValid;
      } else value = false;
    }

    return value;
  };

  const onCheck = () => {
    let isValid: boolean = false;

    if (bankAccountList?.data && bankAccountList?.data.length) {
      const some = bankAccountList?.data.some(
        (e) => e.Number === form.accountNumber
      );

      isValid = some;
    }

    if (isValid) setError("Nomor rekening sudah didaftarkan di akun Anda");
    else {
      const dataFeeSetting: FeeSettingsResponseProps = form?.bankName?.data;

      const body: ValidateBankBody = {
        account_number: `${form.bankName?.data?.IsEWallet ? "+62" : ""}${
          form?.accountNumber
        }`,
        code: dataFeeSetting?.ExternalCode,
        reference_id: "",
      };

      dispatch(fetchValidateBank(body));
    }
  };

  const onNext = () => {
    navigate("/verification", {
      state: {
        isAddBank: true,
        phone: myUser?.data?.Phone.replace("+62", "0"),
        data: form,
      },
    });
  };

  const isFound: boolean = validateBank?.data?.is_found ? true : false;

  return (
    <div className="container-screen between-y">
      <Header title="Pilih Bank" onDismiss={() => navigate(-1)} />

      <LoadingPage loading={feeSettings?.loading || bankAccountList?.loading}>
        <div className="flex-1">
          <div className="bg-white p-4 space-y-4">
            <Dropdown
              select={form.bankName?.name}
              placeholder="Nama Bank/Digital Wallet"
              options={optionsBank}
              onSelect={(select) => setForm("bankName", select)}
            />

            <div>
              <Input
                type={form.bankName?.data?.IsEWallet ? "phone" : "number"}
                inputMode="numeric"
                value={form.accountNumber}
                placeholder="Nomor Rekening/Handphone"
                error={error}
                onChange={(value) => {
                  if (error) setError("");
                  setForm("accountNumber", value);
                }}
              />

              {isFound && (
                <div className="row mt-1 ml-5 text-blackBold ">
                  <IcCheckCircle />

                  <p className="ml-1 text-xs">
                    Atas nama{" "}
                    <b className="text-xs font-semibold">
                      {validateBank?.data?.account_name}
                    </b>
                  </p>
                </div>
              )}
            </div>

            <Button
              label="Cek"
              loading={validateBank?.loading}
              disabled={validationCheck()}
              onClick={onCheck}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="container-button-footer">
          <Button
            buttonType="lg"
            label="Simpan Rekening"
            disabled={!isFound}
            onClick={onNext}
          />
        </div>
      </LoadingPage>
    </div>
  );
};

export default SelectBank;
