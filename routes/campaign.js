import express from 'express';
import Campaign from '../models/Campaign.js';

const router = express.Router();

// ------------------------------------
// ➡️ GET ROUTES (READ OPERATIONS)
// ------------------------------------

// 1. GET all campaigns (The root of this router)
// Target URL (conceptual): /api/campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching all campaigns:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// 2. GET all campaigns for a specific vendor (MOST SPECIFIC)
// Target URL (conceptual): /api/campaigns/vendor/:vendorId
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ vendorId: req.params.vendorId });
        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns by vendor:", error);
        res.status(500).json({ message: error.message });
    }
});

// 3. GET all campaigns for a specific user (SPECIFIC)
// Target URL (conceptual): /api/campaigns/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ userId: req.params.userId });
        res.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns by user:", error);
        res.status(500).json({ message: error.message });
    }
});

// 4. GET single campaign by ID (GENERIC - MUST BE LAST)
// Target URL (conceptual): /api/campaigns/:id
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        // Mongoose CastError for invalid ID format will hit here
        console.error("Error fetching single campaign:", error);
        res.status(500).json({ message: error.message });
    }
});

// ------------------------------------
// ✏️ WRITE ROUTES (CREATE, UPDATE, DELETE)
// ------------------------------------

// 5. POST - Create new campaign
// Target URL (conceptual): /api/campaigns
router.post('/', async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        const newCampaign = await campaign.save();
        res.status(201).json(newCampaign);
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(400).json({ message: error.message });
    }
});

// 6. PUT - Update campaign
// Target URL (conceptual): /api/campaigns/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
      
        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
      
        res.json(updatedCampaign);
    } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(400).json({ message: error.message });
    }
});

// 7. DELETE campaign
// Target URL (conceptual): /api/campaigns/:id
router.delete('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
      
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
      
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
