import React, { useState, useEffect } from "react";
import { fetchNotifications } from "../../utils/notificationUtils";
import "./Notifications.css";
import moment from "moment";

function Notifications() {
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const initFetch = async () => {
			setIsLoading(true);
			const data = await fetchNotifications();
			setNotifications(data);
			setIsLoading(false);
		};
		initFetch();
	}, []);

	if (isLoading) {
		return <div className="loading">Loading...</div>;
	}

	return (
		<div className="notifications">
			<h3>Notifications</h3>
			{notifications.length > 0 ? (
				<div className="notification-list">
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className={`notification-item ${
								notification.is_read ? "read" : "unread"
							}`}
						>
							<div className="notification-content">
								<p>{notification.message}</p>
								<p className="date">
									{moment(notification.created_at).fromNow()}
									{/* {new Date(notification.created_at).toLocaleString()} */}
								</p>
							</div>
							{/* <div className="notification-status">
								{notification.is_read ? (
									<span className="read">Read</span>
								) : (
									<span className="unread">Unread</span>
								)}
							</div> */}
						</div>
					))}
				</div>
			) : (
				<p>No notifications to display.</p>
			)}
		</div>
	);
}

export default Notifications;
