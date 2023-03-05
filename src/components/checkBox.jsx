import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/checkBox.module.css";

function CheckBox({title}) {
	return (
		<div className={styles.container}>
			<input className={styles.checkBox} type="checkbox"></input>
			{title}
		</div>
	);
}

CheckBox.defaultProps = {
	title: "Title",
	titleBG: "#000",
	bodyBG: "#FFF",
};

CheckBox.propTypes = {
	title: PropTypes.string,
	titleBG: PropTypes.string,
	bodyBG: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

export default CheckBox;
