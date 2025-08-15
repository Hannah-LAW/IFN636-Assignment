const Item = require('../models/Item');

// Add item
const addItem = async (req, res) => {
  try {
    const { title, description, type, campus, location, deadline } = req.body;

    // Multer might throw error if file invalid
    // let imagePath = null;
    // if (req.file) {
    //   imagePath = `/uploads/${req.file.filename}`;
    // }

    // Log for debugging
    console.log('addItem req.body:', req.body);
    console.log('addItem req.file:', req.file);

    const item = await Item.create({
      userId: req.user.id,
      title,
      description,
      type,
      campus: campus || undefined,
      location,
      //image: imagePath,
      deadline
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('addItem error:', error);
    
    // If multer file filter error
    // if (error instanceof multer.MulterError || error.message.includes('Only images')) {
    //   return res.status(400).json({ message: error.message });
    // }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get approved items（for user listing）
const getApprovedItems = async (req, res) => {
    try {
        const items = await Item.find({ status: 'approved' });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get own items（for user managing item）
const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item（by user）
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (req.user.role !== 'admin' && item.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        const { title, description, type, campus, location, deadline } = req.body;
        if (title) item.title = title;
        if (description) item.description = description;
        if (type) item.type = type;
        if (campus) item.campus = campus;
        if (location) item.location = location;
        //if (req.file) item.image = `/uploads/${req.file.filename}`;
        if (deadline) item.deadline = deadline;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        console.error('updateItem error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Admin get pending items
const getPendingItems = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const items = await Item.find({ status: 'pending' });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin approve item
const approveItem = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
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
        if (req.user.role !== 'admin') {
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
    getPendingItems,
    approveItem,
    rejectItem
};