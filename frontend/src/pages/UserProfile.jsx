import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import NavBar from "../components/Navigation/NavBar";
import Post from "../components/Post/Post";
import "../styles/UserProfile.css";

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
	const [currentUserId, setCurrentUserId] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);

	const [comments, setComments] = useState({});

	useEffect(() => {
		getCurrentUser();
		api
			.get(`/api/profile/${username}/`)
			.then((response) => {
				const data = response.data;
				setBio(data.bio || "");
				setProfilePicture(data.profile_picture || "");
				setCoverPhoto(data.cover_photo || "");
				setFollowers(data.followers || []);
				setFollowing(data.following || []);
				setPosts(data.posts || []);
				setUserId(data.id);
				setCurrentUserId(data.current_user_id);
				checkFollowStatus(data.followers);
			})
			.catch((error) => {
				console.error("Error fetching profile data:", error);
				alert("Error fetching profile data: " + error);
			});
	}, [username]);

	const checkFollowStatus = (followersList) => {
		const isFollowing = followersList.some(
			(follower) => follower.id === currentUserId
		);
		setIsFollowing(isFollowing);
	};

	const getCurrentUser = () => {
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
			})
			.catch((error) => alert(error));
	};

	const toggleFollow = () => {
		if (!userId) return;
		api
			.post(`/api/users/${userId}/toggle-follow/`)
			.then((response) => {
				setIsFollowing(response.data.status === "followed");
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

	return (
		<div className="profile">
			<NavBar user={currentUser} />
			{coverPhoto && (
				<div className="cover-photo">
					<img src={coverPhoto} alt="Cover" />
				</div>
			)}
			<div className="profile-info">
				{profilePicture && (
					<img src={profilePicture} alt="Profile" className="profile-picture" />
				)}
				<h1>{username}</h1>
				<button onClick={toggleFollow} className="follow-button">
					{isFollowing ? "Unfollow" : "Follow"}
				</button>
				<p className="bio">{bio}</p>
			</div>
			<div className="profile-content">
				<div className="connections">
					<div className="followers">
						<h3>Followers ({followers.length})</h3>
						<ul>
							{followers.map((follower, index) => (
								<li key={index}>{follower}</li>
							))}
						</ul>
					</div>
					<div className="following">
						<h3>Following ({following.length})</h3>
						<ul>
							{following.map((followed, index) => (
								<li key={index}>{followed}</li>
							))}
						</ul>
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
									comments={comments}
									handleCommentAdded={handleCommentAdded}
								/>
							)
					)}
				</div>
			</div>
		</div>
	);
}

export default UserProfile;
