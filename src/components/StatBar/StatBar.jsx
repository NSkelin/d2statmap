import React from "react";
import PropTypes from "prop-types";
import styles from "./StatBar.module.css";

// creates a css gradient code
function createHeatMap(values, range, smoothing, baseHSLCode) {
	let heatMapGradientCSS = "linear-gradient(to right, ";
	let gradientGrowthPercent = 100 / (range + 1); // +1 because starting at 2, 2 -> 31 = 30
	let gradientLength = gradientGrowthPercent;

	for (const value of values) {
		let hslCode = baseHSLCode;

		if (value > 0) {
			const h = (1 - value) * 240;
			hslCode = `hsl(${h}, 100%, 50%)`;
		}

		if (!smoothing) heatMapGradientCSS += `${hslCode} 0%, `;
		heatMapGradientCSS += `${hslCode} ${gradientLength}%,`;

		gradientLength += gradientGrowthPercent;
	}

	heatMapGradientCSS += "#585858 0px, #585858 100%)";
	return heatMapGradientCSS;
}

function StatBar({values, smoothing, minRange, maxRange, baseHSLCode}) {
	const valuesInRange = values.slice(minRange - 2, maxRange - 1); // +1 because starting at 2, 2 -> 31 = 30
	const gradient = createHeatMap(valuesInRange, maxRange - minRange, smoothing, baseHSLCode);

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
