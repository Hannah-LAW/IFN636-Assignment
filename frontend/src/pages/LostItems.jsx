import React, { useState, useEffect } from "react";
import axios from "axios";

function LostItems({ user }) {
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

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await axios.get("/api/items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Form update
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Create or update item
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      if (editingId) {
        await axios.put(`/api/items/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEditingId(null);
      } else {
        await axios.post("/api/items", formData, {
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

  // Edit item
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

  // Delete item
  const deleteItem = async (id) => {
    if (window.confirm("確定刪除嗎？")) {
      try {
        await axios.delete(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Admin verify item
  const verifyItem = async (id) => {
    try {
      await axios.patch(`/api/items/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Lost & Found Items</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
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

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h3>{item.title} ({item.type})</h3>
            <p>{item.description}</p>
            <p>{item.Campus} - {item.Location}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} width="150" />
            )}
            <p>Status: {item.status}</p>

            {user.isAdmin && item.status === "pending" && (
              <button onClick={() => verifyItem(item._id)}>Verify</button>
            )}
            {user.id === item.userId && (
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
