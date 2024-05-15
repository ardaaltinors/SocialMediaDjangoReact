import React, { useState } from "react";
import api from "../api"; // Importing the API utility you're using throughout the project

function Search() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState({ posts: [], profiles: [] });
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async () => {
		setIsLoading(true);
		try {
			// Using the api utility for making the request
			const response = await api.get("/api/search/", { params: { query } });
			setResults(response.data); // Parsing both posts and profiles from the response
		} catch (error) {
			console.error("Error fetching search results:", error);
			alert("Failed to fetch results");
		}
		setIsLoading(false);
	};

	return (
		<div>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search..."
			/>
			<button onClick={handleSearch} disabled={isLoading}>
				{isLoading ? "Searching..." : "Search"}
			</button>
			<div>
				<h3>Posts</h3>
				{results.posts.length > 0 ? (
					<ul>
						{results.posts.map((post, index) => (
							<li key={index}>
								<img
									src={post.image}
									alt={post.caption}
									style={{ width: "100px", height: "100px" }}
								/>
								<p>{post.caption}</p>
								<p>Posted by: {post.user.username}</p>
							</li>
						))}
					</ul>
				) : !isLoading && query ? (
					<p>No posts found for "{query}"</p>
				) : null}

				<h3>Profiles</h3>
				{results.profiles.length > 0 ? (
					<ul>
						{results.profiles.map((profile, index) => (
							<li key={index}>
								<img
									src={profile.profile_picture}
									alt={profile.username}
									style={{ width: "50px", height: "50px" }}
								/>
								<p>Username: {profile.username}</p>
								<p>Bio: {profile.bio}</p>
							</li>
						))}
					</ul>
				) : !isLoading && query ? (
					<p>No profiles found for "{query}"</p>
				) : null}
			</div>
		</div>
	);
}

export default Search;
