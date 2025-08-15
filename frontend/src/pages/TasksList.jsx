import { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TasksList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/approve`, null, {
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
      await axiosInstance.put(`/api/items/${id}/reject`, null, {
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
    <div className="container mx-auto p-6">
      <p className="mb-2 text-gray-600">User role: {user.role}</p>

      {tasks.length === 0 ? (
        <div className="text-gray-400">
          {user.role === 'Admin' ? (
            <p>No pending items.</p>
          ) : (
            <>
              <p>You have not submitted any lost or found items yet.</p>
              <p>This list is currently empty.</p>
            </>
          )}
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          setEditingTask={setEditingTask}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default TasksList;