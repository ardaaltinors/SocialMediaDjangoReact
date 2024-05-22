import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";

import NavBar from "../components/Navigation/NavBar";
import Post from "../components/Post/Post";
import LeftMenu from "../components/LeftMenu/LeftMenu";
import LoadingIndicator from "../components/LoadingIndicator";

function SinglePost() {
	const { id } = useParams(); // Get post ID from URL parameters
	const [post, setPost] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [comments, setComments] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getSinglePost(id);
		getCurrentUser();
		getCommentsForPost(id);
	}, [id]);

	const getCurrentUser = async () => {
		setIsLoading(true);
		try {
			const response = await api.get("/api/current-user/");
			setCurrentUser(response.data);
		} catch (error) {
			alert(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getSinglePost = async (postId) => {
		setIsLoading(true);
		try {
			const response = await api.get(`/api/posts/${postId}/`);
			setPost(response.data);
			console.log(response.data);
		} catch (error) {
			alert(`Error fetching post: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const getCommentsForPost = async (postId) => {
		try {
			const response = await api.get(`/api/comments/post/${postId}/`);
			setComments((prev) => ({ ...prev, [postId]: response.data }));
		} catch (error) {
			alert(`Error fetching comments: ${error}`);
		}
	};

	const handleCommentAdded = (postId, newComment) => {
		setComments((prev) => ({
			...prev,
			[postId]: [...(prev[postId] || []), newComment],
		}));
	};

	document.title = `${currentUser?.username}'s: ${post?.caption}`;

	if (isLoading || !post || !currentUser || !comments[id]) {
		return <LoadingIndicator />;
	}

	return (
		<div>
			<NavBar user={currentUser} />
			<div id="mainContainer">
				<div className="content">
					<div className="posts">
						<Post
							key={post.id}
							post={post}
							comments={comments[id]}
							handleCommentAdded={handleCommentAdded}
						/>
					</div>
				</div>
			</div>
			<LeftMenu />
		</div>
	);
}

export default SinglePost;
