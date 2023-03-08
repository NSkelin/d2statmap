import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button({text, Icon, count, stretch, onClick, selected, showText}) {
	const flexVal = stretch ? 1 : 0;
	const style = selected ? styles.selectedButton : styles.button;

	return (
		<button onClick={onClick} className={style} style={{flex: flexVal}}>
			{showText ? text : null}
			<div className={styles.armorCount}>
				<Icon className={styles.icon}></Icon>
				<div>x{count}</div>
			</div>
		</button>
	);
}

Button.defaultProps = {
	stretch: false,
	selected: false,
};

Button.propTypes = {
	text: PropTypes.string,
	Icon: PropTypes.elementType,
	count: PropTypes.number,
	stretch: PropTypes.bool,
	onClick: PropTypes.func,
	selected: PropTypes.bool,
	showText: PropTypes.bool,
};

export default Button;
