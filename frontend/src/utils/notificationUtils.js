import api from "../api";

export const fetchNotifications = async () => {
	try {
		const response = await api.get("/api/notifications/");
		return response.data; // Return the data directly
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return []; // Return an empty array or handle the error as needed
	}
};
