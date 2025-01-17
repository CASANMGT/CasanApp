/* 
    format number
    example result +62 081 2081 0812
*/
export const formatPhoneNumber = (phone: string) => {
  let value: string = "";

  if (phone) {
    if (phone.slice(0, 3) == "+62") {
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
