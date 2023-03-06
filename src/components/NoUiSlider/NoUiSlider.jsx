import React, {useRef, useEffect} from "react";
import PropTypes from "prop-types";
import "nouislider/dist/nouislider.css";
import "./NoUiSlider.css";
import noUiSlider from "nouislider";

function NoUiSlider({min, max}) {
	const divRef = useRef(null);

	useEffect(() => {
		noUiSlider.create(divRef.current, {
			start: [min, max],
			connect: true,
			step: 1,
			range: {
				min: min,
				max: max,
			},
		});
		return () => {
			divRef.current.noUiSlider.destroy();
		};
	}, [min, max]);

	return (
		<div className="noUi-container">
			{min}
			<div ref={divRef}></div>
			{max}
		</div>
	);
}

NoUiSlider.defaultProps = {
	min: 0,
	max: 100,
};

NoUiSlider.propTypes = {
	min: PropTypes.number,
	max: PropTypes.number,
};

export default NoUiSlider;
