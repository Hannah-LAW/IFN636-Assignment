const Item = require('../models/Item');

// Get Item
const getItems = async (req, res) => {
  try {
    const { type } = req.query; // 可以用 ?type=lost 或 ?type=found 來 filter
    const query = { userId: req.user.id };
    if (type) query.type = type;

    const items = await Item.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Item (Lost/Found)
const createItem = async (req, res) => {
  const { type, title, description, Campus, Location, imageUrl } = req.body;
  try {
    const newItem = await Item.create({
      userId: req.user.id,
      type,
      title,
      description,
      Campus,
      Location,
      imageUrl,
      status: 'pending',
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Item
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { type, title, description, Campus, Location, imageUrl, status } = req.body;

    item.type = type || item.type;
    item.title = title || item.title;
    item.description = description || item.description;
    item.Campus = Campus || item.Campus;
    item.Location = Location || item.Location;
    item.imageUrl = imageUrl || item.imageUrl;
    item.status = status || item.status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
