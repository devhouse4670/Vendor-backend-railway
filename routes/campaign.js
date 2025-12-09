import express from 'express';
import Campaign from '../models/Campaign.js';

const router = express.Router();

// // GET all campaigns for a specific vendor
// router.get('/vendor/:vendorId', async (req, res) => {
//   try {
//     const campaigns = await Campaign.find({ vendorId: req.params.vendorId });
//     res.json(campaigns);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET single campaign by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id);
//     if (!campaign) {
//       return res.status(404).json({ message: 'Campaign not found' });
//     }
//     res.json(campaign);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ vendorId: req.params.vendorId });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET all campaigns for a specific user (MISSING ROUTE)
// If your front-end is calling /api/campaigns/user/{id}, you need this!
router.get('/user/:userId', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ userId: req.params.userId });
        res.json(campaigns);
    } catch (error) {
        // Use 500 status for server/db errors
        res.status(500).json({ message: error.message }); 
    }
});

// 3. GET single campaign by ID (GENERIC - MUST COME AFTER SPECIFIC ROUTES)
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    const newCampaign = await campaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update campaign
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
    res.status(400).json({ message: error.message });
  }
});

// DELETE campaign
router.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
