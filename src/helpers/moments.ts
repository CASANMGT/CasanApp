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

export const formatDiff = (date: string) => {
  const targetDate = moments("2025-08-15T00:00:00Z");
  const now = moments();

  const diffMs = targetDate.diff(now);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let message = "beberapa saat lagi";

  if (diffDays >= 1) {
    message = `Sisa ${diffDays} hari lagi`;
  } else if (diffHours >= 1) {
    message = `Sisa ${diffHours} jam lagi`;
  } else if (diffMinutes >= 1) {
    message = `Sisa ${diffMinutes} menit lagi`;
  }

  return message;
};

export const timeToSeconds = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};

export const convertToHours = (time: string): number => {
  if (!time) return 0;

  const [hh, mm] = time.split(":").map(Number);
  return hh + (mm > 0 ? mm / 60 : 0);
};

export const formatDuration = (seconds?: number): string => {
  let value: string = "";
  const s: number = seconds || 0;

  if (s > 0) {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);

    value = `${hours ? `${hours} Jam ` : ""}`;

    if (minutes > 0) value += `${minutes} Menit`;
  }

  return value;
};

export const formatTime = (seconds?: number): string => {
  const s: number = seconds || 0;

  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  return [
    hrs.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
};

export const formatMinutesToHHMM = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};
