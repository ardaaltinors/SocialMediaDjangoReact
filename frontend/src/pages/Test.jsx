import { useState, useEffect, useRef } from "react";
import api from "../api";
import Search from "../components/Navigation/Search/Search";

function Test() {
	return (
		<div>
			<h1>Test Page</h1>
			<Search />
		</div>
	);
}

export default Test;
