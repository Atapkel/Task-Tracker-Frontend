import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  /*
   * FETCH TASKS
   * useCallback memoizes the function to prevent unnecessary re-renders
   */
  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks.  Please try again.");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /*
   * HANDLE CREATE TASK
   * Creates task and adds it to state
   */
  const handleCreateTask = async (taskData) => {
    setIsCreating(true);
    try {
      const newTask = await createTask(taskData);
      // Add new task to beginning of list
      setTasks((prev) => [newTask, ...prev]);
      setError("");
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to create task";
      setError(typeof message === "string" ? message : JSON.stringify(message));
      throw err; // Re-throw so TaskForm knows it failed
    } finally {
      setIsCreating(false);
    }
  };

  /*
   * HANDLE UPDATE TASK
   * Updates task in API and state
   */
  const handleUpdateTask = async (id, taskData) => {
    const updatedTask = await updateTask(id, taskData);
    // Update task in state
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task)),
    );
  };

  /*
   * HANDLE DELETE TASK
   * Deletes from API and removes from state
   */
  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    // Remove task from state
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <p className="mt-2 text-gray-600">
          Manage your tasks and stay organized.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Task Form */}
        <div className="lg:col-span-1">
          <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
        </div>

        {/* Right Column - Tasks List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : tasks.length > 0 ? (
            /* Tasks Grid */
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No tasks yet
              </h3>
              <p className="mt-2 text-gray-500">
                Create your first task using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
