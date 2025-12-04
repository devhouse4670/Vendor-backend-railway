import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true
  },
  vendorId: {
    type: String,
    required: true
  },
  campaignName: {
    type: String,
    required: true
  },
  brand: String,
  platform: String,
  budget: Number,
  duration: String,
  startDate: Date,
  endDate: Date,
  handler: String,
  kpi: String,
  kpiAchieved: String,
  btag: String,
  btagLogin: String,
  btagPassword: String,
  bankDetails: String,
  msg: String,
  extra: String,
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

campaignSchema.index({ vendorId: 1 });

export default mongoose.model('Campaign', campaignSchema);