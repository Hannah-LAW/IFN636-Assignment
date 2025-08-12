import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();

  // Fetch my items on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/api/items/my', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [user.token, setTasks]);

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axiosInstance.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      {tasks.length === 0 && <p>No items found.</p>}
      {tasks.map((item) => (
        <div key={item._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{item.title}</h2>
          <p>{item.description}</p>
          {item.deadline && (
            <p className="text-sm text-gray-500">
              Deadline: {new Date(item.deadline).toLocaleDateString()}
            </p>
          )}
          <div className="mt-2">
            <button
              onClick={() => setEditingTask(item)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;