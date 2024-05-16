import React from "react";
import "./Comment.css";

function CommentList({ comments }) {
	return (
		<div className="comments">
			{comments.length > 0 ? (
				comments.map((comment) => (
					<div key={comment.id} className="comment">
						<div className="comment-header">
							<img
								src={comment.user.profile_picture}
								alt="user"
								className="comment-profile-pic"
							/>
							<a href={`/profile/${comment.user.username}`}>
								<b>@{comment.user.username}</b>
							</a>
							<span className="comment-date">
								{new Date(comment.created).toLocaleString()}
							</span>
						</div>
						<p className="comment-text">{comment.text}</p>
					</div>
				))
			) : (
				<p>No comments yet</p>
			)}
		</div>
	);
}

export default CommentList;
