import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
	background-color: #525252;
	border: solid 1px #848484;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: ${(props) => (props.size ? props.size * 5 + "px " + props.size * 10 + "px" : "10px")};
	color: white;
	align-items: center;
	flex: ${(props) => (props.stretch ? 1 : 0)};
	:hover,
	:active {
		background-color: #797979;
		cursor: pointer;
	}
	:active {
		background-color: #666666;
	}
	&.selected {
		background-color: #747474;
		border: solid 1px #b8b8b8;
	}
	&.selected:hover {
		background-color: #686868;
	}
	&.selected:active {
		background-color: #5a5a5a;
	}
`;

/**
 * A custom button component that can be selected like a checkbox and allows
 * some style customization.
 *
 * @param {boolean} stretch Tells the button to stretch to fill its container width.
 * @param {boolean} selected Changes the buttons background to visually state its selected.
 * @param {number} size Allows changing the buttons size.
 * @param children Any react child elements to render inside the button.
 * @param name The button name attribute.
 * @param onClick The button onClick attribute.
 */
function Button({name, stretch, onClick, selected, children, size}) {
	const style = selected ? "selected" : null;

	return (
		<StyledButton name={name} onClick={onClick} className={style} stretch={stretch} size={size}>
			{children}
		</StyledButton>
	);
}

Button.defaultProps = {
	stretch: false,
	selected: false,
};

Button.propTypes = {
	stretch: PropTypes.bool,
	onClick: PropTypes.func,
	selected: PropTypes.bool,
	name: PropTypes.string,
	children: PropTypes.any,
	size: PropTypes.number,
};

export default Button;
