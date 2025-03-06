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