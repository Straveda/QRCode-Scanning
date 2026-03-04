// backend/middleware/upload.js
import multer from "multer";

// Use memoryStorage so that req.body text fields are properly populated.
// With CloudinaryStorage in multer v2, text fields are NOT parsed into req.body.
// We manually upload the buffer to Cloudinary in the controller instead.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png, webp images are allowed"));
    }
  },
});
