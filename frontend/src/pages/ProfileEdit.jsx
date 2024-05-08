import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ProfileEdit() {
	// State variables to hold profile data
	const [userId, setUserId] = useState(null);
	const [profileId, setProfileId] = useState(null);
	const [bio, setBio] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [coverPhoto, setCoverPhoto] = useState(null);
	const [gender, setGender] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [goal, setGoal] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [status, setStatus] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		// Fetch the user's current profile data
		api
			.get("/api/profiles/")
			.then((response) => {
				// Check if the response contains data
				const data =
					response.data && response.data.length > 0 ? response.data[0] : null;

				if (data) {
					// Log the entire data object to confirm structure
					console.log("Received data:", data);

					// Assign the user ID directly to state
					setUserId(data.user || null);
					setProfileId(data.id || null);

					// Assign other profile fields
					setBio(data.bio || "");
					setGender(data.gender || "");
					setHeight(data.height || "");
					setWeight(data.weight || "");
					setGoal(data.goal || "");
					setDateOfBirth(data.date_of_birth || "");

					// For profile and cover photos, assign the URLs directly to state
					setProfilePicture(data.profile_picture);
					setCoverPhoto(data.cover_photo);

					// Log the assigned userId
					console.log("Assigned userId:", data.user);
				} else {
					console.error("No profile data found.");
				}
			})
			.catch((error) => {
				console.error("Error fetching profile data:", error);
				alert("Error fetching profile data: " + error);
			});
	}, []);

	// Handle profile form submission
	const handleProfileSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("bio", bio);
		formData.append("gender", gender);
		formData.append("height", height);
		formData.append("weight", weight);
		formData.append("goal", goal);
		formData.append("date_of_birth", dateOfBirth);

		// profilePicture ve coverPhoto girişlerinden dosyaları alın
		if (profilePicture && profilePicture instanceof File) {
			formData.append("profile_picture", profilePicture);
		}

		if (coverPhoto && coverPhoto instanceof File) {
			formData.append("cover_photo", coverPhoto);
		}

		// Ensure the user ID is valid before attempting an update
		if (userId === null) {
			setStatus("Error: No valid user ID available.");
			return;
		}

		try {
			await api.put(`/api/profiles/${profileId}/`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setStatus("Profile updated successfully!");

			// Navigate to the home page after a successful update
			setTimeout(() => {
				navigate("/");
			}, 1000);
		} catch (error) {
			console.error(
				"Error updating profile:",
				error.response ? error.response.data : error
			);
			setStatus("Error updating profile: " + error);
		}
	};

	// Form input change handlers
	const handleBioChange = (e) => setBio(e.target.value);
	const handleGenderChange = (e) => setGender(e.target.value);
	const handleHeightChange = (e) => setHeight(e.target.value);
	const handleWeightChange = (e) => setWeight(e.target.value);
	const handleGoalChange = (e) => setGoal(e.target.value);
	const handleDateOfBirthChange = (e) => setDateOfBirth(e.target.value);
	const handleProfilePictureChange = (e) =>
		setProfilePicture(e.target.files[0]);
	const handleCoverPhotoChange = (e) => setCoverPhoto(e.target.files[0]);

	return (
		<div>
			<h1>Edit Profile</h1>
			<form onSubmit={handleProfileSubmit}>
				{/* Display the user ID for reference */}
				<div>
					<label htmlFor="user_id">User ID:</label>
					<input type="text" id="user_id" value={userId || ""} readOnly />
				</div>
				<div>
					<label htmlFor="bio">Bio:</label>
					<textarea id="bio" value={bio} onChange={handleBioChange} />
				</div>
				<div>
					<label htmlFor="gender">Gender:</label>
					<input
						type="text"
						id="gender"
						value={gender}
						onChange={handleGenderChange}
					/>
				</div>
				<div>
					<label htmlFor="height">Height (cm):</label>
					<input
						type="number"
						id="height"
						value={height}
						onChange={handleHeightChange}
					/>
				</div>
				<div>
					<label htmlFor="weight">Weight (kg):</label>
					<input
						type="number"
						id="weight"
						value={weight}
						onChange={handleWeightChange}
					/>
				</div>
				<div>
					<label htmlFor="goal">Goal:</label>
					<input
						type="text"
						id="goal"
						value={goal}
						onChange={handleGoalChange}
					/>
				</div>
				<div>
					<label htmlFor="date_of_birth">Date of Birth:</label>
					<input
						type="date"
						id="date_of_birth"
						value={dateOfBirth}
						onChange={handleDateOfBirthChange}
					/>
				</div>
				<div>
					<label htmlFor="profile_picture">Profile Picture:</label>
					<input
						type="file"
						id="profile_picture"
						accept="image/*"
						onChange={handleProfilePictureChange}
					/>
				</div>
				<div>
					<label htmlFor="cover_photo">Cover Photo:</label>
					<input
						type="file"
						id="cover_photo"
						accept="image/*"
						onChange={handleCoverPhotoChange}
					/>
				</div>
				<button type="submit">Update Profile</button>
			</form>
			{status && <p>{status}</p>}
		</div>
	);
}

export default ProfileEdit;
