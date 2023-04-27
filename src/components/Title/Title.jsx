import React from "react";
import PropTypes from "prop-types";
import styles from "./Title.module.css";

function Title({title, children}) {
	return (
		<section>
			<h2>{title}</h2>
			<div className={styles.line}></div>
			<div className={styles.body}>{children}</div>
		</section>
	);
}

Title.propTypes = {
	title: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

export default Title;
