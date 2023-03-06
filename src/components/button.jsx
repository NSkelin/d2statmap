import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/button.module.css";

function Button({text, Icon, count, stretch, onClick}) {
	const flexVal = stretch ? 1 : 0;

	return (
		<button onClick={onClick} className={styles.button} style={{flex: flexVal}}>
			{text}
			<div className={styles.armorCount}>
				<Icon className={styles.icon}></Icon>
				<div>x{count}</div>
			</div>
		</button>
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
	onClick: PropTypes.func,
};

export default Button;
