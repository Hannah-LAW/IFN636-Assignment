import { useAuth } from '../context/AuthContext';

const TaskList = ({ tasks, setEditingTask, onDelete, onApprove, onReject }) => {
  const { user } = useAuth();

  if (!tasks.length) {
    return (
      <div className="text-gray-400 p-4 border rounded shadow bg-gray-50">
        {user.role === 'Admin' ? (
          <p className="text-gray-700 font-semibold">
            No pending items for approval or rejection.
          </p>
        ) : (
          <>
            <p>You have not submitted any lost or found items yet.</p>
            <p>This list is currently empty.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id} className="mb-4 border p-4 rounded shadow flex justify-between items-start">
          {/* Left side: item info */}
          <div>
            <p><strong>{task.title}</strong></p>
            <p>{task.description}</p>
            {task.deadline && (
              <p>{task.type === 'Lost' ? 'Item Lost Date' : 'Item Found Date'}: {new Date(task.deadline).toLocaleDateString()}</p>
            )}
            <p>Campus: {task.campus}</p>
            <p>Location: {task.location}</p>

            {/* Only Admin sees Submitted by & Last action */}
            {user.role === 'Admin' && (
              <>
                <p className="text-gray-500 text-sm">Submitted by: {task.userId?.email || 'N/A'}</p>
                <p className="text-gray-500 text-sm">Last action: {task.lastAction || 'N/A'}</p>
              </>
            )}

            {/* Pending status notice for user */}
            {user.role !== 'Admin' && task.status === 'pending' && (
              <p className="text-gray-500 italic mt-1">
                Waiting for admin approval...
              </p>
            )}
          </div>

          {/* Right side: buttons */}
          <div className="flex flex-col items-center ml-4 space-y-3">
            {/* Admin buttons */}
            {user.role === 'Admin' && task.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(task._id)}
                  className="w-28 text-base bg-green-600 text-white px-3 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(task._id)}
                  className="w-28 text-base bg-red-600 text-white px-3 py-2 rounded"
                >
                  Reject
                </button>
              </>
            )}

            {/* User buttons */}
            {user.role !== 'Admin' && task.userId && (
              (task.userId._id ? task.userId._id === user.id : task.userId === user.id) && (
                <>
                  <button
                    disabled={task.status === 'pending'}
                    onClick={() => setEditingTask(task)}
                    className="w-28 text-base bg-yellow-500 text-white px-3 py-2 rounded disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    disabled={task.status === 'pending'}
                    onClick={() => onDelete(task._id)}
                    className="w-28 text-base bg-red-600 text-white px-3 py-2 rounded disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;