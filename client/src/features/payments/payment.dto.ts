export interface CreatePaymentDto {
  senderCardId: number;
  receiverCardId: number;
  sum: number;
  description: string;
}

export interface DeletePaymentDto {
  paymentId: number;
}
