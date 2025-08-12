import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      // POST or PUT?
      if (editingTask) {
        // PUT 
        const res = await fetch(`/api/items/${editingTask._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });
        const updatedItem = await res.json();
        setTasks(tasks.map(t => t._id === updatedItem._id ? updatedItem : t));
      } else {
        // POST
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });
        const newItem = await res.json();
        setTasks([...tasks, newItem]);
      }
      setEditingTask(null);
    } catch (error) {
      alert('Failed to save item.');
      console.error(error);
    }
  };

  if (!user) return <p>Please login to view your tasks.</p>;

  return (
    <div className="container mx-auto p-6">
      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        onSubmit={handleFormSubmit}
      />
      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        setEditingTask={setEditingTask}
      />
    </div>
  );
};

export default Tasks;