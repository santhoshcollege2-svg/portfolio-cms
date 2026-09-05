const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const verifyToken = require('../middleware/authMiddleware');

// Upload a single image (protected)
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;