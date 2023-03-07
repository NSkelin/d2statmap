import React, {useState} from "react";
import PropTypes from "prop-types";
import Button from "../button";

function SelectOneButton({buttons}) {
	const [selectedIndex, setSelectedIndex] = useState(null);

	function handleClick(id) {
		setSelectedIndex(id);
	}

	return (
		<>
			{buttons.map((button) => (
				<Button
					key={button.id}
					stretch={button.stretch}
					text={button.text}
					Icon={button.icon}
					count={button.count}
					onClick={() => handleClick(button.id)}
					id={"SelectOneButton" + button.id}
					selected={selectedIndex === button.id}
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
