import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ editingTask, setEditingTask, onSubmit }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({ title: '', description: '', type: '', deadline: ''});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        type: editingTask.type || '',
        deadline: editingTask.deadline || '',
      });
      setImageFile(null);
    } else {
      setFormData({ title: '', description: '', type: '', deadline: ''});
      setImageFile(null);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login first.');
      return;
    }
    onSubmit(formData, imageFile);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h2 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Item' : 'Add New Item'}</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        rows={4}
        required
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>

      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {editingTask ? 'Update Item' : 'Add Item'}
      </button>

      {editingTask && (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;