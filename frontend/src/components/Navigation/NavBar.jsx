import React, { useState, useEffect } from "react";
import { fetchNotifications } from "../../utils/notificationUtils";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Notifications from "../Notifications/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./navbar.css";
import Search from "./Search/Search";

function NavBar({ user }) {
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const initFetch = async () => {
			const data = await fetchNotifications();
			setNotifications(data);
		};
		initFetch();
	}, []);

	const toggleNotifications = () => setShowNotifications(!showNotifications);
	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<div className="navBarBox">
			<div className="navBarLeft">
				<span className="logo">GymUnity</span>
			</div>
			<div className="navBarCenter">
				<Search />
			</div>
			<div className="navBarRight">
				<div className="navBarIcons">
					<div className="navIcon" onClick={toggleNotifications}>
						<NotificationsIcon />
						<span className="iconTag">{notifications.length}</span>
					</div>
				</div>
				<div className="pic">
					<a href={`/profile/${user.username}`}>
						<img
							src={user.profile_picture}
							alt="Profile Picture"
							className="profilePicImg"
						/>
					</a>
				</div>
				<div className="mobileMenuIcon" onClick={toggleMobileMenu}>
					{isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
				</div>
			</div>
			{showNotifications && <Notifications />}
			{isMobileMenuOpen && (
				<div className="mobileMenu">
					<div className="mobileMenuItem">
						<Search />
					</div>
				</div>
			)}
		</div>
	);
}

export default NavBar;
