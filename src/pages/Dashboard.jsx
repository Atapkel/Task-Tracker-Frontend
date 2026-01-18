import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReminders, getTasks } from "../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    taskCount: 0,
    reminderCount: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /*
   * FETCH DATA ON COMPONENT MOUNT
   * useEffect runs after component renders
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both tasks and reminders in parallel
        const [tasks, reminders] = await Promise.all([
          getTasks(),
          getReminders(),
        ]);

        setStats({
          taskCount: tasks.length,
          reminderCount: reminders.length,
        });

        // Get last 3 tasks for preview
        setRecentTasks(tasks.slice(-3).reverse());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array = run once on mount

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Task Manager
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your tasks and reminders.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tasks Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.taskCount}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <Link
            to="/tasks"
            className="inline-block mt-4 text-sm text-blue-600 hover: text-blue-500"
          >
            View all tasks →
          </Link>
        </div>

        {/* Reminders Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                Total Reminders
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.reminderCount}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <Link
            to="/reminders"
            className="inline-block mt-4 text-sm text-yellow-600 hover:text-yellow-500"
          >
            View all reminders →
          </Link>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <Link
            to="/tasks"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>

        {recentTasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentTasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.name}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tasks yet.{" "}
            <Link to="/tasks" className="text-blue-600 hover:text-blue-500">
              Create your first task
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
