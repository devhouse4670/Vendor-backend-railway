import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    vendorId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    aadhaar: {
      type: String,
      required: true,
    },

    pan: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Freelance", "Agency"],
      default: "Freelance",
    },
    vendorType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Future", "Stand By", "Blacklist"],
      default: "Active",
    },
    date: {
      type: Date,
      default: Date.now,
    },

    uploadDocs: {
      type: [String], // multiple file URLs
      default: [],
    },
    utr: { type: String, default: "" },
    msg: { type: String, default: "" },
    extra: { type: String, default: "" },
    insertUrls: {
      type: [
        {
          url: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vendor", vendorSchema);
