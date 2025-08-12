import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        deadline: editingTask.deadline,
      });
    } else {
      setFormData({ title: '', description: '', deadline: '' });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Edit Item' : 'Add New Item'}</h1>
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
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
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
          onClick={() => setEditingTask(null)}
          className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;
