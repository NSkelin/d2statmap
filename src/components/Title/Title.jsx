import PropTypes from "prop-types";
import React from "react";
import styles from "./Title.module.css";

/**
 * A custom section of content with a title and divider line wrapped around any child elements.
 *
 * @param {string} title A title for the section.
 * @param children Any react child elements to render inside the section body.
 */
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
