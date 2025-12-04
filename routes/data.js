import express from "express";
import Vendor from "../models/Vendor.js";
const router = express.Router();

// GET all vendors
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// GET vendor by ID
router.get("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
});


// Add to your existing routes file

// GET vendors by user ID
router.get('/vendors/user/:userId', async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single vendor by ID (must be before /vendors/:id to avoid conflict)
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE vendor
router.delete('/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await vendor.deleteOne();
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update vendor
router.put('/vendors/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// GET vendors by user ID
router.get('/vendors/user/:userId', async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single vendor by ID
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new vendor
// POST create new vendor
router.post('/vendors', async (req, res) => {
  console.log("Received vendor data:", req.body); // ADD THIS LOG
  
  try {
    const vendor = new Vendor({
      userId: req.body.userId,
      vendorId: req.body.vendorId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      aadhaar: req.body.aadhaar,
      pan: req.body.pan,
      category: req.body.category,
      vendorType: req.body.vendorType,
      status: req.body.status,
      date: req.body.date || new Date(),
      
      // NEW FIELDS - Add these
      uploadDoc: req.body.uploadDoc || "",
      utr: req.body.utr || "",
      msg: req.body.msg || "",
      extra: req.body.extra || "",
      insertUrls: req.body.insertUrls || [{ url: "" }]
    });

    const newVendor = await vendor.save();
    console.log("Saved vendor:", newVendor); // ADD THIS LOG
    
    res.status(201).json(newVendor);
  } catch (error) {
    console.error("Error saving vendor:", error); // ADD THIS LOG
    res.status(400).json({ message: error.message });
  }
});

// PUT update vendor
router.put('/vendors/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE vendor
router.delete('/vendors/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await vendor.deleteOne();
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post("/vendors", async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    console.error("🔥 ADD VENDOR ERROR:", err);
    res.status(500).json({ error: err.message }); // Return real error
  }
});




// UPDATE vendor
router.put("/vendors/:id", async (req, res) => {
  try {
    await Vendor.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Vendor Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update vendor" });
  }
});

export default router;

router.get("/campaigns/vendor/:vendorId", async (req, res) => {
  const { vendorId } = req.params;
  const campaigns = await Campaign.find({ vendorId });
  res.json(campaigns);
});


// DELETE vendor
router.delete("/vendors/:id", async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete vendor" });
  }
});
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

/* -------------------- GET VENDORS BY USER -------------------- */
router.get("/vendors/user/:userId", async (req, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- GET SINGLE VENDOR -------------------- */
router.get("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- CREATE VENDOR -------------------- */
router.post("/vendors", async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    const saved = await vendor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* -------------------- UPDATE VENDOR -------------------- */
router.put("/vendors/:id", async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Vendor not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* -------------------- DELETE VENDOR -------------------- */
router.delete("/vendors/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.deleteOne();
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete vendor" });
  }
});

/* -------------------- GET CAMPAIGNS BY VENDOR -------------------- */
router.get("/campaigns/vendor/:vendorId", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ vendorId: req.params.vendorId });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

