import { FeeSettingsProps } from "../types/feeSettingsType";

export const AddTransactionRTOBody = (
  data: RTOProps,
  credit: RTOCreditProps,
  paymentMethod: FeeSettingsProps | undefined
) => {
  return {
    deposit: data?.IsDeposited ? 0 : Number(data?.Deposit ?? 0),
    paymentMethod: paymentMethod?.key ? paymentMethod?.key : "BALANCE_FU",
    paymentProof: "",
    reference: "",
    rtocreditID: credit?.ID,
    rtoid: data?.ID,
  };
};
