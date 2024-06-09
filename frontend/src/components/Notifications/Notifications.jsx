import React, { useState, useEffect, useRef } from "react";
import { fetchNotifications } from "../../utils/notificationUtils";
import "./Notifications.css";
import moment from "moment";
import { ACCESS_TOKEN } from "../../constants";

function Notifications() {
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const socket = useRef(null);

	const getAccessToken = () => {
		return localStorage.getItem(ACCESS_TOKEN);
	};

	useEffect(() => {
		const initFetch = async () => {
			setIsLoading(true);
			const data = await fetchNotifications();
			setNotifications(data);
			setIsLoading(false);
		};
		initFetch();
	}, []);

	useEffect(() => {
		const token = getAccessToken();

		const connectWebSocket = () => {
			if (
				socket.current &&
				(socket.current.readyState === WebSocket.OPEN ||
					socket.current.readyState === WebSocket.CONNECTING)
			) {
				console.log("WebSocket is already open or connecting");
				return;
			}

			socket.current = new WebSocket(
				`ws://localhost:8000/ws/notifications/?access_token=${token}`
			);

			socket.current.onopen = () => {
				console.log("WebSocket connection established");
			};

			socket.current.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.type === "new_notification") {
					setNotifications((prevNotifications) => [data, ...prevNotifications]);
				}
			};

			socket.current.onclose = () => {
				console.log("WebSocket connection closed, attempting to reconnect...");
				setTimeout(connectWebSocket, 3000);
			};

			socket.current.onerror = (error) => {
				console.error("WebSocket error:", error);
			};
		};

		connectWebSocket();

		return () => {
			if (socket.current) {
				socket.current.close();
			}
		};
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
								</p>
							</div>
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
