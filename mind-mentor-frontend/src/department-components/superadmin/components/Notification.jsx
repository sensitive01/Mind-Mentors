import { Button, Divider, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const NotificationForm = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "", body: "", type: "" },
  ]);
  const notificationTypes = ["Info", "Warning", "Error", "Success"];
  const [loading, setLoading] = useState(false);

  const addNotification = () => {
    setNotifications([
      ...notifications,
      { id: notifications.length + 1, title: "", body: "", type: "" },
    ]);
  };

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNotificationChange = (id, field, value) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, [field]: value }
        : notification
    );
    setNotifications(updatedNotifications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let notification of notifications) {
        // Only process non-empty notification details
        if (notification.title && notification.body && notification.type) {
          const notificationData = {
            title: notification.title,
            body: notification.body,
            type: notification.type,
          };

          // Logic to save the notification (placeholder)
          // await saveNotification(notificationData);
        }
      }

      // Reset notifications after submission
      setNotifications([{ id: 1, title: "", body: "", type: "" }]);
      alert("Notifications submitted successfully!");
    } catch (error) {
      alert("Error while submitting notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "body", headerName: "Body", width: 300 },
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeNotification(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Notification Form</h2>
            <p className="text-sm opacity-90">
              Fill in the details to create notifications
            </p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/notifications"
          >
            View Notifications
          </Button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
              Notification Details
            </h3>
            {notifications.map((notification, index) => (
              <div key={notification.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">
                    Notification {index + 1}
                  </label>
                  {notifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNotification(notification.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Notification Title"
                    variant="outlined"
                    value={notification.title}
                    onChange={(e) =>
                      handleNotificationChange(
                        notification.id,
                        "title",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    label="Notification Body"
                    variant="outlined"
                    value={notification.body}
                    onChange={(e) =>
                      handleNotificationChange(
                        notification.id,
                        "body",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    select
                    label="Notification Type"
                    value={notification.type}
                    onChange={(e) =>
                      handleNotificationChange(
                        notification.id,
                        "type",
                        e.target.value
                      )
                    }
                    fullWidth
                  >
                    {notificationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addNotification}
              className="text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
            >
              + Add Notification
            </button>
          </div>

          <Divider className="my-6" />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={notifications}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
            />
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Notifications"}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationForm;
