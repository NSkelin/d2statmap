import Link from "next/link";
import React from "react";
import styles from "../demo.module.css";
import {DemoContext} from "../demoContext";
import App from "./index";

function Demo() {
	return (
		<>
			<DemoContext.Provider value={true}>
				<App />
				<div className={styles.wrapper}>
					<span className={styles.warning}>
						<span style={{color: "red"}}>Warning!</span> This is an example page. Click &nbsp;
						<Link className={styles.link} href="/authenticate">
							Here
						</Link>
						&nbsp; To go back the main site.
					</span>
				</div>
			</DemoContext.Provider>
		</>
	);
}

export default Demo;
