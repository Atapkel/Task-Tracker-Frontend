import { useState } from "react";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(
    task.description || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (editedName.length < 3) {
      alert("Name must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(task.id, {
        name: editedName,
        description: editedDescription || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || "");
    setIsEditing(false);
  };

   return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {isEditing ? (
        /* EDIT MODE */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name *
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name (min 3 characters)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e. target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter description (optional)"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-green-500 hover: bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ?  'Saving.. .' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* VIEW MODE */
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {task.name}
          </h3>
          {task.description && (
            <p className="text-gray-600 mb-4">{task.description}</p>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-500 hover: bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Deleting.. .' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>);

};


export default TaskCard;
