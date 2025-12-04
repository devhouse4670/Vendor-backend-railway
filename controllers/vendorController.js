import Vendor from "../models/Vendor.js";
import generateId from "../utils/generateId.js";

// Create vendor
export const createVendor = async (req, res) => {
  try {
    const vendorId = generateId("V");
    
    const vendor = await Vendor.create({
      vendorId,
      ...req.body
    });
    
    res.status(201).json({ success: true, ...vendor._doc });
  } catch (err) {
    console.error("Create vendor error:", err);
    res.status(500).json({ error: "Failed to add vendor", message: err.message });
  }
};

// Get all vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
};

// Get vendor by ID
export const getVendorById = async (req, res) => {
  try {
    console.log("Requested vendor ID:", req.params.vendorId);

    const vendor = await Vendor.findOne({ vendorId: req.params.vendorId });

    console.log("DB result:", vendor);

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json(vendor);
  } catch (error) {
    console.error("ERROR in getVendorById:", error);
    res.status(500).json({ message: error.message });
  }
};


// Update vendor
export const updateVendor = async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Vendor not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update vendor" });
  }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
  try {
    const deleted = await Vendor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Vendor not found" });
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete vendor" });
  }
};