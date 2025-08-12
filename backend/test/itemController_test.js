const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Item = require('../models/Item');
const {
  addItem,
  approveItem,
  getPendingItems
} = require('../controllers/itemController');

describe('Item Controller Tests', () => {
  afterEach(() => {
    sinon.restore(); // restore stub/mock after test
  });

  describe('addItem', () => {
    it('should create a new item successfully', async () => {
      const fakeUserId = new mongoose.Types.ObjectId();

      const req = {
        user: { id: fakeUserId },
        body: {
          title: 'Lost wallet',
          description: 'Black leather wallet',
          status: 'pending',
          // imageUrl add req.file.location or req.file.path, etc. from multer middleware
        },
        file: {
          location: 'https://fake-s3-url.com/image.jpg' // fake example
        }
      };

      const createdItem = {
        _id: new mongoose.Types.ObjectId(),
        userId: fakeUserId,
        title: req.body.title,
        description: req.body.description,
        status: 'pending',
        imageUrl: req.file.location
      };

      const createStub = sinon.stub(Item, 'create').resolves(createdItem);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addItem(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.firstCall.args[0]).to.include({
        userId: fakeUserId,
        title: 'Lost wallet',
        description: 'Black leather wallet',
        status: 'pending',
        imageUrl: 'https://fake-s3-url.com/image.jpg'
      });
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdItem)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const createStub = sinon.stub(Item, 'create').throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { title: 'Lost wallet' },
        file: {}
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('approveItem', () => {
    it('should approve an item successfully', async () => {
      const fakeItemId = new mongoose.Types.ObjectId();
      const fakeItem = {
        _id: fakeItemId,
        status: 'pending',
        save: sinon.stub().resolves()
      };

      const findByIdStub = sinon.stub(Item, 'findById').resolves(fakeItem);

      const req = { params: { id: fakeItemId.toString() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await approveItem(req, res);

      expect(findByIdStub.calledOnceWith(fakeItemId.toString())).to.be.true;
      expect(fakeItem.status).to.equal('approved');
      expect(fakeItem.save.calledOnce).to.be.true;
      expect(res.json.calledWith(fakeItem)).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      const findByIdStub = sinon.stub(Item, 'findById').resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await approveItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      const findByIdStub = sinon.stub(Item, 'findById').throws(new Error('DB Error'));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await approveItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('getPendingItems', () => {
    it('should get all pending items', async () => {
      const fakeItems = [
        { _id: new mongoose.Types.ObjectId(), status: 'pending', title: 'Lost keys' },
        { _id: new mongoose.Types.ObjectId(), status: 'pending', title: 'Found phone' }
      ];

      const findStub = sinon.stub(Item, 'find').resolves(fakeItems);

      const req = {};
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getPendingItems(req, res);

      expect(findStub.calledOnceWith({ status: 'pending' })).to.be.true;
      expect(res.json.calledWith(fakeItems)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const findStub = sinon.stub(Item, 'find').throws(new Error('DB Error'));

      const req = {};
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getPendingItems(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });
});
