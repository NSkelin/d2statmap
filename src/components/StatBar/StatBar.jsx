import React from "react";
import PropTypes from "prop-types";
import styles from "./StatBar.module.css";

const gradients = [
	[165, 207, 255, 0.8],
	[255, 249, 165, 0.8],
	[255, 251, 30, 0.8],
	[255, 145, 0, 0.8],
	[255, 0, 0, 0.8],
];

function createHeatMapSection(rgbCode, pixelLength, smoothing) {
	let gradientSection = "";
	if (!smoothing) gradientSection += "rgba" + "(" + rgbCode + ") 0px, ";
	gradientSection += "rgba" + "(" + rgbCode + ") " + pixelLength + "px";

	return gradientSection;
}

function createHeatMap(values, smoothing) {
	let heatMapGradientCSS = "#585858 0px, #585858 100%)";

	for (const [i, pixel] of values.entries()) {
		const gradient = i < gradients.length ? gradients[i] : gradients[gradients.length - 1];
		heatMapGradientCSS = ", " + heatMapGradientCSS;
		heatMapGradientCSS = createHeatMapSection(gradient, pixel, smoothing) + heatMapGradientCSS;
	}

	heatMapGradientCSS = "linear-gradient(to right, " + heatMapGradientCSS;
	return heatMapGradientCSS;
}

function StatBar({values, pixelsPerStat, smoothing}) {
	values = values.map((value) => value * pixelsPerStat);
	values.sort((a, b) => b - a);
	const gradient = createHeatMap(values, smoothing);

	return (
		<>
			<div className={styles.statBar} style={{backgroundImage: gradient}}></div>
		</>
	);
}

StatBar.defaultProps = {
	pixelsPerStat: 10,
	smoothing: false,
};

StatBar.propTypes = {
	values: PropTypes.arrayOf(PropTypes.number),
	pixelsPerStat: PropTypes.number,
	smoothing: PropTypes.bool,
};

export default StatBar;
