/**
 * This page is the same as the main page but with the demo context set to true (defaults to false).
 *
 * The purpose of this page is to allow other users to view how the site works without needing
 * a Bungie / Destiny2 account, mainly for my portfolio.
 *
 * All it does is load the app normally but with the demo context set to true.
 */
import React from "react";
import NotificationBar from "../components/NotificationBar";
import {DemoContext} from "../demoContext";
import App from "./index";

// Load the main app but with the demo context set to true.
function Demo() {
	return (
		<>
			<DemoContext.Provider value={true}>
				<NotificationBar />
				<App />
			</DemoContext.Provider>
		</>
	);
}

export default Demo;
