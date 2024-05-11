import { useState, useEffect } from "react";
import api from "../api";
import Notifications from "../components/Notifications";

function Test() {
	return (
		<div>
			<h1>Test Page</h1>
			<Notifications />
		</div>
	);
}

export default Test;
