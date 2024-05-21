import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";

import NavBar from "../components/Navigation/NavBar";
import Post from "../components/Post/Post";
import LeftMenu from "../components/LeftMenu/LeftMenu";
import LoadingIndicator from "../components/LoadingIndicator";

function Home() {
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

	const getCurrentUser = () => {
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
			})
			.catch((error) => alert(error));
	};

	const getSinglePost = async (postId) => {
		try {
			const response = await api.get(`/api/posts/${postId}/`);
			setPost(response.data);
			console.log(response.data);
		} catch (error) {
			alert(`Error fetching post: ${error}`);
		}
	};

	const getCommentsForPost = (postId) => {
		setIsLoading(true);
		api
			.get(`/api/comments/post/${postId}/`)
			.then((response) => response.data)
			.then((data) => {
				setComments((prev) => ({ ...prev, [postId]: data }));
				setIsLoading(false);
			})
			.catch((error) => alert(`Error fetching comments: ${error}`));
	};

	const handleCommentAdded = (postId, newComment) => {
		setComments((prev) => ({
			...prev,
			[postId]: [...(prev[postId] || []), newComment],
		}));
	};

	if (!post || !currentUser) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<NavBar user={currentUser} />
			<div id="mainContainer">
				<div className="content">
					{isLoading && LoadingIndicator()}
					{!isLoading && (
						<div className="posts">
							<Post
								key={post.id}
								post={post}
								comments={comments[post.id] || []}
								handleCommentAdded={handleCommentAdded}
							/>
						</div>
					)}
				</div>
			</div>
			<LeftMenu />
		</div>
	);
}

export default Home;
