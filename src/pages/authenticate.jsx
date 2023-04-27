import React from "react";
import {NavBar, Button} from "../components";
import styles from "../authenticate.module.css";

function Authenticate() {
	return (
		<div className={styles.authenticate}>
			<NavBar></NavBar>
			<div className={styles.content}>
				<form method="post" action="/api/getAuthURL">
					<Button size={10}>Authenticate with bungie</Button>
				</form>
			</div>
		</div>
	);
}

export default Authenticate;
