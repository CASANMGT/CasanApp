import { FeeSettingsProps } from "./feeSettingsType";
import { Transaction } from "./transactionType";
import { VoucherUsage } from "./voucherType";

export {};

declare global {
  type FormPersonalData = {
    fullname: string;
    nik: string;
    noSIMC: string;
    noHP: string;
    email: string;
    imageKTP: File | string | undefined;
    imageKK: File | string | undefined;
    imageSIMC: File | string | undefined;
  };

  type FormErrorPersonalData = {
    fullname?: string;
    nik?: string;
    noSIMC?: string;
    noHP?: string;
    email?: string;
    imageKTP?: string;
    imageKK?: string;
    imageSIMC?: string;
  };
}
