const express = require('express');
const router = express.Router();
const { addItem, getApprovedItems, getMyItems, updateItem, deleteItem, getPendingItems, approveItem, rejectItem } = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, /* upload.single('image'), */ addItem)
  .get(protect, getApprovedItems);

router.get('/my', protect, getMyItems);

router.route('/:id')
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.get('/pending', protect, admin, getPendingItems);
router.put('/:id/approve', protect, admin, approveItem);
router.put('/:id/reject', protect, admin, rejectItem);

module.exports = router;