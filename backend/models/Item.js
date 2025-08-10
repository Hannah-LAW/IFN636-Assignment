const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const sinon = require('sinon');
const Item = require('../models/Item');
const { reportLostItem, reportFoundItem, getAllItems, updateItem,  deleteItem, verifyItem, getMatchSuggestions } = require('../controllers/itemController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: String,
  Campus: { type: String, enum: ['Gardens Point', 'Kelvin Grove'], required: true },
  Location: String,
  imageUrl: String,
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
