import { useState } from "react";
import api from "../../api";
import "./Comment.css";

function CreateComment({ postId, onCommentAdded }) {
	const [commentText, setCommentText] = useState("");
	const [status, setStatus] = useState("");

	const handleCommentChange = (e) => {
		setCommentText(e.target.value);
	};

	const postComment = async (e) => {
		e.preventDefault();

		if (!postId || isNaN(postId) || !commentText.trim()) {
			setStatus("Error: Missing required fields.");
			return;
		}

		try {
			const response = await api.post(`/api/comments/post/${postId}/`, {
				text: commentText,
			});

			setStatus("Comment posted successfully!");
			setCommentText("");
			onCommentAdded(response.data);
		} catch (error) {
			setStatus("Error: Unable to post comment.");
			console.error("Error posting comment:", error);
		}
	};

	return (
		<div className="create-comment">
			<form onSubmit={postComment} className="comment-form">
				<textarea
					id={`comment-${postId}`}
					placeholder="Write a comment..."
					value={commentText}
					onChange={handleCommentChange}
					className="comment-input"
				/>
				<button type="submit" className="comment-submit-button">
					Post
				</button>
			</form>
			{status && <p className="comment-status">{status}</p>}
		</div>
	);
}

export default CreateComment;
