import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user } = useAuth();
  const [pendingItems, setPendingItems] = useState([]);

  const fetchPending = async () => {
    if (!user?.isAdmin) return;
    try {
      const res = await axiosInstance.get('/api/items?status=pending', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPendingItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [user]);

  const verifyItem = async (id) => {
    try {
      await axiosInstance.patch(`/api/items/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user?.isAdmin) return <p>Access denied. Admin only.</p>;

  return (
    <div>
      <h2>Admin Verification Panel</h2>
      {pendingItems.length === 0 ? (
        <p>No pending items to verify.</p>
      ) : (
        <ul>
          {pendingItems.map(item => (
            <li key={item._id} style={{ border: '1px solid #ccc', margin: 5, padding: 10 }}>
              <h4>{item.title} ({item.type})</h4>
              <p>{item.description}</p>
              <p>{item.Campus} - {item.Location}</p>
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} width="150" />}
              <button onClick={() => verifyItem(item._id)}>Verify</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;