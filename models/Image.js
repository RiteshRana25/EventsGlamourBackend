
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    cover: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
