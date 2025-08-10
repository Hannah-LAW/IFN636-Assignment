const express = require('express');
const router = express.Router();
const {
  reportLostItem,
  reportFoundItem,
  getAllItems,
  updateItem,
  deleteItem,
  verifyItem,
  getMatchSuggestions
} = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/lost', protect, reportLostItem);
router.post('/found', protect, reportFoundItem);
router.get('/', protect, getAllItems);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.put('/verify/:id', protect, admin, verifyItem);
router.get('/matches', protect, getMatchSuggestions);

module.exports = router;
