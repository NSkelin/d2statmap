import React from "react";
import PropTypes from "prop-types";
import styles from "./IconCount.module.css";

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
