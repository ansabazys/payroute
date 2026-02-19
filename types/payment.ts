export interface IPayment {
  _id: string;
  customerId: string;
  ownerId: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
