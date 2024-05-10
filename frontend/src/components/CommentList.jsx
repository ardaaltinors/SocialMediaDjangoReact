import React from "react";

function CommentList({ comments }) {
	return (
		<div className="comments">
			{comments.length > 0 ? (
				comments.map((comment) => (
					<div key={comment.id} className="comment">
						<p>
							<b>@{comment.username}</b> {comment.text}
						</p>
						<p>{new Date(comment.created).toLocaleString()}</p>
						<hr />
					</div>
				))
			) : (
				<p>No comments yet</p>
			)}
		</div>
	);
}

export default CommentList;
