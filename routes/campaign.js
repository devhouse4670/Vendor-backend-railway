import express from 'express';
import Campaign from '../models/Campaign.js';

const router = express.Router();

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get campaign by ID
router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get campaigns by user ID
router.get('/campaigns/user/:userId', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    console.error('Error fetching user campaigns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get campaigns by vendor ID
router.get('/campaigns/vendor/:vendorId', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    console.error('Error fetching vendor campaigns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new campaign
router.post('/campaigns', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete campaign
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
