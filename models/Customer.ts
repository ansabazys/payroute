import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      required: true,
    },

    nextDueDate: {
      type: Date,
    },

    lastPaymentDate: {
      type: Date,
    },

    installmentType: {
      type: String,
      enum: ["monthly", "weekly", "manual"],
      default: "manual",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
