import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ editingTask, setEditingTask, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lost');
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setType(editingTask.type);
      setDeadline(editingTask.deadline ? editingTask.deadline.split('T')[0] : '');
      setImage(null); // reset file input
    } else {
      setTitle('');
      setDescription('');
      setType('lost');
      setDeadline('');
      setImage(null);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    if (deadline) formData.append('deadline', deadline);
    if (image) formData.append('image', image);

    try {
      if (editingTask) {
        // update existing
        await axiosInstance.put(`/items/${editingTask._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // create new
        await axiosInstance.post('/items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSave();
      setEditingTask(null);
    } catch (error) {
      alert('Error saving item: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">{editingTask ? 'Edit Item' : 'Add Item'}</h2>
      <div className="mb-2">
        <label>Title</label>
        <input
          className="border p-1 w-full"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label>Description</label>
        <textarea
          className="border p-1 w-full"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label>Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="border p-1 w-full">
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Deadline</label>
        <input
          type="date"
          className="border p-1 w-full"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label>Image</label>
        <input type="file" onChange={e => setImage(e.target.files[0])} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingTask ? 'Update' : 'Add'}
      </button>
      {editingTask && (
        <button
          type="button"
          className="ml-2 px-4 py-2 border rounded"
          onClick={() => setEditingTask(null)}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;