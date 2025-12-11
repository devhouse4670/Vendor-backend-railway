import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  campaignId: { type: String, required: true, unique: true },
  campaignName: { type: String, required: true },
  userId: { type: String, required: true },
  vendorId: { type: String, required: true },
  platform: String,
  brand: String,
  handler: String,
  kpi: String,
  kpiAchieved: { type: String, default: 'no' },
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
  status: { type: String, default: 'Active' },
  payments: [{
    date: String,
    amount: Number
  }],
  campaignLinks: [{
    heading: String,
    url: String
  }]
}, {
  timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;