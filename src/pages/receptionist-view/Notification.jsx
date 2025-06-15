// src/pages/reception/Notifications.jsx
import {
  MdNotifications,
  MdNotificationsActive,
  MdClearAll,
  MdNotificationImportant,
} from "react-icons/md";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  markNotificationAsRead,
  deleteNotification,
  fetchMyNotifications,
   
} from "../../../features/NotificationSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    notifications
      .filter((n) => !n.read)
      .forEach((n) => dispatch(markNotificationAsRead(n.id)));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleClearAll = () => {
    notifications.forEach((n) => dispatch(deleteNotification(n.id)));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) return <div className="p-6 text-center">Loading notifications...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MdNotificationsActive className="text-2xl text-pink-600" />
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications{" "}
          <span className="ml-2 text-sm text-white bg-pink-500 rounded-full px-2 py-0.5">
            {unreadCount}
          </span>
        </h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          {unreadCount} unread notification{unreadCount !== 1 && "s"}
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 text-sm"
            >
              <MdNotifications className="text-sm" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              <MdClearAll className="text-sm" />
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No notifications available.
          </div>
        ) : (
          notifications.map((notification) => {
            let icon;
            switch (notification.type?.toUpperCase()) {
              case "IMPORTANT":
                icon = <MdNotificationImportant size={18} />;
                break;
              case "PROMOTION":
                icon = <MdNotificationsActive size={18} />;
                break;
              case "INFO":
              case "APPOINTMENT":
              default:
                icon = <MdNotifications size={18} />;
            }

            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-pink-50 border-pink-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-2 rounded-full ${
                        notification.read
                          ? "bg-gray-100 text-gray-500"
                          : "bg-pink-100 text-pink-600"
                      }`}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3
                        className={`font-medium ${
                          notification.read
                            ? "text-gray-700"
                            : "text-pink-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {new Date(notification.sentAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-pink-600 hover:text-pink-800"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;