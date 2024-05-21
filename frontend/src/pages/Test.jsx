import { useState, useEffect, useRef } from "react";
import api from "../api";

function Test() {
	const [currentUser, setCurrentUser] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const socketRef = useRef(null);

	useEffect(() => {
		// Fetch the current user when the component mounts
		getCurrentUser();
	}, []);

	useEffect(() => {
		// Establish WebSocket connection only after currentUser is set
		if (currentUser) {
			connectWebSocket();
		}

		return () => {
			// Cleanup WebSocket on component unmount
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, [currentUser]);

	const connectWebSocket = () => {
		console.log("Attempting to connect WebSocket...");
		const socket = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");
		socketRef.current = socket;

		socket.onopen = function () {
			console.log("WebSocket connection established");
		};

		socket.onmessage = function (event) {
			console.log("WebSocket message received");
			const data = JSON.parse(event.data);
			console.log("Received data: ", data);
			setNotifications((prevNotifications) => [
				...prevNotifications,
				data.message,
			]);
		};

		socket.onclose = function (event) {
			console.error("WebSocket closed unexpectedly: ", event);
			// Attempt to reconnect after 1 second
			setTimeout(() => {
				if (
					!socketRef.current ||
					socketRef.current.readyState === WebSocket.CLOSED
				) {
					console.log("Reconnecting WebSocket...");
					connectWebSocket();
				}
			}, 1000);
		};

		socket.onerror = function (error) {
			console.error("WebSocket error: ", error);
		};
	};

	const getCurrentUser = () => {
		console.log("Fetching current user...");
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
				console.log("Current user data: ", response.data);
			})
			.catch((error) => {
				console.error("Error fetching current user: ", error);
				alert(error);
			});
	};

	return (
		<div>
			<h1>Test Page</h1>
			<ul>
				{notifications.map((notification, index) => (
					<li key={index}>{notification}</li>
				))}
			</ul>
		</div>
	);
}

export default Test;
