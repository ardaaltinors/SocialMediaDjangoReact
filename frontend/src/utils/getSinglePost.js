import api from "../api";

export const getSinglePost = async (postId) => {
	try {
		const response = await api.get(`/api/posts/${postId}/`);
		return response.data;
	} catch (error) {
		console.error("Error fetching single post:", error);
		return null;
	}
};
