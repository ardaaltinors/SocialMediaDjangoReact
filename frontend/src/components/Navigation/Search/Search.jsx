import React, { useState } from "react";
import api from "../../../api";
import SearchIcon from "@mui/icons-material/Search";
import "./Search.css";

function Search() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState({ posts: [], profiles: [] });
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async () => {
		setIsLoading(true);
		try {
			const response = await api.get("/api/search/", { params: { query } });
			setResults(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching search results:", error);
			alert("Failed to fetch results");
		}
		setIsLoading(false);
	};

	return (
		<div className="searchComponent">
			<div className="searchBox">
				<SearchIcon className="searchIcon" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search..."
					className="searchInput"
				/>

				<button onClick={handleSearch} disabled={isLoading}>
					Search
				</button>
			</div>
			{isLoading && <div>Loading...</div>}
			<div className="searchResults">
				{results.profiles.map((profile) => (
					<div key={profile.id} className="profileResult">
						<img
							src={profile.profile_picture}
							alt={profile.username}
							className="resultImage"
						/>
						<div className="resultInfo">
							<h4>{profile.username}</h4>
							<p>{profile.bio}</p>
						</div>
					</div>
				))}
				{results.posts.map((post) => (
					<div key={post.id} className="postResult">
						<img src={post.image} alt="Post image" className="resultImage" />
						<div className="resultInfo">
							<h4>{post.caption}</h4>
							<p>By {post.user.username}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Search;
