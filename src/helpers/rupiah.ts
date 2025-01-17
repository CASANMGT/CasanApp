export const rupiah = (price: string | number) => {
  if (!price) return 0;

  const addDots = (nStr: string) => {
    nStr += "";

    const rgx: RegExp = /(\d+)(\d{3})/;
    const x: string[] = nStr.split(".");
    let x1: string = x[0];
    const x2: string = x.length > 1 ? "." + x[1] : "";

    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "." + "$2");
    }

    return x1 + x2;
  };

  return `${addDots(
    Math.round(parseInt(price.toString())).toString()
  ).toString()}`;
};
