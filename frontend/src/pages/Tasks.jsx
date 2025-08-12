import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Task = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = user.role === 'admin' ? '/api/items/pending' : '/api/items/my';
        const res = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(res.data);
      } catch (error) {
        alert('Failed to fetch tasks.');
        console.error(error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [user]);

  const handleFormSubmit = async (formData, imageFile) => {
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('deadline', formData.deadline);
      if (imageFile) data.append('image', imageFile);

      let res;
      if (editingTask) {
        res = await axiosInstance.put(`/api/items/${editingTask._id}`, data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setTasks(tasks.map(t => (t._id === res.data._id ? res.data : t)));
      } else {
        res = await axiosInstance.post('/api/items', data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setTasks([...tasks, res.data]);
      }
      setEditingTask(null);
    } catch (error) {
      alert('Failed to save task.');
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/approve`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      alert('Approve failed.');
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/reject`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      alert('Reject failed.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      alert('Delete failed.');
      console.error(error);
    }
  };

  if (!user) return <p>Please login to view your tasks.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      {user.role === 'admin' ? (
        <>
          <h2 className="text-xl font-bold mb-4">Pending Items for Approval</h2>
          {tasks.length === 0 ? (
            <p>No pending items.</p>
          ) : (
            <ul>
              {tasks.map(task => (
                <li key={task._id} className="mb-4 border p-4 rounded shadow">
                  <p><strong>{task.title}</strong></p>
                  <p>{task.description}</p>
                  {task.deadline && <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}
                  <div className="mt-2">
                    <button
                      onClick={() => handleApprove(task._id)}
                      className="mr-2 bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(task._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <TaskForm
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            onSubmit={handleFormSubmit}
          />
          <TaskList
            tasks={tasks}
            setEditingTask={setEditingTask}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default Task;