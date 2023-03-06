import React from "react";
import styles from "./NavBar.module.css";
import {ReactComponent as NavIcon} from "../../assets/patrol.svg";

function NavBar() {
	return (
		<div className={styles.navBar}>
			<div className={styles.left}>
				<NavIcon className={styles.navIcon}></NavIcon>
				<b>D2StatMap</b>
			</div>
			<div className={styles.right}>
				<button className={styles.button}>Feedback</button>
				<button className={styles.button}>Login</button>
				<button className={styles.button}>Refresh</button>
			</div>
		</div>
	);
}

export default NavBar;
