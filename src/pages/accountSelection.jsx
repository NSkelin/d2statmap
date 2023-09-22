import React from "react";
import {TailSpin} from "react-loader-spinner";
import styles from "../accountSelection.module.css";
import {Button, NavBar} from "../components";
import useProfile from "../customHooks/useProfile";

const membershipTypes = {
	1: "Xbox",
	2: "Playstation",
	3: "Steam",
	4: "Blizzard",
	5: "Stadia",
	6: "Epic games",
	10: "TigerDemon",
	254: "BungieNext",
};

function AccountSelection() {
	const {profiles, isLoading, error} = useProfile();

	async function selectProfile(membershipType) {
		// call api to save selection
		const res = await fetch("/api/saveSelectedProfile", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: membershipType,
		});
		if (res.ok) {
			// redirect to home page
			window.location.href = "/";
		}
	}

	const bodyContent = () => {
		if (error) {
			return <p>Error loading profiles.</p>;
		} else if (isLoading) {
			return (
				<div className={styles.loading}>
					<TailSpin height="150" width="150" color="#a0c0bc" ariaLabel="tail-spin-loading" radius="1" /> <h2>Retrieving profiles...</h2>
				</div>
			);
		} else {
			const d2Profiles = profiles.destinyMemberships.map(({membershipType}) => {
				return (
					<Button key={membershipType} onClick={() => selectProfile(membershipType)}>
						{membershipTypes[membershipType]}
					</Button>
				);
			});
			return (
				<>
					<div className={styles.title}>
						<h1>Profiles for: {profiles.uniqueName}</h1>
						<h2>Choose the profile you want to use</h2>
					</div>
					<div className={styles.profileSelection}>{d2Profiles}</div>
				</>
			);
		}
	};

	return (
		<>
			<NavBar></NavBar>
			<main className={styles.main}>{bodyContent()}</main>
		</>
	);
}

export default AccountSelection;
