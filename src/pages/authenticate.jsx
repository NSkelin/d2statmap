/**
 * This page handles authorizing our app.
 *
 * A user must first authorize our app with Bungie before we can read certain data from their account.
 * The page consists of a button to redirect users to Bungies authorization page.
 */
import React from "react";
import styles from "../authenticate.module.css";
import {Button, NavBar} from "../components";

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
