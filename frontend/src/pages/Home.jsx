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
	const [file, setFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [comments, setComments] = useState({});
	const [status, setStatus] = useState("");
	const location = useLocation();

	useEffect(() => {
		getPosts();
		getCurrentUser();

		if (location.hash === "#following") {
			document.title = "Following - GymUnity";
		} else {
			document.title = "Home - GymUnity";
		}
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

		if (file) {
			if (file.type.startsWith("image/")) {
				formData.append("image", file);
			} else if (file.type.startsWith("video/")) {
				formData.append("video", file);
			}
		}

		try {
			await api.post("/api/posts/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setUploadProgress(percentCompleted);
				},
			});
			setStatus("Success! Your post has been created.");
			setCaption("");
			setFile(null);
			setUploadProgress(0); // Reset progress
			getPosts();
		} catch (error) {
			setStatus("Error: Unable to create post.");
			setUploadProgress(0);
		}
	};

	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	return (
		<div>
			<NavBar user={currentUser} />
			<LeftMenu />
			<div>
				<div className="content">
					<CreatePost
						user={currentUser}
						createPost={createPost}
						handleCaptionChange={handleCaptionChange}
						handleFileChange={handleFileChange}
						caption={caption}
						status={status}
						uploadProgress={uploadProgress}
					/>

					<div className="posts">
						{posts.map(
							(post) =>
								post && (
									<Post
										key={post.id}
										post={post}
										comments={comments}
										handleCommentAdded={handleCommentAdded}
										currentUser={currentUser}
									/>
								)
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
