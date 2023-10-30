import PropTypes from "prop-types";
import React, {useState} from "react";
import DisciplineIcon from "../../assets/discipline.svg";
import IntellectIcon from "../../assets/intellect.svg";
import MobilityIcon from "../../assets/mobility.svg";
import RecoveryIcon from "../../assets/recovery.svg";
import ResilienceIcon from "../../assets/resilience.svg";
import StrengthIcon from "../../assets/strength.svg";
import useCheckbox from "../../customHooks/useCheckbox";
import NoUiSlider from "../NoUiSlider";
import StatBar from "../StatBar";
import styles from "./HeatMap.module.css";

/**
 * Renders a heatmap bar for each stat type with a range slider to control the heatmaps range shown.
 *
 * @param {object} slider The min and max range for the nouislider. Handles are set at the ranges min / max.
 * @param {number[][]} armor The heatmap values for each stat used to render the heatmap intensity / color.
 */
function HeatMap({slider, armor}) {
	const [sliderValues, setSliderValues] = useState({min: slider.minRange, max: slider.maxRange});
	const {checked: smoothing} = useCheckbox("smoothing");

	/**
	 * Update the sliders min / max handle values into state.
	 *
	 * @param {object} values The position / value of the sliders min / max handles.
	 */
	function handleSliderChange(values) {
		setSliderValues({min: Number(values[0]), max: Number(values[1])});
	}

	// Iterate the armor data to create each stats heatmap bar.
	const statBars = armor.map((values, index) => (
		<StatBar
			key={index}
			values={values}
			smoothing={smoothing}
			minRange={sliderValues.min}
			maxRange={sliderValues.max}
			baseHSLCode={"hsl(0, 0%, 35%)"}
		></StatBar>
	));

	return (
		<div className={styles.statDisplay}>
			<div className={styles.statIdentifiers}>
				<div className={styles.statNames}>
					<span className={styles.statName}>Mobility</span>
					<span className={styles.statName}>Resilience</span>
					<span className={styles.statName}>Recovery</span>
					<span className={styles.statName}>Discipline</span>
					<span className={styles.statName}>Intellect</span>
					<span className={styles.statName}>Strength</span>
				</div>
				<div className={styles.statIcons}>
					<MobilityIcon className={styles.statIcon}></MobilityIcon>
					<ResilienceIcon className={styles.statIcon}></ResilienceIcon>
					<RecoveryIcon className={styles.statIcon}></RecoveryIcon>
					<DisciplineIcon className={styles.statIcon}></DisciplineIcon>
					<IntellectIcon className={styles.statIcon}></IntellectIcon>
					<StrengthIcon className={styles.statIcon}></StrengthIcon>
				</div>
			</div>
			<div className={styles.statBars}>
				{statBars}
				<NoUiSlider
					minRange={slider.minRange}
					maxRange={slider.maxRange}
					minVal={sliderValues.min}
					maxVal={sliderValues.max}
					onChange={handleSliderChange}
				></NoUiSlider>
			</div>
		</div>
	);
}

HeatMap.defaultProps = {
	minRange: 0,
	maxRaminRange: 100,
	assumeMasterwork: false,
};

HeatMap.propTypes = {
	slider: PropTypes.shape({
		minRange: PropTypes.number,
		maxRange: PropTypes.number,
	}),
	smoothing: PropTypes.bool,
	sliderValues: PropTypes.shape({
		min: PropTypes.number,
		max: PropTypes.number,
	}),
	armor: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
	assumeMasterwork: PropTypes.bool,
};

export default HeatMap;
