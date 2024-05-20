import Notifications from "../../components/NotificationComponents/Notifications";

import "../../css/Notifications.css";
function NotificationPage() {
  return (
    <div className="notificationPage">
      <div className="notificationsPage-container">
        <h1>Notifications</h1>
        <Notifications />
      </div>
    </div>
  );
}

export default NotificationPage;
