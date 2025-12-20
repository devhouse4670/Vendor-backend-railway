import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  utr: { type: String, default: "" }
}, { _id: false });

const linkSchema = new mongoose.Schema({
  heading: String,
  url: String
}, { _id: false });

const campaignSchema = new mongoose.Schema({
  campaignId: { type: String, required: true, unique: true },
  campaignName: { type: String, required: true },
  userId: { type: String, required: true },
  vendorId: { type: String, required: true },

  url: String,
  platform: String,
  brand: String,
  handler: String,
  kpi: String,
  kpiAchieved: { type: String, default: "no" },

  btag: String,
  btagLogin: String,
  btagPassword: String,
  budget: Number,
  duration: String,
  startDate: Date,
  endDate: Date,
  bankDetails: String,
  msg: String,
  extra: String,
<<<<<<< HEAD
  status: { type: String, default: "Active" },

  payments: [paymentSchema],
  campaignLinks: [linkSchema]

}, { timestamps: true });

campaignSchema.pre("save", function (next) {
  console.log("🔍 Saving Campaign...");
  console.log("💰 Payments:", this.payments);
  next();
=======
  status: { type: String, default: 'Active' },
  payments: [{
    date: String,
    amount: Number,
          utr: { type: String }   // <-- THIS MUST EXIST

  }],
  campaignLinks: [{
    heading: String,
    url: String
  }]
}, {
  timestamps: true
>>>>>>> 2147dbcfea20c13c10c9a41d3bf2431d7e36af94
});

campaignSchema.post("save", function (doc) {
  console.log("✅ Campaign Saved");
  console.log("💾 Saved Payments:", doc.payments);
});

<<<<<<< HEAD
export default mongoose.model("Campaign", campaignSchema);
=======
export default Campaign;
>>>>>>> 2147dbcfea20c13c10c9a41d3bf2431d7e36af94
