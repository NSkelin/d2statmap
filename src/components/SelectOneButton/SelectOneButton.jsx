import React from "react";
import PropTypes from "prop-types";
import Button from "../button";

function SelectOneButton({buttons, onSelect, selectedButtonText}) {
	return (
		<>
			{buttons.map((button, index) => (
				<Button
					key={index}
					stretch={button.stretch}
					text={button.text}
					Icon={button.icon}
					count={button.count}
					onClick={() => onSelect(button.text)}
					selected={selectedButtonText === button.text}
				></Button>
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
