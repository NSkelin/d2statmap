import React from "react";
import NotificationBar from "../components/NotificationBar";
import {DemoContext} from "../demoContext";
import App from "./index";

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
