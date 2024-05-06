import AuthForm from "../components/AuthForm";

function Login() {
	return <AuthForm route="/api/token/" method="login" />;
}

export default Login;
