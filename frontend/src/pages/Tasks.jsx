import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        let url = '/api/items/my'; // user
        if (user.role === 'admin') {
          url = '/api/items/pending'; // admin
        }
        const res = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(response.data);
      } catch (error) {
        alert('Failed to fetch Items.');
      }
    };

    fetchTasks();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/approve`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter(item => item._id !== id));
    } catch {
      alert('Approve failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/items/${id}/reject`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter(item => item._id !== id));
    } catch {
      alert('Reject failed.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter(item => item._id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        const res = await axiosInstance.put(`/api/items/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(items.map(i => (i._id === res.data._id ? res.data : i)));
      } else {
        const res = await axiosInstance.post('/api/items', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems([...items, res.data]);
      }
      setEditingItem(null);
    } catch {
      alert('Failed to save item.');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

 return (
    <div className="container mx-auto p-6">
      {user.role === 'admin' ? (
        <>
          <h2 className="text-xl font-bold mb-4">Pending Items for Approval</h2>
          {items.length === 0 ? (
            <p>No pending items.</p>
          ) : (
            <ul>
              {items.map(item => (
                <li key={item._id} className="mb-4 border p-4 rounded shadow">
                  <p><strong>{item.title}</strong></p>
                  <p>{item.description}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleApprove(item._id)}
                      className="mr-2 bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item._id)}
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
            tasks={items}
            setTasks={setItems}
            editingTask={editingItem}
            setEditingTask={setEditingItem}
            onSubmit={handleFormSubmit}
          />
          <TaskList
            tasks={items}
            setTasks={setItems}
            setEditingTask={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default Items;
