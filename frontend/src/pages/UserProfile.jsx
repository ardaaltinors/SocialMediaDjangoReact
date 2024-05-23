import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import NavBar from "../components/Navigation/NavBar";
import Post from "../components/Post/Post";
import "../styles/UserProfile.css";
import LeftMenu from "../components/LeftMenu/LeftMenu";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function UserProfile() {
	const { username } = useParams();
	const [currentUser, setCurrentUser] = useState([]);
	const [bio, setBio] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [coverPhoto, setCoverPhoto] = useState(null);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [posts, setPosts] = useState([]);
	const [userId, setUserId] = useState(null);
	const [comments, setComments] = useState({});
	const [isCurrentUserLoading, setIsCurrentUserLoading] = useState(true);

	const [buttonText, setButtonText] = useState("Follow");
	const [open, setOpen] = useState(false);
	const [modalContent, setModalContent] = useState([]);

	document.title = `${username}'s Profile | GymCommunity`;

	useEffect(() => {
		getCurrentUser();
	}, []);

	useEffect(() => {
		if (!isCurrentUserLoading) {
			api
				.get(`/api/profile/${username}/`)
				.then((response) => {
					const data = response.data;
					console.log(data);
					setBio(data.bio || "");
					setProfilePicture(data.profile_picture || "");
					setCoverPhoto(data.cover_photo || "");
					setFollowers(data.followers || []);
					setFollowing(data.following || []);
					setPosts(data.posts || []);
					setUserId(data.id);
				})
				.catch((error) => {
					console.error("Error fetching profile data:", error);
					alert("Error fetching profile data: " + error);
				});
		}
	}, [username, isCurrentUserLoading]);

	useEffect(() => {
		if (!isCurrentUserLoading) {
			setButtonText(checkFollowStatus() ? "Unfollow" : "Follow");
		}
	}, [userId]);

	const getCurrentUser = () => {
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
				setIsCurrentUserLoading(false);
			})
			.catch((error) => {
				alert(error);
				setIsCurrentUserLoading(false);
			});
	};

	const checkFollowStatus = () => {
		return followers.includes(currentUser.username);
	};

	const toggleFollow = () => {
		if (!userId) return;
		api
			.post(`/api/users/${userId}/toggle-follow/`)
			.then((response) => {
				console.log(response.data.status);
				if (response.data.status === "followed") {
					setButtonText("Unfollow");
				} else {
					setButtonText("Follow");
				}
			})
			.catch((error) => {
				console.error("Error toggling follow status:", error);
			});
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

	const handleCommentAdded = (postId, newComment) => {
		setComments((prev) => ({
			...prev,
			[postId]: [...(prev[postId] || []), newComment],
		}));
	};

	const handleOpen = (content) => {
		setModalContent(content);
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 300,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	return (
		<div>
			<NavBar user={currentUser} />
			<div className="profile-page">
				<LeftMenu />
				<div className="profile-container">
					{coverPhoto && (
						<div className="cover-photo">
							<img src={coverPhoto} alt="Cover" />
						</div>
					)}
					<div className="profile-info">
						{profilePicture && (
							<img
								src={profilePicture}
								alt="Profile"
								className="profile-picture"
							/>
						)}
						<h1>{username}</h1>
						{currentUser.username === username ? (
							<div className="profile-controls">
								<button
									onClick={() => (window.location.href = "/edit-profile")}
									className="edit-button"
								>
									Edit Profile
								</button>
								<button
									onClick={() => (window.location.href = "/logout")}
									className="logout-button"
								>
									Logout
								</button>
							</div>
						) : (
							<button onClick={toggleFollow} className="follow-button">
								{buttonText}
							</button>
						)}
						<p className="bio">{bio}</p>
					</div>
					<div className="profile-content">
						<div className="connections">
							<div className="followers" onClick={() => handleOpen(followers)}>
								<h3>Followers ({followers.length})</h3>
							</div>
							<div className="following" onClick={() => handleOpen(following)}>
								<h3>Following ({following.length})</h3>
							</div>
						</div>
						<div className="posts">
							<h2>Posts</h2>
							{posts.map(
								(post) =>
									post && (
										<Post
											key={post.id}
											post={post}
											toggleLike={toggleLike}
											comments={"disabled"}
											handleCommentAdded={handleCommentAdded}
											currentUser={currentUser}
										/>
									)
							)}
						</div>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={handleClose}>
				<Box sx={modalStyle}>
					<h2>{modalContent === followers ? "Followers" : "Following"}</h2>
					<ul>
						{modalContent.map((user, index) => (
							<a key={index} href={`/profile/${user}`}>
								<li key={index}>{user}</li>
							</a>
						))}
					</ul>
				</Box>
			</Modal>
		</div>
	);
}

export default UserProfile;
