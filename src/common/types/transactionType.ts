export type Transaction = {
    ID: number
    UserID: number
    DueAmount: number
    Amount: number
    WalletUsedAmount: number
    TotalFee: number
    Type: number
    Status: number
    RefTransactionID: any
    PaymentMethod: string
    DeepLinkRedirectURL: string
    GeneratedQRCodeURL: string
    CreatedAt: string
    UpdatedAt: string
}