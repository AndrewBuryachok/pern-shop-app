export interface CreateTransferDto {
  senderCardId: number;
  receiverCardId: number;
  sum: number;
  description: string;
}

export interface DeleteTransactionDto {
  transactionId: number;
}
