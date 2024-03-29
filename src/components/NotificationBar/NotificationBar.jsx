import Link from "next/link";
import React, {useState} from "react";
import Button from "../Button";
import styles from "./NotificationBar.module.css";

/**
 * Renders a close-able bar at the top of the screen to alert users the page they are on is for demo purposes only, and next steps to follow.
 */
function NotificationBar() {
	const [showNotif, setShowNotif] = useState(true);

	if (showNotif)
		return (
			<div className={styles.noticeBar}>
				<div className={styles.message}>
					<span>This is a demo with placeholder data meant to show off the site functionality without needing a bungie account.</span>

					<Link className={styles.link} href="/authenticate">
						<Button>Return to Login</Button>
					</Link>
				</div>
				<button className={styles.button} onClick={() => setShowNotif(false)}>
					X
				</button>
			</div>
		);
	else return <></>;
}

export default NotificationBar;
