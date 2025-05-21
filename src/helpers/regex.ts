export const replaceNominal: (nominal: string) => number = (
  nominal: string
) => {
  return Number(nominal.replace("Rp", "").replace(/\./g, ""));
};
