import React from "react";
import AuthForm from "../components/AuthForm";
import "../styles/Auth.css";
import Logo from "../assets/images/GymUnityLogo.png";

document.title = "Join GymUnity";

function Login() {
	return (
		<div className="login-page">
			<div className="login-container">
				<img src={Logo} alt="GymUnity Logo" className="logo" />

				<h2>Join GymUnity!</h2>
				<AuthForm route="/api/user/register/" method="register" />
				<a href="/login">Already a member? Login</a>
			</div>
		</div>
	);
}

export default Login;
