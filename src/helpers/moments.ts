import dayjs, { Dayjs } from "dayjs";

export const moments = (
  date?: string | number | Date | Dayjs | null | undefined
) => {
  return dayjs(date);
};

export const getTimeEpoch = (epoch: string) => {
  return moments(parseInt(epoch)).format("HH:mm");
};
