import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Header, Input } from "../components";
import { useState } from "react";
import { OptionsProps } from "../common";
import { useForm } from "../helpers";
import { IcCheckCircle } from "../assets";

interface FormSelectBank {
  bankName: OptionsProps;
  accountNumber: string;
}

const optionDummy: OptionsProps[] = [
  { name: "1A", value: 1 },
  { name: "2A", value: 2 },
  { name: "5A", value: 3 },
];
const SelectBank = () => {
  const navigate = useNavigate();

  const [bankName, setBankName] = useState<OptionsProps>();
  const [accountNumber, setAccountNumber] = useState<string>("");

  const [form, setForm] = useForm<FormSelectBank>({
    bankName: {
      name: "",
      value: "",
    },
    accountNumber: "",
  });

  const validation = () => {
    let value: boolean = true;

    if (form?.bankName?.value && form.accountNumber.trim()) value = false;

    return value;
  };

  const onSelect = () => {
    alert("coming soon");
  };

  return (
    <div className="container-screen between-y">
      <Header title="Pilih Bank" onDismiss={() => navigate(-1)} />

      <div className="flex-1">
        <div className="bg-white p-4 space-y-4">
          <Dropdown
            select={form.bankName?.name}
            placeholder="Nama Bank/Digital Wallet"
            options={optionDummy}
            onSelect={(select) => setForm("bankName", select)}
          />

          <div>
            <Input
              type="number"
              value={form.accountNumber}
              placeholder="Nomor Rekening/Handphone"
              onChange={(value) => setForm("accountNumber", value)}
            />

            <div className="row mt-1 ml-5 text-blackBold ">
              <IcCheckCircle />

              <p className="ml-1 text-xs">
                Atas nama <b className="text-xs font-semibold">Tedy</b>
              </p>
            </div>
          </div>

          <Button label="Cek" onClick={() => {}} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
        <Button
          buttonType="lg"
          label="Simpan Rekening"
          disabled={validation()}
          onClick={onSelect}
        />
      </div>
    </div>
  );
};

export default SelectBank;
