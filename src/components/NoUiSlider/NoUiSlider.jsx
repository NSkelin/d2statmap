import React, {useRef, useEffect} from "react";
import PropTypes from "prop-types";
import "nouislider/dist/nouislider.css";
import "./NoUiSlider.css";
import noUiSlider from "nouislider";

function NoUiSlider({minRange, maxRange, minVal, maxVal}) {
	const divRef = useRef(null);

	useEffect(() => {
		noUiSlider.create(divRef.current, {
			start: [minRange, maxRange],
			connect: true,
			step: 1,
			range: {
				min: minRange,
				max: maxRange,
			},
		});
		return () => {
			divRef.current.noUiSlider.destroy();
		};
	}, [minRange, maxRange]);

	return (
		<div className="noUi-container">
			{minVal}
			<div ref={divRef}></div>
			{maxVal}
		</div>
	);
}

NoUiSlider.defaultProps = {
	minRange: 0,
	maxRaminRange: 100,
};

NoUiSlider.propTypes = {
	minRange: PropTypes.number,
	maxRange: PropTypes.number,
	minVal: PropTypes.number,
	maxVal: PropTypes.number,
};

export default NoUiSlider;
