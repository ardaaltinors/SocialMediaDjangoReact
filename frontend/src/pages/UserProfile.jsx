import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function UserProfile() {
	const { username } = useParams();

	const [bio, setBio] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [coverPhoto, setCoverPhoto] = useState(null);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		// Fetch profile data based on the username
		api
			.get(`/api/profile/${username}/`)
			.then((response) => {
				const data = response.data;

				// Update state with the retrieved profile data
				setBio(data.bio || "");
				setProfilePicture(data.profile_picture || "");
				setCoverPhoto(data.cover_photo || "");
				setFollowers(data.followers || []);
				setFollowing(data.following || []);
				setPosts(data.posts || []);
			})
			.catch((error) => {
				console.error("Error fetching profile data:", error);
				alert("Error fetching profile data: " + error);
			});
	}, [username]); // Re-fetch when the username changes

	return (
		<div className="profile">
			{/* Display cover photo if available */}
			{coverPhoto && (
				<div className="cover-photo">
					<img
						src={coverPhoto}
						alt="Cover"
						style={{ width: "100%", height: "300px", objectFit: "cover" }}
					/>
				</div>
			)}

			{/* Profile picture and username */}
			<div className="profile-info">
				{profilePicture && (
					<img src={profilePicture} alt="Profile" className="profile-picture" />
				)}
				<h1>{username}</h1>
			</div>

			{/* Bio section */}
			<div className="bio">
				<h2>Bio</h2>
				<p>{bio}</p>
			</div>

			{/* Followers and following lists */}
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

			{/* User posts */}
			<div className="posts">
				<h2>Posts</h2>
				{posts.map((post) => (
					<div key={post.id} className="post">
						<img
							src={`http://localhost:8000${post.image}`}
							alt={post.caption}
							className="post-image"
						/>
						<p>{post.caption}</p>
						<small>Created: {new Date(post.created).toLocaleString()}</small>
					</div>
				))}
			</div>
		</div>
	);
}

export default UserProfile;
