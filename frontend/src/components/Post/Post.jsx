import React from "react";
import "./post.css";

import likeImage from "../../assets/images/like.png";
import CommentList from "../CommentList";
import CreateComment from "../CreateComment";

const Post = ({ post, toggleLike, comments, handleCommentAdded }) => {
	return (
		<div key={post.id} className="post">
			<div className="postContainer">
				<div className="postTop">
					<div className="postTopLeft">
						<img
							src={post.user.profile_picture}
							alt="Profile Photo"
							className="postImage"
						/>
						<span className="postUserName">{post.user.username}</span>
						<span className="postTime">
							{new Date(post.created).toLocaleString()}
						</span>
					</div>
				</div>

				<div className="postCenter">
					<div className="postCaption">{post.caption}</div>
					<img src={post.image} alt="" className="postedImage" />
				</div>

				<div className="postBottom">
					<div className="postBottomLeft">
						<button
							onClick={() => toggleLike(post.id)}
							style={{
								background: "none",
								border: "none",
								padding: 0,
								cursor: "pointer",
							}}
						>
							<img src={likeImage} alt="Like" className="reactionPic" />
						</button>
						<span className="likeCount">{post.liked_by.length}</span>
					</div>
					<div className="postBottomRight">
						<span className="commentCount">
							{comments[post.id] ? comments[post.id].length : 0} comments
						</span>
					</div>
				</div>
				<CommentList comments={comments[post.id] || []} />
				<CreateComment
					postId={post.id}
					onCommentAdded={(newComment) =>
						handleCommentAdded(post.id, newComment)
					}
				/>
			</div>
			<br />
		</div>
	);
};

export default Post;
