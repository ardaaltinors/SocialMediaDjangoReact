import React, { useState } from "react";
import api from "../../api";
import moment from "moment";
import { getSinglePost } from "../../utils/getSinglePost";
import "./Post.css";

import likeImage from "../../assets/images/like.png";
import CommentList from "./CommentList";
import CreateComment from "./CreateComment";

const Post = ({ post, comments, handleCommentAdded }) => {
	const [isImageOpen, setIsImageOpen] = useState(false);
	const [postLikeCount, setPostLikeCount] = useState(post.liked_by.length);

	const handleImageClick = () => {
		setIsImageOpen(true);
	};

	const closeImage = () => {
		setIsImageOpen(false);
	};

	const toggleLike = async (post) => {
		try {
			await api.post(`/api/posts/${post.id}/toggle-like/`);
			const updatedPost = await getSinglePost(post.id);
			setPostLikeCount(updatedPost.liked_by.length);
			console.log(postLikeCount);
		} catch (error) {
			console.error("Error toggling like:", error);
		}
	};

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
						<a href={`/profile/${post.user.username}`}>
							<span className="postUserName">{post.user.username}</span>
						</a>
						<span className="postTime">
							{moment(post.created).fromNow()}
							{/* {new Date(post.created).toLocaleString()} */}
						</span>
					</div>
				</div>

				<div className="postCenter">
					<div className="postCaption">{post.caption}</div>
					<center>
						<img
							src={post.image}
							alt=""
							className="postedImage"
							onClick={handleImageClick}
						/>
					</center>
				</div>

				<div className="postBottom">
					<div className="postBottomLeft">
						<button
							onClick={() => toggleLike(post)}
							style={{
								background: "none",
								border: "none",
								padding: 0,
								cursor: "pointer",
							}}
						>
							<img src={likeImage} alt="Like" className="reactionPic" />
						</button>
						<span className="likeCount">{postLikeCount}</span>
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
			{isImageOpen && (
				<div className="imageModal" onClick={closeImage}>
					<img src={post.image} alt="Full Screen" className="fullScreenImage" />
				</div>
			)}
			<br />
		</div>
	);
};

export default Post;
