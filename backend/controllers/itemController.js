const Item = require('../models/Item');

// Add item
const addItem = async (req, res) => {
  // Create a new lost/found item by user
  try {
    const { title, description, type, campus, location, deadline } = req.body;

    console.log('addItem req.body:', req.body);

    const item = await Item.create({
      userId: req.user.id,
      title,
      description,
      type,
      campus: campus || undefined,
      location,
      deadline,
      status: 'pending',
      lastAction: 'User added item'
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('addItem error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get items
// Get approved items & own pending/approved items
const getApprovedItems = async (req, res) => {
  try {
    const items = await Item.find({
      $or: [
        { userId: req.user.id },
        { status: 'approved' }
      ]
    }).populate('userId', 'email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get only the current user's items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  // Update item details if authorized
  // Regular user edits make status pending
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (req.user.role !== 'Admin' && item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { title, description, type, campus, location, deadline } = req.body;
    if (title) item.title = title;
    if (description) item.description = description;
    if (type) item.type = type;
    if (campus) item.campus = campus;
    if (location) item.location = location;
    if (deadline) item.deadline = deadline;

    // Item status change to pending after user update
    if (req.user.role !== 'Admin')
      {
      item.status = 'pending';
      item.lastAction = 'User edited item';
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('updateItem error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Users can delete their own items
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.remove();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('deleteItem error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin get all pending items
const getPendingItems = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const items = await Item.find({ status: 'pending' }).populate('userId', 'email');;
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approve item
const approveItem = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.status = 'approved';
    await item.save();
    res.json({ message: 'Item approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin reject item
const rejectItem = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.status = 'rejected';
    await item.save();
    res.json({ message: 'Item rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addItem,
  getApprovedItems,
  getMyItems,
  updateItem,
  deleteItem,
  getPendingItems,
  approveItem,
  rejectItem
};