// src/pages/admin/CreateNotification.jsx
import { MdNotifications, MdSend } from "react-icons/md";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotificationStatus, createNotification } from "../../../features/NotificationSlice";
 

const CreateNotification = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.notifications
  );

  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "general", // general, urgent, promotion
    recipients: "all", // all, receptionists, clients
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: notification.title,
      message: notification.message,
      type: notification.type.toUpperCase(), // backend expects UPPERCASE
      recipients: notification.recipients.toUpperCase(),
    };

    dispatch(createNotification((payload))).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setNotification({
          title: "",
          message: "",
          type: "general",
          recipients: "all",
        });
      }
    });
  };

  useEffect(() => {
    if (successMessage || error) {
      const timeout = setTimeout(() => {
        dispatch(clearNotificationStatus());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MdNotifications className="text-2xl text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Create Notification</h1>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
           {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Title
            </label>
            <input
              type="text"
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={notification.message}
              onChange={(e) =>
                setNotification({ ...notification, message: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={notification.type}
                onChange={(e) =>
                  setNotification({ ...notification, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="general">General</option>
                <option value="urgent">Urgent</option>
                <option value="info">Info</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients
              </label>
              <select
                value={notification.recipients}
                onChange={(e) =>
                  setNotification({
                    ...notification,
                    recipients: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Users</option>
                <option value="receptionists">Receptionists Only</option>
                <option value="clients">Clients Only</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
        >
          <MdSend />{" "}
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
};

export default CreateNotification;
