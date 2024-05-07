import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css";

function Home() {
	const [posts, setPosts] = useState([]); // posts is an array of objects

	useEffect(() => {
		getPosts();
	}, []);

	const getPosts = () => {
		api
			.get("/api/posts/")
			.then((response) => response.data)
			.then((data) => {
				setPosts(data);
				console.log(data);
			})
			.catch((error) => alert(error));
	};

	return (
		<div>
			<h1>All Posts</h1>
			<div className="posts">
				{posts.map((post) => (
					<div key={post.id} className="post">
						<p>{post.caption}</p>
						<p>
							{post.user} - {new Date(post.created).toLocaleString()}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
