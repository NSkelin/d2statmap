import React from "react";
import App from "./index";
import styles from "../demo.module.css";
import Link from "next/link";

function Demo() {
	return (
		<>
			<App demo={true} />
			<div className={styles.wrapper}>
				<span className={styles.warning}>
					<span style={{color: "red"}}>Warning!</span> This is an example page. Click &nbsp;
					<Link className={styles.link} href="/authenticate">
						Here
					</Link>
					&nbsp; To go back the main site.
				</span>
			</div>
		</>
	);
}

export default Demo;
