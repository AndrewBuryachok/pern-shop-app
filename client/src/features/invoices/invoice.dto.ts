export interface CreateInvoiceDto {
  senderCardId: number;
  receiverUserId: number;
  sum: number;
  description: string;
}

export interface CompleteInvoiceDto {
  invoiceId: number;
  cardId: number;
}

export interface DeleteInvoiceDto {
  invoiceId: number;
}
