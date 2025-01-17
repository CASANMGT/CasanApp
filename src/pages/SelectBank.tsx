import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Header, Input } from "../components";
import { useState } from "react";
import { OptionDropdownProps } from "../common";

const optionDummy: OptionDropdownProps[] = [
  { name: "1A", value: 1 },
  { name: "2A", value: 2 },
  { name: "5A", value: 3 },
];

const SelectBank = () => {
  const navigate = useNavigate();

  const [bankName, setBankName] = useState<OptionDropdownProps>();
  const [accountNumber, setAccountNumber] = useState<string>("");

  const onSelect = () => {
    alert("coming soon");
  };

  return (
    <div className="container-screen between-y">
      <Header title="Pilih Bank" onDismiss={() => navigate(-1)} />

      <div className="flex-1">
        <div className="bg-white p-4">
          <Dropdown
            select={bankName?.name}
            placeholder="Nama Bank/Digital Wallet"
            options={optionDummy}
            onSelect={(select) => setBankName(select)}
            className="mb-4"
          />

          <Input
            value={accountNumber}
            placeholder="Nomor Rekening/Handphone"
            error="Nomor rekening tidak ditemukan. Cek kembali, ya"
            onChange={(value) => setAccountNumber(value)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
        <Button buttonType="lg" label="Simpan Rekening" onClick={onSelect} />
      </div>
    </div>
  );
};

export default SelectBank;
