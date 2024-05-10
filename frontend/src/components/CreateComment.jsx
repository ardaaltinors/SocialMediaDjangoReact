// CreateComment.js
import { useState } from "react";
import api from "../api";

function CreateComment({ postId, onCommentAdded }) {
	const [commentText, setCommentText] = useState("");
	const [status, setStatus] = useState("");

	const handleCommentChange = (e) => {
		setCommentText(e.target.value);
	};

	const postComment = async (e) => {
		e.preventDefault();

		try {
			// Make sure `postId` is a valid integer and `commentText` is not empty
			if (!postId || !commentText.trim()) {
				setStatus("Error: Missing required fields.");
				return;
			}

			const response = await api.post(`/api/comments/`, {
				post: postId,
				text: commentText,
			});

			setStatus("Comment posted successfully!");
			setCommentText("");
			onCommentAdded(response.data);
		} catch (error) {
			if (error.response) {
				// The request was made, and the server responded with a status code
				// that falls out of the range of 2xx
				console.error("Error response:", error.response.data);
				setStatus(`Error: ${error.response.data}`);
			} else if (error.request) {
				// The request was made, but no response was received
				console.error("Error request:", error.request);
				setStatus("Error: No response from the server.");
			} else {
				// Something happened in setting up the request that triggered an error
				console.error("Error message:", error.message);
				setStatus(`Error: ${error.message}`);
			}
		}
	};

	return (
		<div className="create-comment">
			<form onSubmit={postComment}>
				<label htmlFor={`comment-${postId}`}>New Comment:</label>
				<input
					type="text"
					id={`comment-${postId}`}
					value={commentText}
					onChange={handleCommentChange}
				/>
				<button type="submit">Post Comment</button>
			</form>
			{status && <p>{status}</p>}
		</div>
	);
}

export default CreateComment;
