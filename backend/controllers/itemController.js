const Item = require('../models/Item');

// Add item
const addItem = async (req, res) => {
    try {
        const { title, description, type, deadline } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const item = await Item.create({
            userId: req.user.id,
            title,
            description,
            type,
            image: imagePath,
            deadline,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

// Admin get pending items
const getPendingItems = async (req, res) => {
    try {
        const items = await Item.find({ status: 'pending' });
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
        if (item.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description, type, deadline } = req.body;
        if (title) item.title = title;
        if (description) item.description = description;
        if (type) item.type = type;
        if (deadline) item.deadline = deadline;
        if (req.file) item.image = `/uploads/${req.file.filename}`;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin approve item
const approveItem = async (req, res) => {
    try {
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
    getPendingItems,
    updateItem,
    approveItem,
    rejectItem
};