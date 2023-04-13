import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";
import IconCount from "../IconCount";

function SelectOneButton({buttons, onSelect, selectedButtonText}) {
	return (
		<>
			{buttons.map((button, index) => (
				<Button key={index} stretch={button.stretch} onClick={() => onSelect(button.text)} selected={selectedButtonText === button.text}>
					{button.text}
					<IconCount Icon={button.icon} count={button.count}></IconCount>
				</Button>
			))}
		</>
	);
}

SelectOneButton.defaultProps = {};

SelectOneButton.propTypes = {
	buttons: PropTypes.arrayOf(
		PropTypes.shape({
			stretch: PropTypes.bool,
			text: PropTypes.string,
			icon: PropTypes.elementType,
			count: PropTypes.number,
		})
	),
	onSelect: PropTypes.func,
	selectedButtonText: PropTypes.string,
};

export default SelectOneButton;
