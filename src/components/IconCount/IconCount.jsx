import PropTypes from "prop-types";
import React from "react";
import styles from "./IconCount.module.css";

/**
 * Renders an icon with a number beside it.
 *
 * @param {*} Icon
 * @param {number} count
 */
function IconCount({Icon, count}) {
	return (
		<div className={styles.wrapper}>
			<Icon className={styles.icon}></Icon>
			<div>x{count}</div>
		</div>
	);
}

IconCount.defaultProps = {
	count: "NA",
};

IconCount.propTypes = {
	Icon: PropTypes.elementType,
	count: PropTypes.number,
};

export default IconCount;
