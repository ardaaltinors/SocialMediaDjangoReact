import React from "react";
import AuthForm from "../components/AuthForm";
import "../styles/Auth.css";
import Logo from "../assets/images/GymUnityLogo.png";

document.title = "Login to GymUnity";

function Login() {
	return (
		<div className="login-page">
			<div className="login-container">
				<img src={Logo} alt="GymUnity Logo" className="logo" />
				<h2>Login to Your Account</h2>
				<AuthForm route="/api/token/" method="login" />
				<a href="/register">Don't have an account? Sign up</a>
			</div>
		</div>
	);
}

export default Login;
