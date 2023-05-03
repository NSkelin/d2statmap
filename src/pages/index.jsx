import React from "react";
import {NavBar, StatMap} from "../components";
import styles from "../app.module.css";
import Head from "next/head";
import {TailSpin} from "react-loader-spinner";
import {useRouter} from "next/router";
import useArmor from "../customHooks/useArmor";
import PropTypes from "prop-types";

function App({demo}) {
	const router = useRouter();

	const {isLoading, error} = useArmor(demo);

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

	let appContent;

	if (error) return <p>Error.</p>;

	if (isLoading)
		appContent = (
			<div className={styles.loading}>
				<TailSpin height="150" width="150" color="#a0c0bc" ariaLabel="tail-spin-loading" radius="1" /> <h2>Retrieving armor...</h2>
			</div>
		);
	else appContent = <StatMap minRange={2} maxRange={32} demo={demo}></StatMap>;

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

App.defaultProps = {
	demo: false,
};

App.propTypes = {
	demo: PropTypes.bool,
};

export default App;
