const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage location
const uploadDir = path.join(
    "X:",
    "RD",
    "RDGROUP",
    "115. Tongmean",
    "000 Sytem Assets",
    "Bom_Portal",
    "Certificate"
);

// Create folder if not exists
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const filename = Buffer.from(
            file.originalname,
            "latin1"
        )
            .toString("utf8")
            .replace(/\s+/g, "_")
            .replace(/[^\w\-_.ก-๙]/g, "");

        cb(null, filename);
    },
});

// Upload configuration
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

// Middleware
const uploadCertificateMiddleware = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    msg: "File size exceeds 10MB limit.",
                });
            }

            return res.status(400).json({
                success: false,
                msg: err.message,
            });
        }

        if (err) {
            return res.status(500).json({
                success: false,
                msg: "File upload failed.",
                error: err.message,
            });
        }

        next();
    });
};

module.exports = {
    uploadCertificateMiddleware,
    uploadDir,
};