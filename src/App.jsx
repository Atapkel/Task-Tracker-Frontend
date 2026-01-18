import { useEffect, useState } from "react";
import { createReminder, getReminders } from "../api/api";
import ReminderCard from "../components/ReminderCard";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    message: "",
    description: "",
    author: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch reminders on mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getReminders();
        setReminders(data);
      } catch (err) {
        setError("Failed to load reminders");
        console.error("Error fetching reminders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  /*
   * HANDLE INPUT CHANGE
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /*
   * VALIDATE FORM
   */
  const validate = () => {
    const errors = {};

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.author.trim()) {
      errors.author = "Author is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /*
   * HANDLE SUBMIT
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const newReminder = await createReminder(formData);
      // Add to beginning of list
      setReminders((prev) => [newReminder, ...prev]);
      // Clear form
      setFormData({ message: "", description: "", author: "" });
    } catch (err) {
      setError("Failed to create reminder");
      console.error("Error creating reminder:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        <p className="mt-2 text-gray-600">Keep track of important reminders.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Create Form */}
        <div className="lg: col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Create New Reminder
            </h2>

            {/* Message Field */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <input
                id="message"
                name="message"
                type="text"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus: ring-yellow-500 ${
                  formErrors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter reminder message"
                disabled={isCreating}
              />
              {formErrors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus: ring-yellow-500 ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter description"
                disabled={isCreating}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Author Field */}
            <div className="mb-4">
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Author <span className="text-red-500">*</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  formErrors.author ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter author name"
                disabled={isCreating}
              />
              {formErrors.author && (
                <p className="mt-1 text-sm text-red-500">{formErrors.author}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Reminder"}
            </button>
          </form>
        </div>

        {/* Right Column - Reminders List */}
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
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : reminders.length > 0 ? (
            /* Reminders Grid */
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <ReminderCard key={index} reminder={reminder} />
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
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No reminders yet
              </h3>
              <p className="mt-2 text-gray-500">
                Create your first reminder using the form on the left.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
