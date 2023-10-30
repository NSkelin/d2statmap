import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import PropTypes from "prop-types";
import React, {useEffect, useRef} from "react";
/**
 * A React wrapper for nouislider that creates a range slider with two handles.
 *
 * @param {number} minRange The minimum range of the slider
 * @param {number} maxRange The maximum range of the slider
 * @param {number} minVal The starting position for the minimum handle.
 * @param {number} maxVal The starting position for the maximum handle.
 * @param {({values: number[]}) => void} onChange Handler thats called on the nouislider update event.
 */
function NoUiSlider({minRange, maxRange, minVal, maxVal, onChange}) {
	const divRef = useRef(null);

	// Bind the nouislider to a div that we can manage.
	useEffect(() => {
		const slider = noUiSlider.create(divRef.current, {
			start: [minVal, maxVal],
			connect: true,
			step: 1,
			range: {
				min: minRange,
				max: maxRange,
			},
		});
		slider.on("update", onChange);

		// Cleanup / destroy the uislider.
		return () => {
			if (divRef.current != null) divRef.current.noUiSlider.destroy();
		};
	}, [minRange, maxRange]);

	// Render.
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
	onChange: PropTypes.func,
};

export default NoUiSlider;
