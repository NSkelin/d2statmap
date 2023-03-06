import React, {useState} from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button({text, Icon, count, stretch, onClick}) {
	const flexVal = stretch ? 1 : 0;
	const [toggle, setToggle] = useState(false);

	const style = toggle ? styles.selectedButton : styles.button;

	function handleClick() {
		setToggle(toggle ? false : true);
		onClick();
	}

	return (
		<button onClick={handleClick} className={style} style={{flex: flexVal}}>
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
