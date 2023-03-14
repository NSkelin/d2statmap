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

function getStats(armors, minStat, maxStat) {
	let stats = [[], [], [], [], [], []];
	for (let armor of armors) {
		for (const [i, stat] of armor.stats.entries()) {
			if (stat > minStat && stat <= maxStat) {
				stats[i].push(stat);
			}
		}
	}
	return stats;
}

function HeatMap({slider, smoothing, armor}) {
	const [sliderValues, setSliderValues] = useState({min: 2, max: 40});

	function handleSliderChange(values) {
		setSliderValues({min: Number(values[0]), max: Number(values[1])});
	}

	const stats = getStats(armor, sliderValues.min, sliderValues.max);
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
				<StatBar values={stats[0]} pixelsPerStat={5} smoothing={smoothing}></StatBar>
				<StatBar values={stats[1]} pixelsPerStat={5} smoothing={smoothing}></StatBar>
				<StatBar values={stats[2]} pixelsPerStat={5} smoothing={smoothing}></StatBar>
				<StatBar values={stats[3]} pixelsPerStat={5} smoothing={smoothing}></StatBar>
				<StatBar values={stats[4]} pixelsPerStat={5} smoothing={smoothing}></StatBar>
				<StatBar values={stats[5]} pixelsPerStat={5} smoothing={smoothing}></StatBar>

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
};

HeatMap.propTypes = {
	slider: PropTypes.shape({
		minRange: PropTypes.number,
		maxRange: PropTypes.number,
		minVal: PropTypes.number,
		maxVal: PropTypes.number,
		onChange: PropTypes.func,
	}),
	smoothing: PropTypes.bool,
	sliderValues: PropTypes.shape({
		min: PropTypes.number,
		max: PropTypes.number,
	}),
	armor: PropTypes.arrayOf(
		PropTypes.shape({
			class: PropTypes.number,
			masterwork: PropTypes.bool,
			stats: PropTypes.arrayOf(PropTypes.number),
			// eslint-disable-next-line camelcase
			armor_type: PropTypes.number,
		})
	),
};

export default HeatMap;
