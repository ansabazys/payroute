export interface ICustomer {
  _id: string;
  name: string;
  phone?: string;
  pendingAmount: number;
  location: { lat: number; lng: number };
  nextDueDate?: string;
}
