const Item = require('../models/Item');

// Create Lost Item
const reportLostItem = async (req, res) => {
  try {
    const { title, description, campus, location, imageUrl } = req.body;

    const item = new Item({
      userId: req.user.id,
      type: 'lost',
      title,
      description,
      campus,
      location,
      imageUrl,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error reporting lost item', error: error.message });
  }
};

// Create Found Item
const reportFoundItem = async (req, res) => {
  try {
    const { title, description, campus, location, imageUrl } = req.body;

    const item = new Item({
      userId: req.user.id,
      type: 'found',
      title,
      description,
      campus,
      location,
      imageUrl,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error reporting found item', error: error.message });
  }
};

// Read All Items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// Update Item by owner or admin
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check if the user is owner or admin
    if (item.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { title, description, campus, location, imageUrl, status } = req.body;

    // Only Admin can update status
    if (status && req.user.isAdmin) {
      item.status = status;
    }

    // For users
    if (title) item.title = title;
    if (description) item.description = description;
    if (campus) item.campus = campus;
    if (location) item.location = location

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

// Delete Item by owner or admin
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check if the user is owner or admin
    if (item.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

// Admin Verify Item
const verifyItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, { status: 'verified' }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error verifying item', error: error.message });
  }
};

// Match Suggestion
const getMatchSuggestions = async (req, res) => {
  try {
    // fetch verified lost and found items
    const lostItems = await Item.find({ type: 'lost', status: 'verified' });
    const foundItems = await Item.find({ type: 'found', status: 'verified' });

    // Match by wordings
    const suggestions = [];

    lostItems.forEach((lost) => {
      foundItems.forEach((found) => {
        if (
          lost.campus === found.campus && // match for same campus
          (lost.title.toLowerCase().includes(found.title.toLowerCase()) ||
            found.title.toLowerCase().includes(lost.title.toLowerCase()) ||
            (lost.description && found.description && lost.description.toLowerCase().includes(found.description.toLowerCase())) ||
            (lost.description && found.description && found.description.toLowerCase().includes(lost.description.toLowerCase())))
        ) {
          suggestions.push({ lost, found });
        }
      });
    });

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting match suggestions', error: error.message });
  }
};

module.exports = {
  reportLostItem,
  reportFoundItem,
  getAllItems,
  updateItem,
  deleteItem,
  verifyItem,
  getMatchSuggestions
};