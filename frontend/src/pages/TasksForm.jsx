import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// Handles adding new items or editing existing items
const TasksForm = () => {
  const { user } = useAuth(); // Access user token from context
  const [editingTask, setEditingTask] = useState(null);

  const handleFormSubmit = async (payload) => {
    try {
      if (editingTask) {
        // Update existing item, mark status as pending
        await axiosInstance.put(`/api/items/${editingTask._id}`, 
          { ...payload, status: 'pending' }, 
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        // Add new item
        await axiosInstance.post('/api/items', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setEditingTask(null); // Reset editing state
    } catch (error) {
      console.error(error);
      alert('Failed to save task.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <TaskForm editingTask={editingTask} setEditingTask={setEditingTask} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default TasksForm;