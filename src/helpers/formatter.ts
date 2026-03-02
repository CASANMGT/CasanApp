/* 
    format number
    example result +62 081 2081 0812
*/
export const formatPhoneNumber = (phone: string) => {
  let value: string = "";

  if (phone) {
    if (phone.slice(0, 3) === "021") {
      const length: number = phone.length;
      const first: string = phone.slice(0, 3);
      const second: string = phone.slice(3, 6);
      const third = phone.slice(6, length);
      return `${first} ${second} ${third}`;
    } else if (phone.slice(0, 3) == "+62") {
      const length: number = phone.length;
      const first: string = phone.slice(0, 3);
      const second: string = phone.slice(3, 6);
      const third: string = phone.slice(6, 10);
      const fourth = phone.slice(10, length);

      return `${first} ${second} ${third} ${fourth}`;
    } else {
      const length: number = phone.length;
      const first: string = phone.slice(1, 4);
      const second: string = phone.slice(4, 8);
      const third: string = phone.slice(8, length);

      return `+62 ${first} ${second} ${third}`;
    }
  }

  return value;
};

export const formatSpaceNumber = (number: string) => {
  return number.replace(/\d{4}(?=.)/g, "$& ");
};

export const convertPhoneTo62 = (phone?: string): string => {
  if (!phone) return "";

  const trimmed = phone.trim();

  if (trimmed.startsWith("+62")) return trimmed;
  if (trimmed.startsWith("62")) return `+${trimmed}`;
  if (trimmed.startsWith("0")) return `+62${trimmed.slice(1)}`;

  return `+62${trimmed}`;
};