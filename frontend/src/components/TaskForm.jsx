import { useState, useEffect } from 'react';

const TaskForm = ({ editingTask, setEditingTask, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Lost');
  const [deadline, setDeadline] = useState('');
  const [campus, setCampus] = useState('Gardens Point');
  const [location, setLocation] = useState('');

  const typeOptions = ['Lost', 'Found'];
  const campusOptions = ['Gardens Point', 'Kelvin Grove'];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setType(typeOptions.includes(editingTask.type) ? editingTask.type : 'Lost');
      setDeadline(editingTask.deadline ? editingTask.deadline.split('T')[0] : '');
      setCampus(campusOptions.includes(editingTask.campus) ? editingTask.campus : 'Gardens Point');
      setLocation(editingTask.location || '');
    } else {
      setTitle('');
      setDescription('');
      setType('Lost');
      setDeadline('');
      setCampus('Gardens Point');
      setLocation('');
    }
  }, [editingTask, typeOptions, campusOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { title, description, type, campus, location, deadline: deadline || null };
    onSubmit(payload);

    setTitle('');
    setDescription('');
    setType('Lost');
    setCampus('Gardens Point');
    setLocation('');
    setDeadline('');
  };

  const fieldClass = "flex items-center mb-4";
  const labelClass = "w-1/3 font-bold text-orange-800";
  const inputClass = "w-2/3 border p-1";

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded w-1/2 mx-auto">
      <h2 className="text-xl font-bold mb-6">{editingTask ? 'Edit Item' : 'Submit Lost / Found Item'}</h2>

      <div className={fieldClass}>
        <label className={labelClass}>Item Name *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className={inputClass}
          placeholder="Enter item name (e.g., Wallet, Umbrella)"
        />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Description *</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className={inputClass}
          placeholder="Include brand, color, distinguishing features"
        />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Report Type (Lost / Found)</label>
        <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
          {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Campus</label>
        <select value={campus} onChange={e => setCampus(e.target.value)} className={inputClass}>
          {campusOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Location</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className={inputClass}
          placeholder="Optional: specify building/room"
        />
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Lost / Found Date</label>
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputClass} />
      </div>

      <div className="text-sm my-10">Please note that fields marked with an asterisk (*) are mandatory and must be filled in.</div>

      <div className="flex items-center">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">{editingTask ? 'Update' : 'Add New Item'}</button>
        {editingTask && (
          <button type="button" onClick={() => setEditingTask(null)} className="ml-2 px-4 py-2 border rounded">Cancel</button>
        )}
      </div>

    </form>
  );
};

export default TaskForm;