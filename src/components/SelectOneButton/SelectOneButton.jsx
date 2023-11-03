import PropTypes from "prop-types";
import React from "react";
import Button from "../Button";
import IconCount from "../IconCount";

/**
 * Renders toggleable buttons but where only one button can be active at a time.
 *
 * @param {object[]} buttons Data to create the selectable buttons out of.
 * @param {(string) => void} onSelect A callback for when a button is selected.
 * @param {string} selectedButtonText The text of the selected button, used to determine which button to highlight.
 */
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
