import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

function LostItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    type: "lost",
    title: "",
    description: "",
    Campus: "Gardens Point",
    Location: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch only lost items
  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/api/items?type=lost", {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login");

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      if (editingId) {
        await axiosInstance.put(`/api/items/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEditingId(null);
      } else {
        await axiosInstance.post("/api/items", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setForm({
        type: "lost",
        title: "",
        description: "",
        Campus: "Gardens Point",
        Location: "",
        image: null,
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const editItem = (item) => {
    setForm({
      type: item.type,
      title: item.title,
      description: item.description,
      Campus: item.Campus,
      Location: item.Location,
      image: null,
    });
    setEditingId(item._id);
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you confirm to delete？")) {
      try {
        await axiosInstance.delete(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const verifyItem = async (id) => {
    try {
      await axiosInstance.patch(`/api/items/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Lost Items</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" name="type" value="lost" />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <select name="Campus" value={form.Campus} onChange={handleChange}>
          <option value="Gardens Point">Gardens Point</option>
          <option value="Kelvin Grove">Kelvin Grove</option>
        </select>
        <input
          type="text"
          name="Location"
          placeholder="Specific Location"
          value={form.Location}
          onChange={handleChange}
        />
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Report"}</button>
      </form>

      <h3>Lost Items List</h3>
      <ul>
        {items.map((item) => (
          <li key={item._id} style={{ border: '1px solid #ccc', margin: 5, padding: 10 }}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <p>{item.Campus} - {item.Location}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} width="150" />
            )}
            <p>Status: {item.status}</p>

            {user?.isAdmin && item.status === "pending" && (
              <button onClick={() => verifyItem(item._id)}>Verify</button>
            )}
            {user?.id === item.userId && (
              <>
                <button onClick={() => editItem(item)}>Edit</button>
                <button onClick={() => deleteItem(item._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LostItems;