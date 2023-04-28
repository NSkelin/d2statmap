import React, {useState} from "react";
import {NavBar, StatMap} from "../components";
import styles from "../app.module.css";
import dummyData from "../../dummyData.json";
import Head from "next/head";
import {TailSpin} from "react-loader-spinner";

function App() {
	const [refreshing, setRefreshing] = useState(false);
	const [armorData, setArmorData] = useState(null);

	function handleRefresh() {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}

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

	if (armorData === null)
		appContent = (
			<div className={styles.loading}>
				<TailSpin height="150" width="150" color="#a0c0bc" ariaLabel="tail-spin-loading" radius="1" /> <h2>Retrieving armor...</h2>
			</div>
		);
	else appContent = <StatMap armorData={armorData} minRange={2} maxRange={32}></StatMap>;

	return (
		<>
			<Head>
				<title>D2StatMap</title>
				<meta name="author" content="Nick" />
				<meta name="description" content="A tool to visualize a destiny 2 players owned armor stats as a heatmap" />
				<meta name="keywords" content="Destiny 2, D2, Armor, Stat map" />
			</Head>
			<div className={styles.app}>
				<NavBar loggedIn rotate={refreshing} onLogout={handleLogout} onRefresh={handleRefresh}></NavBar>
				<div className={styles.content}>{appContent}</div>
			</div>
		</>
	);
}

export default App;
