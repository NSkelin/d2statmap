import React from "react";
import PropTypes from "prop-types";
import styles from "./HeatMap.module.css";
import NoUiSlider from "../NoUiSlider";
import {ReactComponent as MobilityIcon} from "../../assets/mobility.svg";
import {ReactComponent as ResilienceIcon} from "../../assets/resilience.svg";
import {ReactComponent as RecoveryIcon} from "../../assets/recovery.svg";
import {ReactComponent as DisciplineIcon} from "../../assets/discipline.svg";
import {ReactComponent as IntellectIcon} from "../../assets/intellect.svg";
import {ReactComponent as StrengthIcon} from "../../assets/strength.svg";

function HeatMap({slider}) {
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
				<div className={styles.statBar}></div>
				<div className={styles.statBar}></div>
				<div className={styles.statBar}></div>
				<div className={styles.statBar}></div>
				<div className={styles.statBar}></div>
				<div className={styles.statBar}></div>
				<NoUiSlider
					minRange={slider.minRange}
					maxRange={slider.maxRange}
					minVal={slider.minVal}
					maxVal={slider.maxVal}
					onChange={slider.onChange}
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
};

export default HeatMap;
