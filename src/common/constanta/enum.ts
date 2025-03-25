export enum SessionStatus {
  "Waiting For Payment" = 1, // when user has not paid
  "Stand By" = 2, // when they already paid but not started diagnostic => BE (idle)
  "On Diagnostic" = 3, // when starting diagnostic
  "Finish Diagnostic" = 4, // when finishing diagnostic
  "Charging" = 5, // when charging => BE (OnCharging)
  "Finished" = 6, // done charging => BE (FinishCharging)
  "Payment Expired" = 7, // payment expired => BE (ExpiredPayment)
  "Canceled" = 8, // session canceled => BE (CanceledSession)
}

export enum TransactionStatus {
  "Completed" = 1,
  "Pending" = 2,
  "Expired" = 3,
  "Canceled" = 4,
  "Challenged" = 5,
  "Failed" = 6,
}

export enum TransactionType {
  "TopUp" = 1,
  "Session" = 2,
}

export enum DeviceStatus {
  "StandBy" = 0,
  "Charging" = 1,
  "Disconnect" = 3,
}

export enum BalanceStatus {
  "TopUpBalance" = 1,
  "RefundSession" = 2,
  "SessionPayment" = 3,
  "WithdrawBalance" = 4,
}

export enum DaysOfWeek {
  Senin = 1,
  Selasa = 2,
  Rabu = 3,
  Kamis = 4,
  Jumat = 5,
  Sabtu = 6,
  Minggu = 0,
}

export enum StringNumber {
  A=1,
  B=2,
  C=3,
  D=4,
  E=5,
  F=6,
  G=7,
  H=8,
  I=9,
  J=10,
  K=11,
  L=12,
  M=13,
  N=14,
  O=15,
  P=16,
  Q=17,
  R=18,
  S=19,
  T=20,
  U=21,
  V=22,
  W=23,
  X=24,
  Y=25,
  Z=26,
}