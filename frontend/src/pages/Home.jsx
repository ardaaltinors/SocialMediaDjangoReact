import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css";

function Home() {
	const [posts, setPosts] = useState([]); // posts is an array of objects
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [status, setStatus] = useState("");

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

	const createPost = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("caption", caption);
		formData.append("image", image);

		try {
			await api.post("/api/posts/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setStatus("Success! Your post has been created.");
			setCaption(""); // Clear the input fields after success
			setImage(null);
			getPosts(); // Refresh posts list
		} catch (error) {
			setStatus("Error: Unable to create post.");
		}
	};

	// Form data management
	const handleCaptionChange = (e) => {
		setCaption(e.target.value);
	};

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	return (
		<div>
			<h1>All Posts</h1>
			<div className="create-post">
				<form onSubmit={createPost}>
					<div>
						<label htmlFor="caption">Caption:</label>
						<input
							type="text"
							id="caption"
							value={caption}
							onChange={handleCaptionChange}
						/>
					</div>
					<div>
						<label htmlFor="image">Upload Image:</label>
						<input
							type="file"
							id="image"
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>
					<button type="submit">Create Post</button>
				</form>
				{status && <p>{status}</p>}
			</div>

			<div className="posts">
				{posts.map((post) => (
					<div key={post.id} className="post">
						<img
							src={post.image}
							alt={post.caption}
							style={{ width: "100%", maxWidth: "500px" }}
						/>
						<p>{post.caption}</p>
						<p>
							{post.user.username} - {new Date(post.created).toLocaleString()}
						</p>
						<hr />
					</div>
				))}
			</div>
		</div>
	);
}

export default Home;
