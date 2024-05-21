import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import "../styles/ProfileEdit.css";
import NavBar from "../components/Navigation/NavBar";
import LeftMenu from "../components/LeftMenu/LeftMenu";

function ProfileEdit() {
	const [currentUser, setCurrentUser] = useState([]);
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

	document.title = "Edit Profile - GymUnity";

	useEffect(() => {
		getCurrentUser();
		api
			.get("/api/profiles/")
			.then((response) => {
				const data =
					response.data && response.data.length > 0 ? response.data[0] : null;

				if (data) {
					setUserId(data.user || null);
					setProfileId(data.id || null);
					setBio(data.bio || "");
					setGender(data.gender || "");
					setHeight(data.height || "");
					setWeight(data.weight || "");
					setGoal(data.goal || "");
					setDateOfBirth(data.date_of_birth || "");
					setProfilePicture(data.profile_picture);
					setCoverPhoto(data.cover_photo);
				} else {
					console.error("No profile data found.");
				}
			})
			.catch((error) => {
				console.error("Error fetching profile data:", error);
				alert("Error fetching profile data: " + error);
			});
	}, []);

	const getCurrentUser = () => {
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
				console.log(response.data);
			})
			.catch((error) => alert(error));
	};

	const handleProfileSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("bio", bio);
		formData.append("gender", gender);
		formData.append("height", height);
		formData.append("weight", weight);
		formData.append("goal", goal);
		formData.append("date_of_birth", dateOfBirth);

		if (profilePicture && profilePicture instanceof File) {
			formData.append("profile_picture", profilePicture);
		}

		if (coverPhoto && coverPhoto instanceof File) {
			formData.append("cover_photo", coverPhoto);
		}

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

			setTimeout(() => {
				navigate(`/profile/${currentUser.username}/`);
			}, 1000);
		} catch (error) {
			console.error(
				"Error updating profile:",
				error.response ? error.response.data : error
			);
			setStatus("Error updating profile: " + error);
		}
	};

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
			<NavBar user={currentUser} />
			<div className="profile-edit-page">
				<h1>Edit Profile</h1>
				<div className="profile-edit-container">
					<form className="profile-edit-form" onSubmit={handleProfileSubmit}>
						<div>
							<label htmlFor="bio">Bio:</label>
							<textarea id="bio" value={bio} onChange={handleBioChange} />
						</div>
						<div>
							<label htmlFor="gender">Gender:</label>
							<select id="gender" value={gender} onChange={handleGenderChange}>
								<option value="">Select Gender</option>
								<option value="M">Male</option>
								<option value="F">Female</option>
								<option value="O">Other</option>
							</select>
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
							<select id="goal" value={goal} onChange={handleGoalChange}>
								<option value="">Select Goal</option>
								<option value="maintain">Maintain Weight</option>
								<option value="gain">Gain Weight</option>
								<option value="lose">Lose Weight</option>
							</select>
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
					{status && <p className="profile-edit-status">{status}</p>}
				</div>
			</div>
			<LeftMenu />
		</div>
	);
}

export default ProfileEdit;
