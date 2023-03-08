import React, {useState} from "react";
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
			id: PropTypes.number,
			stretch: PropTypes.bool,
			text: PropTypes.string,
			icon: PropTypes.elementType,
			count: PropTypes.number,
		})
	),
};

export default SelectOneButton;
