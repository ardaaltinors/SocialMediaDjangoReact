import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../api";
import "../styles/GymAssistant.css";

import NavBar from "../components/Navigation/NavBar";
import LeftMenu from "../components/LeftMenu/LeftMenu";
import LoadingIndicator from "../components/LoadingIndicator";

function GymAssistant() {
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getCurrentUser();
	}, []);

	const getCurrentUser = () => {
		api
			.get("/api/current-user/")
			.then((response) => {
				setCurrentUser(response.data);
			})
			.catch((error) => alert(error));
	};

	document.title = `${currentUser?.username}' Assistant`;

	if (!currentUser) {
		return LoadingIndicator();
	}

	return (
		console.log(currentUser),
		(
			<div>
				<NavBar user={currentUser} />
				<div id="mainContainer">
					<h1>{currentUser.username}'s Personal Gym Assistant</h1>
				</div>
				<LeftMenu />
			</div>
		)
	);
}

export default GymAssistant;
