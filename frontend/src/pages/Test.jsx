import { useState, useEffect } from "react";
import api from "../api";
import Notifications from "../components/Notifications";
import Search from "../components/Search";

function Test() {
	return (
		<div>
			<h1>Test Page</h1>
			<Notifications />
			<Search />
		</div>
	);
}

export default Test;
