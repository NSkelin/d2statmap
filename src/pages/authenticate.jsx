import React from "react";
import {NavBar, Button} from "../components";
import styles from "../authenticate.module.css";

function Authenticate() {
	async function doAuthentication() {
		try {
			const res = await fetch("http://localhost:3000/api/getAuthURL", {
				method: "GET",
			});
			let data = await res.json();
			window.location.href = data.url;
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className={styles.authenticate}>
			<NavBar></NavBar>
			<div className={styles.content}>
				<Button onClick={doAuthentication} size={10}>
					Authenticate with bungie
				</Button>
			</div>
		</div>
	);
}

export default Authenticate;
