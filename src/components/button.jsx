import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/button.module.css";

function Button({text, Icon, count, stretch}) {
	const flexVal = stretch ? 1 : 0;
	return (
		<div className={styles.button} style={{flex: flexVal}}>
			{text}
			<div className={styles.armorCount}>
				<Icon className={styles.icon}></Icon>
				<div>x{count}</div>
			</div>
		</div>
	);
}

Button.defaultProps = {
	stretch: false,
};

Button.propTypes = {
	text: PropTypes.string,
	Icon: PropTypes.elementType,
	count: PropTypes.number,
	stretch: PropTypes.bool,
};

export default Button;
