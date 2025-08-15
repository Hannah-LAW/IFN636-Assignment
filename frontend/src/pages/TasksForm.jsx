import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TasksForm = () => {
  const { user } = useAuth();
  const [editingTask, setEditingTask] = useState(null);

  const handleFormSubmit = async (payload) => {
    try {
      if (editingTask) {
        // Item status change to pending after update
        await axiosInstance.put(`/api/items/${editingTask._id}`, 
          { ...payload, status: 'pending' }, 
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        await axiosInstance.post('/api/items', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setEditingTask(null);
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