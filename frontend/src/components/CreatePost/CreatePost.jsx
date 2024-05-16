import React from "react";
import "./CreatePost.css";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IconButton from "@mui/material/IconButton";

const CreatePost = ({
	user,
	createPost,
	handleCaptionChange,
	handleImageChange,
	caption,
}) => {
	return (
		<div className="addPost">
			<form onSubmit={createPost}>
				<div className="addPostContainer">
					<div className="addPostTop">
						<img
							src={user.profile_picture}
							alt="User Profile"
							className="addPostPic"
						/>
						<input
							placeholder={`What's in your mind, ${user.username}?`}
							className="addpostInput"
							value={caption}
							onChange={handleCaptionChange}
							type="text"
						/>
					</div>
					<hr className="hrLine" />
					<div className="addPostBottom">
						<div className="addPostOptions">
							<label htmlFor="image">
								<IconButton component="span">
									<InsertPhotoIcon htmlColor="#3b579d" className="addPhoto" />
								</IconButton>
								<span className="addPostOptionText">Add Image/Video</span>
							</label>
							<input
								type="file"
								id="image"
								accept="image/*"
								onChange={handleImageChange}
								style={{ display: "none" }} // Hide the default file input
							/>
						</div>

						<button className="postButton">Post</button>
					</div>
				</div>
				{status && <p>{status}</p>}
			</form>
		</div>
	);
};

export default CreatePost;
