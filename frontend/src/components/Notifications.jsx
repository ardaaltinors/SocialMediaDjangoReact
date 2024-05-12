import React, { useState, useEffect } from "react";
import api from "../api";

function Notifications() {
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchNotifications = async () => {
			setIsLoading(true);
			try {
				const response = await api.get("/api/notifications/");
				setNotifications(response.data);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
			setIsLoading(false);
		};

		fetchNotifications();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Notifications</h1>
			{notifications.length > 0 ? (
				<ul>
					{notifications.map((notification) => (
						<li key={notification.id}>
							<p>
								<strong>Message:</strong>
								{notification.message}
							</p>
							<p>
								<strong>Date:</strong>{" "}
								{new Date(notification.created_at).toLocaleString()}
							</p>
							<p>
								<strong>Status:</strong>{" "}
								{notification.is_read ? "Read" : "Unread"}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p>No notifications to display.</p>
			)}
		</div>
	);
}

export default Notifications;
