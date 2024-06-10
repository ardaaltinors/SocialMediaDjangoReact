import React from "react";
import "./LeftMenu.css";
import GroupIcon from "@mui/icons-material/Group";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import BuildIcon from "@mui/icons-material/Build";

export default function LeftMenu() {
	return (
		<div className="leftPane">
			<div className="leftPainContainer">
				<div className="leftPainMenu">
					<a href="/">
						<li className="leftPainMenuItem">
							<RssFeedIcon className="leftPainIcons" />
							<span className="leftMenuText">Feed</span>
						</li>
					</a>

					<a href="/#following">
						<li className="leftPainMenuItem">
							<GroupIcon className="leftPainIcons" />
							<span className="leftMenuText">Following</span>
						</li>
					</a>

					<a href="/edit-profile">
						<li className="leftPainMenuItem">
							<BuildIcon className="leftPainIcons" />
							<span className="leftMenuText">Settings</span>
						</li>
					</a>
				</div>
			</div>
		</div>
	);
}
