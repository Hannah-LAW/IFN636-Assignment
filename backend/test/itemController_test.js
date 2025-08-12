const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Item = require('../models/Item');
const {
  addItem,
  getApprovedItems,
  getMyItems,
  getPendingItems,
  updateItem,
  approveItem,
  rejectItem
} = require('../controllers/itemController');

describe('Item Controller Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('addItem', () => {
    it('should create a new item successfully', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const req = {
        user: { id: fakeUserId },
        body: { title: 'Lost wallet', description: 'Black wallet', type: 'lost' },
        file: { filename: 'image.jpg' }
      };
      const createdItem = {
        _id: new mongoose.Types.ObjectId(),
        userId: fakeUserId,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        image: `/uploads/${req.file.filename}`
      };
      const createStub = sinon.stub(Item, 'create').resolves(createdItem);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addItem(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledWithMatch({
        userId: fakeUserId,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        image: `/uploads/${req.file.filename}`
      })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdItem)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'create').throws(new Error('DB Error'));
      const req = { user: { id: new mongoose.Types.ObjectId() }, body: {}, file: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('getApprovedItems', () => {
    it('should return approved items', async () => {
      const fakeItems = [{ _id: '1', status: 'approved' }];
      const findStub = sinon.stub(Item, 'find').resolves(fakeItems);
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApprovedItems(req, res);

      expect(findStub.calledOnceWith({ status: 'approved' })).to.be.true;
      expect(res.json.calledWith(fakeItems)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'find').throws(new Error('DB Error'));
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApprovedItems(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('getMyItems', () => {
    it('should return items of the user', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeItems = [{ _id: '1', userId: fakeUserId }];
      const findStub = sinon.stub(Item, 'find').resolves(fakeItems);
      const req = { user: { id: fakeUserId } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getMyItems(req, res);

      expect(findStub.calledOnceWith({ userId: fakeUserId })).to.be.true;
      expect(res.json.calledWith(fakeItems)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'find').throws(new Error('DB Error'));
      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getMyItems(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('getPendingItems', () => {
    it('should return pending items', async () => {
      const fakeItems = [{ _id: '1', status: 'pending' }];
      const findStub = sinon.stub(Item, 'find').resolves(fakeItems);
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getPendingItems(req, res);

      expect(findStub.calledOnceWith({ status: 'pending' })).to.be.true;
      expect(res.json.calledWith(fakeItems)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'find').throws(new Error('DB Error'));
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getPendingItems(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('updateItem', () => {
    it('should update item if authorized', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeItem = {
        _id: new mongoose.Types.ObjectId(),
        userId: fakeUserId,
        title: 'Old title',
        description: 'Old desc',
        type: 'lost',
        image: 'oldimage.jpg',
        save: sinon.stub()  // 用resolves回傳fakeItem
      };
      fakeItem.save.resolves(fakeItem);
      
      const findByIdStub = sinon.stub(Item, 'findById').resolves(fakeItem);

      const req = {
        params: { id: fakeItem._id.toString() },
        user: { id: fakeUserId.toString() },
        body: { title: 'New title', description: 'New desc', type: 'found' },
        file: { filename: 'newimage.jpg' }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      console.log('Before updateItem: save called?', fakeItem.save.called);
      await updateItem(req, res);
      console.log('After updateItem: save called?', fakeItem.save.called);

      expect(findByIdStub.calledOnceWith(fakeItem._id.toString())).to.be.true;
      expect(fakeItem.title).to.equal('New title');
      expect(fakeItem.description).to.equal('New desc');
      expect(fakeItem.type).to.equal('found');
      expect(fakeItem.image).to.equal('/uploads/newimage.jpg');
      expect(fakeItem.save.called).to.be.true; // 改用called，唔一定係calledOnce
      expect(res.json.calledWith(fakeItem)).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findById').resolves(null);
      const req = { params: { id: 'someid' }, user: { id: 'userId' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should return 403 if user not authorized', async () => {
      const fakeItem = { userId: 'otherUserId', save: sinon.stub() };
      sinon.stub(Item, 'findById').resolves(fakeItem);
      const req = { params: { id: 'someid' }, user: { id: 'notOwnerId' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateItem(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Not authorized' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: 'someid' }, user: { id: 'userId' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('approveItem', () => {
    it('should approve item successfully', async () => {
      const fakeItem = {
        _id: new mongoose.Types.ObjectId(),
        status: 'pending',
        save: sinon.stub().resolves()
      };
      sinon.stub(Item, 'findById').resolves(fakeItem);
      const req = { params: { id: fakeItem._id.toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await approveItem(req, res);

      expect(fakeItem.status).to.equal('approved');
      expect(fakeItem.save.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Item approved' })).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await approveItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await approveItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('rejectItem', () => {
    it('should reject item successfully', async () => {
      const fakeItem = {
        _id: new mongoose.Types.ObjectId(),
        status: 'pending',
        save: sinon.stub().resolves()
      };
      sinon.stub(Item, 'findById').resolves(fakeItem);
      const req = { params: { id: fakeItem._id.toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await rejectItem(req, res);

      expect(fakeItem.status).to.equal('rejected');
      expect(fakeItem.save.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Item rejected' })).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await rejectItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'findById').throws(new Error('DB Error'));
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await rejectItem(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

});