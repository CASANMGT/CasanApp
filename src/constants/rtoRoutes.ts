/**
 * RTO navigation — satu sumber kebenaran supaya tidak ada link putus.
 * Beranda RTO = Home tab "Rent to Own" (bukan halaman terpisah).
 */
export const RTO_HOME_TAB_PATH = "/home/index?tab=rto" as const;

export const rtoProgramExplorePath = () => "/rto-program-explore";
export const rtoOperatorPath = (operatorId: string) =>
  `/rto-program-explore/operator/${operatorId}`;
export const rtoBikePath = (bikeId: string) =>
  `/rto-program-explore/bike/${bikeId}`;
