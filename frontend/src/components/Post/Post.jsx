import React, { useState } from "react";
import api from "../../api";
import moment from "moment";
import { getSinglePost } from "../../utils/getSinglePost";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import "./Post.css";

import likeImage from "../../assets/images/like.png";
import CommentList from "./CommentList";
import CreateComment from "./CreateComment";

const Post = ({ post, comments, handleCommentAdded, currentUser }) => {
	const [isImageOpen, setIsImageOpen] = useState(false);
	const [postLikeCount, setPostLikeCount] = useState(post.liked_by.length);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

	const handleDeletePost = async () => {
		try {
			await api.delete(`/api/posts/${post.id}/`);
			window.location.reload();
		} catch (error) {
			console.error("Error deleting post:", error);
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
							<a href={`/posts/${post.id}`}>{moment(post.created).fromNow()}</a>
						</span>
					</div>
					<div className="postTopRight">
						{currentUser.id === post.user.id && (
							<>
								{showDeleteConfirmation ? (
									<div className="deleteConfirmation">
										<Button
											variant="contained"
											color="secondary"
											onClick={handleDeletePost}
										>
											Confirm Delete
										</Button>
										<Button
											variant="contained"
											onClick={() => setShowDeleteConfirmation(false)}
										>
											Cancel
										</Button>
									</div>
								) : (
									<Tooltip title="Delete Post" arrow>
										<DeleteIcon
											onClick={() => setShowDeleteConfirmation(true)}
											className="deleteIcon"
										/>
									</Tooltip>
								)}
							</>
						)}
					</div>
				</div>
				<div className="postCenter">
					<div className="postCaption">{post.caption}</div>
					<center>
						{post.video && (
							<video src={post.video} alt="" className="postedVideo" controls />
						)}
						{post.image && (
							<img
								src={post.image}
								alt=""
								className="postedImage"
								onClick={handleImageClick}
							/>
						)}
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
						{comments !== "disabled" && (
							<span className="commentCount">
								{comments[post.id] ? comments[post.id].length : 0} comments
							</span>
						)}
					</div>
				</div>
				{comments !== "disabled" && (
					<>
						<CommentList comments={comments[post.id] || comments || []} />
						<CreateComment
							postId={post.id}
							onCommentAdded={(newComment) =>
								handleCommentAdded(post.id, newComment)
							}
						/>
					</>
				)}
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
