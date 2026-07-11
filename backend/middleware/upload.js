const multer = require("multer");
const path   = require("path");
const crypto = require("crypto");

const ALLOWED = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_MB  = parseInt(process.env.MAX_FILE_SIZE_MB || "2");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, name);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED.includes(ext)) cb(null, true);
  else cb(new Error("Format non supporté (jpg, png, webp)"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
});

module.exports = upload;
