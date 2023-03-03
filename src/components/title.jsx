import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/title.module.css";

function Title({title, children}) {
	return (
		<>
			<h2>{title}</h2>
			<div>
				<div className={styles.line}></div>
				{children}
			</div>
		</>
	);
}

Title.propTypes = {
	title: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

export default Title;
