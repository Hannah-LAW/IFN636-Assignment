import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setEditingTask, onDelete }) => {
  const { user } = useAuth();

  if (!tasks.length) return <p>No items found.</p>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h3 className="font-bold">{task.title}</h3>
          <p>{task.description}</p>
          {task.deadline && (
            <p className="text-sm text-gray-500">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
          )}
          {task.image && (
            <img src={task.image} alt={task.title} className="my-2 max-w-xs" />
          )}
          <div className="mt-2">
            <button
              onClick={() => setEditingTask(task)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
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