import { FormSession } from "../types/sessionType";

export const FormDefaultSession: FormSession = {
  voltage: { name: "48V", value: 54.6 },
  ampere: { name: "2A", value: 2 },
  selectedSocket: undefined,
  selectedTab: "1",
  nominal: "",
  time: "00:00",
  paymentMethod: undefined,
  balance:0,
  phoneNumber: "",
};
