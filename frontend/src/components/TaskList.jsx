import { useAuth } from '../context/AuthContext';

const TaskList = ({ tasks, setEditingTask, onDelete, onApprove, onReject }) => {
  const { user } = useAuth();

  if (!tasks.length) 
    return (
      <div>
        <p className="text-gray-400">You have not submitted any lost or found items yet.</p>
        <p className="text-gray-400">This list is currently empty.</p>
      </div>
    );

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id} className="mb-4 border p-4 rounded shadow">
          <p><strong>{task.title}</strong></p>
          <p>{task.description}</p>
          {task.deadline && <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}

          {/* Admin buttons */}
          {user.role === 'Admin' && task.status === 'pending' && (
            <div className="mt-2">
              <button
                onClick={() => onApprove(task._id)}
                className="mr-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(task._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}

          {/* User buttons */}
          {user.role !== 'Admin' && (
            <div className="mt-2">
              <button
                disabled={task.status === 'pending'}
                onClick={() => setEditingTask(task)}
                className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Edit
              </button>
              <button
                disabled={task.status === 'pending'}
                onClick={() => onDelete(task._id)}
                className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Delete
              </button>
              {task.status === 'pending' && (
                <p className="text-gray-500 italic mt-1">
                  Waiting for admin approval...
                </p>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;