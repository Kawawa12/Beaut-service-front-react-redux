// src/pages/reception/Notifications.jsx
import { MdNotifications, MdNotificationsActive, MdClearAll } from "react-icons/md";
import { useState } from "react";

const Notifications = () => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Booking",
      message: "Client Anna Smith booked a facial treatment for tomorrow at 3 PM",
      time: "10 mins ago",
      read: false,
      type: "appointment" // appointment, system, promotion
    },
    {
      id: 2,
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday, 10 PM - 2 AM. System will be unavailable.",
      time: "2 hours ago",
      read: false,
      type: "system"
    },
    {
      id: 3,
      title: "Promotion Alert",
      message: "New summer special: 20% off all spa packages. Activate now!",
      time: "1 day ago",
      read: true,
      type: "promotion"
    },
    {
      id: 4,
      title: "Appointment Reminder",
      message: "Client Maria Garcia has an upcoming appointment in 30 minutes (Hair Styling).",
      time: "Just now",
      read: false,
      type: "appointment"
    }
  ]);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MdNotificationsActive className="text-2xl text-pink-600" />
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      {/* Notification Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          {notifications.filter(n => !n.read).length} unread notifications
        </div>
        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 text-sm"
          >
            <MdNotifications className="text-sm" />
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
          >
            <MdClearAll className="text-sm" />
            Clear all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No notifications available.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${notification.read ? 'bg-white border-gray-200' : 'bg-pink-50 border-pink-200'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-full ${notification.read ? 'bg-gray-100 text-gray-500' : 'bg-pink-100 text-pink-600'}`}>
                    {notification.type === 'appointment' && <MdNotifications size={18} />}
                    {notification.type === 'system' && <MdNotifications size={18} />}
                    {notification.type === 'promotion' && <MdNotificationsActive size={18} />}
                  </div>
                  <div>
                    <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-pink-700'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-pink-600 hover:text-pink-800"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;