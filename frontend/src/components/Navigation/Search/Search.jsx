import React, { useState, useEffect, useRef } from "react";
import api from "../../../api";
import SearchIcon from "@mui/icons-material/Search";
import "./Search.css";
import LoadingIndicator from "../../LoadingIndicator";

function Search() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState({ posts: [], profiles: [] });
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchResultsRef = useRef(null);

	const handleSearch = async () => {
		setIsLoading(true);
		try {
			const response = await api.get("/api/search/", { params: { query } });
			setResults(response.data);
			setShowResults(true);
		} catch (error) {
			console.error("Error fetching search results:", error);
			alert("Failed to fetch results");
		}
		setIsLoading(false);
	};

	const handleClickOutside = (event) => {
		if (
			searchResultsRef.current &&
			!searchResultsRef.current.contains(event.target)
		) {
			setShowResults(false);
		}
	};

	useEffect(() => {
		if (showResults) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showResults]);

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
			{isLoading && LoadingIndicator()}
			{showResults && (
				<div className="searchResults" ref={searchResultsRef}>
					{results.profiles.map((profile) => (
						<div key={profile.id} className="profileResult resultItem">
							<img
								src={profile.profile_picture}
								alt={profile.username}
								className="resultImage"
							/>
							<a href={`/profile/${profile.username}`}>
								<div className="resultInfo">
									<h4>{profile.username}</h4>
									<p>{profile.bio}</p>
								</div>
							</a>
						</div>
					))}
					{results.posts.map((post) => (
						<div key={post.id} className="postResult resultItem">
							<img src={post.image} alt="Post image" className="resultImage" />
							<a href={`/posts/${post.id}`}>
								<div className="resultInfo">
									<h4>{post.caption}</h4>
									<p>By {post.user.username}</p>
								</div>
							</a>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Search;
