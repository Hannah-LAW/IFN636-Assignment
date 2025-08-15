import { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TasksList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // ✅ fix
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Lost',
    campus: '',
    location: '',
    deadline: '',
  });

  // fetch tasks
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = user.role === 'Admin' ? '/api/items/pending' : '/api/items/my';
        const response = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch tasks.');
      }
      setLoading(false);
    };

    fetchTasks();
  }, [user]);

  // handle delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
      alert('Delete failed.');
    }
  };

  // handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/api/items/${editingTask._id}`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks(tasks.map(t => (t._id === editingTask._id ? response.data : t)));
      setEditingTask(null);
    } catch (error) {
      console.error(error);
      alert('Update failed.');
    }
  };

  // handle approve/reject
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
      alert('Approve failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
      alert('Reject failed.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container w-1/2 mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
      <p className="text-lg mb-4">
        <span className="font-semibold">{user.role}</span>: {user.name}
      </p>

      {/* Edit form */}
      {editingTask && (
        <form onSubmit={handleEditSubmit} className="mb-6 p-4 border rounded shadow bg-gray-50">
          <h2 className="font-bold mb-2">Edit Task</h2>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          <input
            type="text"
            placeholder="Campus"
            value={formData.campus}
            onChange={e => setFormData({ ...formData, campus: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="date"
            value={formData.deadline}
            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditingTask(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Task list */}
      <TaskList
        tasks={tasks}
        setEditingTask={(task) => {
          setEditingTask(task);
          setFormData({
            title: task.title,
            description: task.description,
            type: task.type,
            campus: task.campus || '',
            location: task.location || '',
            deadline: task.deadline ? task.deadline.split('T')[0] : '',
          });
        }}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default TasksList;