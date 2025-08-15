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
  deleteItem,
  approveItem,
  rejectItem
} = require('../controllers/itemController');

describe('Item Controller Tests', () => {
  let consoleStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'error'); // 阻止 console.error print
  });

  afterEach(() => {
    sinon.restore();
  });

  const mockUser = { id: '123', role: 'User' };
  const mockAdmin = { id: 'admin', role: 'Admin' };

  const mockRes = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };

  // --- addItem ---
  describe('addItem', () => {
    it('should create a new item successfully', async () => {
      const req = { user: mockUser, body: { title: 'Lost wallet', description: 'Black wallet', type: 'Lost', campus: 'Gardens Point', location: 'Library', deadline: '2025-08-20' } };
      const res = mockRes();
      sinon.stub(Item, 'create').resolves(req.body);

      await addItem(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(req.body)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const req = { user: mockUser, body: {} };
      const res = mockRes();
      sinon.stub(Item, 'create').rejects(new Error('DB Error'));

      await addItem(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  // --- getApprovedItems ---
  describe('getApprovedItems', () => {
    it('should return approved items and user items', async () => {
      const req = { user: mockUser };
      const res = mockRes();
      sinon.stub(Item, 'find').returns({ populate: sinon.stub().resolves(['item1','item2']) });

      await getApprovedItems(req, res);
      expect(res.json.calledWith(['item1','item2'])).to.be.true;
    });

    it('should return 500 on error', async () => {
      const req = { user: mockUser };
      const res = mockRes();
      sinon.stub(Item, 'find').rejects(new Error('DB Error'));

      await getApprovedItems(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // --- getMyItems ---
  describe('getMyItems', () => {
    it('should return items of the user', async () => {
      const req = { user: mockUser };
      const res = mockRes();
      sinon.stub(Item, 'find').resolves(['item1']);

      await getMyItems(req, res);
      expect(res.json.calledWith(['item1'])).to.be.true;
    });

    it('should return 500 on error', async () => {
      const req = { user: mockUser };
      const res = mockRes();
      sinon.stub(Item, 'find').rejects(new Error('DB Error'));

      await getMyItems(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // --- updateItem ---
  describe('updateItem', () => {
    it('should update item if user owns it', async () => {
      const req = { user: mockUser, params: { id: '1' }, body: { title: 'New Title' } };
      const res = mockRes();
      const saveStub = sinon.stub().resolves({ title: 'New Title' });
      sinon.stub(Item, 'findById').resolves({ userId: mockUser.id, save: saveStub, title: 'Old', status: 'approved' });

      await updateItem(req, res);
      expect(res.json.calledWith({ title: 'New Title' })).to.be.true;
    });

    it('should return 403 if not owner', async () => {
      const req = { user: mockUser, params: { id: '1' }, body: {} };
      const res = mockRes();
      sinon.stub(Item, 'findById').resolves({ userId: 'otherId' });

      await updateItem(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      const req = { user: mockUser, params: { id: '1' }, body: {} };
      const res = mockRes();
      sinon.stub(Item, 'findById').resolves(null);

      await updateItem(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const req = { user: mockUser, params: { id: '1' }, body: {} };
      const res = mockRes();
      sinon.stub(Item, 'findById').rejects(new Error('DB Error'));

      await updateItem(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // --- deleteItem ---
  describe('deleteItem', () => {
    it('should delete item if user owns it', async () => {
      const req = { user: mockUser, params: { id: '1' } };
      const res = mockRes();
      const removeStub = sinon.stub().resolves();
      sinon.stub(Item, 'findById').resolves({ userId: mockUser.id, remove: removeStub });

      await deleteItem(req, res);
      expect(res.json.calledWith({ message: 'Item deleted successfully' })).to.be.true;
    });

    it('should return 403 if not owner', async () => {
      const req = { user: mockUser, params: { id: '1' } };
      const res = mockRes();
      sinon.stub(Item, 'findById').resolves({ userId: 'otherId' });

      await deleteItem(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const req = { user: mockUser, params: { id: '1' } };
      const res = mockRes();
      sinon.stub(Item, 'findById').rejects(new Error('DB Error'));

      await deleteItem(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // --- getPendingItems ---
  describe('getPendingItems', () => {
    it('should return pending items for admin', async () => {
      const req = { user: mockAdmin };
      const res = mockRes();
      sinon.stub(Item, 'find').returns({ populate: sinon.stub().resolves(['item1']) });

      await getPendingItems(req, res);
      expect(res.json.calledWith(['item1'])).to.be.true;
    });

    it('should return 403 if not admin', async () => {
      const req = { user: mockUser };
      const res = mockRes();

      await getPendingItems(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const req = { user: mockAdmin };
      const res = mockRes();
      sinon.stub(Item, 'find').rejects(new Error('DB Error'));

      await getPendingItems(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // --- approveItem ---
  describe('approveItem', () => {
    it('should approve item for admin', async () => {
      const req = { user: mockAdmin, params: { id: '1' } };
      const res = mockRes();
      const saveStub = sinon.stub().resolves();
      sinon.stub(Item, 'findById').resolves({ status: 'pending', save: saveStub });

      await approveItem(req, res);
      expect(res.json.calledWith({ message: 'Item approved' })).to.be.true;
    });

    it('should return 403 if not admin', async () => {
      const req = { user: mockUser, params: { id: '1' } };
      const res = mockRes();

      await approveItem(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const req = { user: mockAdmin, params: { id: '1' } };
      const res = mockRes();
      sinon.stub(Item, 'findById').rejects(new Error('DB Error'));

      await approveItem(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  // --- rejectItem ---
  describe('rejectItem', () => {
    it('should reject item for admin', async () => {
      const req = { user: mockAdmin, params: { id: '1' } };
      const res = mockRes();
      const saveStub = sinon.stub().resolves();
      sinon.stub(Item, 'findById').resolves({ status: 'pending', save: saveStub });

      await rejectItem(req, res);
      expect(res.json.calledWith({ message: 'Item rejected' })).to.be.true;
    });

    it('should return 403 if not admin', async () => {
      const req = { user: mockUser, params: { id: '1' } };
      const res = mockRes();

      await rejectItem(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const req = { user: mockAdmin, params: { id: '1' } };
      const res = mockRes();
      sinon.stub(Item, 'findById').rejects(new Error('DB Error'));

      await rejectItem(req, res);
      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});