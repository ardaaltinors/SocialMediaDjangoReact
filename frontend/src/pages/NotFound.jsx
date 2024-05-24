import "../styles/Home.css";
import LeftMenu from "../components/LeftMenu/LeftMenu";

function NotFound() {
	return (
		<div>
			<div className="flex-menu-content">
				<LeftMenu />
				<div className="content">
					<h1>404 Not Found</h1>
					<p>The page you are looking for does not exist.</p>
					<span>
						Go back to the <a href="/">home page</a>.
					</span>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
