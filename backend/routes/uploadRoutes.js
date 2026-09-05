const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ url: req.file.path });
  });
});

module.exports = router;