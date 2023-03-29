import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";
import styled from "styled-components";

const StyledButton = styled.button`
	background-color: #525252;
	border: solid 1px #848484;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 10px;
	color: white;
	align-items: center;
	flex: ${(props) => (props.stretch ? 1 : 0)};
	:hover,
	:active {
		background-color: #747474;
		border: solid 1px #b8b8b8;
		cursor: pointer;
	}
	:active {
		background-color: #666666;
	}
	&.selected {
		background-color: #747474;
		border: solid 1px #b8b8b8;
	}
`;

function Button({name, text, Icon, count, stretch, onClick, selected, showText}) {
	const style = selected ? "selected" : null;

	return (
		<StyledButton name={name} onClick={onClick} className={style} stretch={stretch}>
			{showText ? text : null}
			<div className={styles.armorCount}>
				<Icon className={styles.icon}></Icon>
				<div>x{count}</div>
			</div>
		</StyledButton>
	);
}

Button.defaultProps = {
	showText: true,
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
	name: PropTypes.string,
};

export default Button;
