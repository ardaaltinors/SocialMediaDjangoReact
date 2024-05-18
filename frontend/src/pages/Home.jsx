import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import "../styles/Home.css";

import NavBar from "../components/Navigation/NavBar";
import Post from "../components/Post/Post";
import CreatePost from "../components/CreatePost/CreatePost";
import LeftMenu from "../components/LeftMenu/LeftMenu";

function Home() {
	const [posts, setPosts] = useState([]);
	const [currentUser, setCurrentUser] = useState([]);
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [status, setStatus] = useState("");
	const [comments, setComments] = useState({});
	const location = useLocation();

	useEffect(() => {
		getPosts();
		getCurrentUser();
	}, [location]); // Re-run the effect when the location changes

	const getCurrentUser = () => {
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
				console.log(response.data);
			})
			.catch((error) => alert(error));
	};

	const getPosts = () => {
		const endpoint =
			location.hash === "#following" ? "/api/following-posts/" : "/api/posts/";
		api
			.get(endpoint)
			.then((response) => response.data)
			.then((posts) => {
				setPosts(posts);
				console.log(posts);
				posts.forEach((post) => getCommentsForPost(post.id));
			})
			.catch((error) => alert(error));
	};

	const getCommentsForPost = (postId) => {
		api
			.get(`/api/comments/post/${postId}/`)
			.then((response) => response.data)
			.then((data) => {
				setComments((prev) => ({ ...prev, [postId]: data }));
			})
			.catch((error) => alert(`Error fetching comments: ${error}`));
	};

	const handleCommentAdded = (postId, newComment) => {
		setComments((prev) => ({
			...prev,
			[postId]: [...(prev[postId] || []), newComment],
		}));
	};

	const createPost = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("caption", caption);
		formData.append("image", image);

		try {
			await api.post("/api/posts/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setStatus("Success! Your post has been created.");
			setCaption("");
			setImage(null);
			getPosts();
		} catch (error) {
			setStatus("Error: Unable to create post.");
		}
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const toggleLike = (postId) => {
		api
			.post(`/api/posts/${postId}/toggle-like/`)
			.then((response) => {
				const updatedPosts = posts.map((post) => {
					if (post.id === postId) {
						return { ...post, likes: response.data.likes_count };
					}
					return post;
				});
				setPosts(updatedPosts);
			})
			.catch((error) => {
				console.error("Error toggling like:", error);
			});
	};

	return (
		<div>
			<NavBar user={currentUser} />
			<div id="mainContainer">
				<div className="content">
					<CreatePost
						user={currentUser}
						createPost={createPost}
						handleCaptionChange={handleCaptionChange}
						handleImageChange={handleImageChange}
						caption={caption}
					/>

					<div className="posts">
						{posts.map(
							(post) =>
								post && (
									<Post
										key={post.id}
										post={post}
										toggleLike={toggleLike}
										comments={comments}
										handleCommentAdded={handleCommentAdded}
									/>
								)
						)}
					</div>
				</div>
			</div>
			<LeftMenu />
		</div>
	);
}

export default Home;
