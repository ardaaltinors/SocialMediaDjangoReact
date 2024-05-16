import { useState, useEffect } from "react";
import api from "../api";
import Notifications from "../components/Notifications/Notifications";
import Search from "../components/Navigation/Search/Search";

function Test() {
	return (
		<div>
			<h1>Test Page</h1>
			<Notifications />
		</div>
	);
}

export default Test;
