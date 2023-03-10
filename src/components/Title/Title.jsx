import React from "react";
import PropTypes from "prop-types";
import styles from "./Title.module.css";

function Title({title, children}) {
	return (
		<div>
			<h2>{title}</h2>
			<div>
				<div className={styles.line}></div>
				<div className={styles.body}>{children}</div>
			</div>
		</div>
	);
}

Title.propTypes = {
	title: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

export default Title;
