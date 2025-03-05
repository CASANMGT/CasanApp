import dayjs, { Dayjs } from "dayjs";

export const moments = (
  date?: string | number | Date | Dayjs | null | undefined
) => {
  return dayjs(date);
};

export const getTimeEpoch = (epoch: string) => {
  return moments(parseInt(epoch)).format("HH:mm");
};

export const setDiff = (startTime: string, endTime: string) => {
  const diffInSeconds: number = moments(endTime).diff(
    moments(startTime),
    "seconds"
  );

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const secs = diffInSeconds % 60;

  let value: string;

  if (hours || minutes) value = `${hours} jam ${minutes} menit`;
  else value = `${secs} detik`;

  return value;
};

export const timeToSeconds = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};