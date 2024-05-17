import React from "react";
import "./LeftMenu.css";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import GroupIcon from "@mui/icons-material/Group";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import FlagIcon from "@mui/icons-material/Flag";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BuildIcon from "@mui/icons-material/Build";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

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

					<a href="#">
						<li className="leftPainMenuItem">
							<GroupIcon className="leftPainIcons" />
							<span className="leftMenuText">Following</span>
						</li>
					</a>

					<li className="leftPainMenuItem">
						<CalendarMonthIcon className="leftPainIcons" />
						<span className="leftMenuText">Events</span>
					</li>

					<li className="leftPainMenuItem">
						<BuildIcon className="leftPainIcons" />
						<span className="leftMenuText">Settings</span>
					</li>

					<li className="leftPainMenuItem">
						<NewspaperIcon className="leftPainIcons" />
						<span className="leftMenuText">Promotes</span>
					</li>

					<li className="leftPainMenuItem">
						<AddShoppingCartIcon className="leftPainIcons" />
						<span className="leftMenuText">Get Premium</span>
					</li>
				</div>
			</div>
		</div>
	);
}
