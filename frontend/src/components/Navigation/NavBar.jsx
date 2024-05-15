import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import "./navbar.css";

export default function NavBar() {
	return (
		<div className="navBarBox">
			<div className="navBarLeft">
				<span className="logo">GymUnity</span>
			</div>

			<div className="navBarCenter">
				<div className="searchBox">
					<SearchIcon className="schIcon" />
					<input
						placeholder="Search posts or users on GymUnity"
						className="schInput"
					/>
				</div>
			</div>

			<div className="navBarRight">
				<div className="navBarLinks">
					<span className="navLink">Home</span>
					<span className="navLink">Following</span>
				</div>
				<div className="navBarIcons">
					<div className="navIcon">
						<PersonIcon />
						<span className="iconTag">7</span>
					</div>

					<div className="navIcon">
						<MailIcon />
						<span className="iconTag">5</span>
					</div>
				</div>
				<div className="pic">
					<img src="" alt="Profile Picture" className="profilePicImg" />
				</div>
			</div>
		</div>
	);
}
