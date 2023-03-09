import React from "react";
import {NavBar, StatMap} from "./components";
import "./style.css";
import styles from "./app.module.css";

function App() {
	return (
		<div className={styles.app}>
			<NavBar></NavBar>
			<div className={styles.content}>
				<StatMap></StatMap>
			</div>
		</div>
	);
}

export default App;
