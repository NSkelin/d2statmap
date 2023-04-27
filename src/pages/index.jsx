import React, {useState} from "react";
import {NavBar, StatMap} from "../components";
import styles from "../app.module.css";
import dummyData from "../../dummyData.json";
import {useRouter} from "next/router";

function App() {
	const router = useRouter();
	const [refreshing, setRefreshing] = useState(false);

	function handleRefresh() {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}

	async function handleLogout() {
		try {
			const res = await fetch("http://localhost:3000/api/logOut", {
				method: "POST",
			});
			if (res.status === 200) {
				router.push("/authenticate");
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className={styles.app}>
			<NavBar loggedIn rotate={refreshing} onLogout={handleLogout} onRefresh={handleRefresh}></NavBar>
			<div className={styles.content}>
				<StatMap armorData={dummyData} minRange={2} maxRange={32}></StatMap>
			</div>
		</div>
	);
}

export default App;
