import AuthForm from "../components/AuthForm";

function Register() {
	return <AuthForm route="/api/user/register/" method="register" />;
}

export default Register;
