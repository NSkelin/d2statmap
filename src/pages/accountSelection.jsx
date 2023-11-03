/**
 * This page lets the user select which of their accounts we should use later in the app.
 *
 * A user can have a Destiny2 account with multiple services (Xbox, Steam, Playstation, etc.).
 * So after a user authorizes this app, we need to know which of their accounts to use.
 */
import React from "react";
import {TailSpin} from "react-loader-spinner";
import styles from "../accountSelection.module.css";
import {Button, NavBar} from "../components";
import useProfile from "../customHooks/useProfile";

/**
 * The different membership enums used by Bungie and the service they represent.
 * See {@link https://bungie-net.github.io/multi/schema_BungieMembershipType.html#schema_BungieMembershipType here} for more info.
 */
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
	// Get a list of the services the user has an account with.
	const {profiles, isLoading, error} = useProfile();

	/**
	 * Handles the user selecting a Destiny2 account to use.
	 *
	 * @param {number} membershipType The enum that refrences the membership the user selected.
	 */
	async function selectProfile(membershipType) {
		// Call the API to save the selected profile.
		const res = await fetch("/api/saveSelectedProfile", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: membershipType,
		});
		if (res.ok) {
			// Navigate to the main page.
			window.location.href = "/";
		}
	}

	// Creates the pages body content.
	const bodyContent = () => {
		if (error) {
			// Failed to load profiles so leave a generic error message
			return <p>Error loading profiles. Please try again later.</p>;
		} else if (isLoading) {
			// Still loading profiles, display a loading spinner until done.
			return (
				<div className={styles.loading}>
					<TailSpin height="150" width="150" color="#a0c0bc" ariaLabel="tail-spin-loading" radius="1" /> <h2>Retrieving profiles...</h2>
				</div>
			);
		} else {
			// Profiles loaded.

			// Create a button for each Destiny2 account the user has so they can choose which to use.
			const d2Profiles = profiles.destinyMemberships.map(({membershipType}) => {
				return (
					<Button key={membershipType} onClick={() => selectProfile(membershipType)}>
						{membershipTypes[membershipType]}
					</Button>
				);
			});

			// Return the pages main content.
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
