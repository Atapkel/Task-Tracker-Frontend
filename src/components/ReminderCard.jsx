const ReminderCard = ({ reminder }) => {
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
      {/* Message (main content) */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {reminder.message}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-4">{reminder.description}</p>

      {/* Footer with author and date */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="flex items-center">
          {/* Author icon */}
          <svg 
            className="h-4 w-4 mr-1" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {reminder.author}
        </span>
        <span>{formatDate(reminder. created_at)}</span>
      </div>
    </div>
  );
};

export default ReminderCard;