const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image file uploaded",
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "olive-art-creations",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed:", error);

            return res.status(500).json({
              message: "Image upload failed",
            });
          }

          res.json({
            imageUrl: result.secure_url,
          });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error) {
      console.error("Upload route error:", error.message);

      res.status(500).json({
        message: "Image upload failed",
      });
    }
  }
);

module.exports = router;