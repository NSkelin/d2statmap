import React, {useState} from "react";
import PropTypes from "prop-types";
import styles from "./HeatMap.module.css";
import NoUiSlider from "../NoUiSlider";
import StatBar from "../StatBar";
import {ReactComponent as MobilityIcon} from "../../assets/mobility.svg";
import {ReactComponent as ResilienceIcon} from "../../assets/resilience.svg";
import {ReactComponent as RecoveryIcon} from "../../assets/recovery.svg";
import {ReactComponent as DisciplineIcon} from "../../assets/discipline.svg";
import {ReactComponent as IntellectIcon} from "../../assets/intellect.svg";
import {ReactComponent as StrengthIcon} from "../../assets/strength.svg";

function HeatMap({slider, smoothing, armor}) {
	const [sliderValues, setSliderValues] = useState({min: 2, max: 40});

	function handleSliderChange(values) {
		setSliderValues({min: Number(values[0]), max: Number(values[1])});
	}

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
				<StatBar
					values={armor[0]}
					smoothing={smoothing}
					minRange={sliderValues.min}
					maxRange={sliderValues.max}
					baseHSLCode={"hsl(0, 0%, 35%)"}
				></StatBar>
				<StatBar
					values={armor[1]}
					smoothing={smoothing}
					minRange={sliderValues.min}
					maxRange={sliderValues.max}
					baseHSLCode={"hsl(0, 0%, 35%)"}
				></StatBar>
				<StatBar
					values={armor[2]}
					smoothing={smoothing}
					minRange={sliderValues.min}
					maxRange={sliderValues.max}
					baseHSLCode={"hsl(0, 0%, 35%)"}
				></StatBar>
				<StatBar
					values={armor[3]}
					smoothing={smoothing}
					minRange={sliderValues.min}
					maxRange={sliderValues.max}
					baseHSLCode={"hsl(0, 0%, 35%)"}
				></StatBar>
				<StatBar
					values={armor[4]}
					smoothing={smoothing}
					minRange={sliderValues.min}
					maxRange={sliderValues.max}
					baseHSLCode={"hsl(0, 0%, 35%)"}
				></StatBar>
				<StatBar
					values={armor[5]}
					smoothing={smoothing}
					minRange={sliderValues.min}
					maxRange={sliderValues.max}
					baseHSLCode={"hsl(0, 0%, 35%)"}
				></StatBar>

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
