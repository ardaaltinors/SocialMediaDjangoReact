import React from "react";
import "./CreatePost.css";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IconButton from "@mui/material/IconButton";

const CreatePost = ({
	user,
	createPost,
	handleCaptionChange,
	handleFileChange,
	caption,
	status,
	uploadProgress,
}) => {
	return (
		<div className="addPost">
			<form onSubmit={createPost} encType="multipart/form-data">
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
							<label htmlFor="file">
								<IconButton component="span">
									<InsertPhotoIcon htmlColor="#3b579d" className="addPhoto" />
								</IconButton>
								<span className="addPostOptionText">Add Image/Video</span>
							</label>
							<input
								type="file"
								id="file"
								accept="image/*,video/*"
								onChange={handleFileChange}
								style={{ display: "none" }} // Hide the default file input
							/>
						</div>
						{uploadProgress > 0 && (
							<div className="uploadProgress">
								<p>Uploading: {uploadProgress}%</p>
								<div className="progressBar">
									<div
										className="progress"
										style={{ width: `${uploadProgress}%` }}
									></div>
								</div>
							</div>
						)}
						{status && (
							<div>
								<p>{status}</p>
							</div>
						)}
						<button className="postButton">Post</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreatePost;
