/**
 * This is the main page of the app.
 * The user can see their armor data heat map and access options to configure it.
 */
import Head from "next/head";
import {useRouter} from "next/router";
import React, {useContext} from "react";
import {TailSpin} from "react-loader-spinner";
import {NavBar, StatMap} from "../components";
import useArmor from "../customHooks/useArmor";
import {DemoContext} from "../demoContext";
import styles from "../index.module.css";

function App() {
	// If the user is on the demo page, this context is true and used to retrieve dummy data for demo purposes.
	const demo = useContext(DemoContext);
	const router = useRouter();

	// Gets the users Destiny2 armor data.
	const {isLoading, error} = useArmor(demo);

	/**
	 * Calls the API to handle any logout cleanup and navigates to the authentication page.
	 */
	async function handleLogout() {
		try {
			const res = await fetch("/api/logOut", {
				method: "POST",
			});
			if (res.status === 200) {
				router.push("/authenticate");
			}
		} catch (error) {
			console.log(error);
		}
	}

	// If the app fails to get a users armor data, the page displays a generic error.
	if (error) return <p>Failed to get your armor stats. Please try again later.</p>;

	// Holds the main content of the page. If the armor data is still being retrieved a loading spinner is temporarily put in its place.
	let appContent;
	if (isLoading)
		appContent = (
			<div className={styles.loading}>
				<TailSpin height="150" width="150" color="#a0c0bc" ariaLabel="tail-spin-loading" radius="1" /> <h2>Retrieving armor...</h2>
			</div>
		);
	else appContent = <StatMap minRange={2} maxRange={32}></StatMap>;

	// Return the page content.
	return (
		<>
			<Head>
				<title>D2StatMap</title>
				<meta name="author" content="Nick" />
				<meta name="description" content="A tool to visualize a destiny 2 players owned armor stats as a heatmap" />
				<meta name="keywords" content="Destiny 2, D2, Armor, Stat map" />
			</Head>
			<div className={styles.app}>
				<NavBar loggedIn onLogout={handleLogout}></NavBar>
				<div className={styles.content}>{appContent}</div>
				<a href="https://github.com/NSkelin/d2statmap/issues" rel="noopener noreferrer" target="_blank" className={styles.report}>
					Report an issue
				</a>
			</div>
		</>
	);
}

export default App;
