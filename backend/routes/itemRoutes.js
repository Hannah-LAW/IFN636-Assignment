
const express = require('express');
const router = express.Router();
const { addItem, getApprovedItems, getMyItems, getPendingItems, updateItem, approveItem, rejectItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.route('/')
  .post(protect, upload.single('image'), addItem)
  .get(protect, getApprovedItems);

router.get('/pending', protect, admin, getPendingItems);

router.get('/my', protect, getMyItems);

router.put('/:id', protect, upload.single('image'), updateItem);

router.put('/:id/approve', protect, admin, approveItem);

router.put('/:id/reject', protect, admin, rejectItem);


module.exports = router;