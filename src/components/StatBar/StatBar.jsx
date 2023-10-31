import PropTypes from "prop-types";
import React from "react";
import styles from "./StatBar.module.css";

/**
 * Creates the code for a CSS gradient that looks like a heat map in the shape of a horizontal bar.
 *
 * The bar will be evenly split vertically into a number of sections. These sections will then be given a color
 * based on the corresponding intensity of the matching value. These colors are from most intense to least intense:
 * Red -> Orange -> Yellow -> Green -> Teal -> Blue.
 *
 * The section and intensity value match based on index. So the value at index 0 is the intensity for the first notch.
 *
 * If there are more notches than values, the extra notches will use the baseHSLCode as its color. This is useful for
 * making the bars seem like they have a background that they fill.
 *
 * @param {number[]} intensityValues The numbers that define the intensity of each notch, with 1 being most intense and 0 meaning no intensity.
 * @param {number} notches The number of sections the heat map bar will be evenly split into.
 * @param {boolean} smoothing Determines if the gradient has smooth transitions between notches.
 * @param {string} baseHSLCode The color for notches with an intensity of 0 or no intensity.
 *
 * @returns {string} The CSS gradient code.
 */
function createHeatMapGradient(intensityValues, notches, smoothing, baseHSLCode) {
	const gradientGrowthPercent = 100 / notches;

	// Start of gradient code.
	let heatMapGradientCSS = "linear-gradient(to right, ";
	let gradientLength = gradientGrowthPercent;

	// Create gradient code.
	for (const value of intensityValues) {
		let hslCode = baseHSLCode;

		if (value > 0) {
			const h = (1 - value) * 240;
			hslCode = `hsl(${h}, 100%, 50%)`;
		}

		if (!smoothing) heatMapGradientCSS += `${hslCode} 0%, `;

		heatMapGradientCSS += `${hslCode} ${gradientLength}%,`;

		// Increase gradient length by growth percent.
		gradientLength += gradientGrowthPercent;
	}

	// End of gradient code.
	heatMapGradientCSS += "#585858 0px, #585858 100%)";
	return heatMapGradientCSS;
}

/**
 * Renders a heatmap in the shape of a bar.
 *
 * @param {*} values The numbers that define the intensity of each section of the heat map, with 1 being most intense and 0 meaning no intensity.
 * @param {boolean} smoothing Determines if the heatmap gradient has smooth transitions between sections.
 * @param {number} minRange The minimum range of the bar.
 * @param {number} maxRange The maximum range of the bar.
 * @param {*} baseHSLCode The color for values with an intensity of 0. Also used to fill in the remaining space after all values are added.
 */
function StatBar({values, smoothing, minRange, maxRange, baseHSLCode}) {
	// Add +1 because the gradient starts at the min value. So the length of the range 0 -> 28 is 29 not 28.
	const rangeLength = maxRange - minRange + 1;

	// Ensure the values array length stays in the heat maps range.
	const valuesInRange = values.slice(minRange - 2, maxRange - 1);
	const gradient = createHeatMapGradient(valuesInRange, rangeLength, smoothing, baseHSLCode);

	return (
		<>
			<div className={styles.statBar} style={{backgroundImage: gradient}}></div>
		</>
	);
}

StatBar.defaultProps = {
	smoothing: false,
};

StatBar.propTypes = {
	values: PropTypes.arrayOf(PropTypes.number),
	smoothing: PropTypes.bool,
	minRange: PropTypes.number,
	maxRange: PropTypes.number,
	baseHSLCode: PropTypes.string,
};

export default StatBar;
