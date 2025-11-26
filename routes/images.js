// backend/routes/images.js
const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary");
const Image = require("../models/Image");

// POST /api/images/upload
router.post("/upload", async (req, res) => {
  try {
    const { name, cover, folder, type } = req.body; // <-- Added 'type'

    // Validate required fields
    if (!name || !cover || !folder || !type) {
      return res.status(400).json({ error: "All fields (name, cover, folder, type) are required" });
    }

    // Generate slug from name
    const id = name.trim().toLowerCase().replace(/\s+/g, "-");

    // Fetch media from Cloudinary folder
    const result = await cloudinary.search
      .expression(`folder:"${folder}"`)
      .sort_by("public_id", "asc")
      .max_results(100)
      .execute();

    const allMedia = result.resources.map((item) => ({
      url: item.secure_url,
      type: item.resource_type, // 'image' or 'video'
    }));

    // Exclude the cover image from the array of images
    const filteredMedia = allMedia.filter((item) => item.url !== cover);

    // Create new Image document
    const imageData = new Image({
      id,
      name,
      type,      // <-- Save type here
      cover,
      images: filteredMedia,
    });

    await imageData.save();

    console.log("✅ Data saved to MongoDB:");
    console.log(JSON.stringify(imageData, null, 2));

    res.status(201).json({ message: "✅ Folder imported and saved!", data: imageData });
  } catch (error) {
    console.error("❌ Error uploading folder:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET all images
router.get("/", async (req, res) => {
  try {
    const data = await Image.find();
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// GET single image folder by id
router.get("/:id", async (req, res) => {
  try {
    const data = await Image.findOne({ id: req.params.id });
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
