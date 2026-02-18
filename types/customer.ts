import { Types } from "mongoose";

export interface ICustomer {
  _id: string;
  ownerId: Types.ObjectId | string;

  name: string;
  phone?: string;
  address?: string;

  location?: {
    lat?: number | null;
    lng?: number | null;
  };

  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;

  nextDueDate?: Date;
  lastPaymentDate?: Date;

  installmentType: "monthly" | "weekly" | "manual";

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
