import React from "react";
import PropTypes from "prop-types";
import styles from "./CheckBox.module.css";
import useCheckbox from "../../customHooks/useCheckbox";
import {useSWRConfig} from "swr";

function CheckBox({uniqueID, title, name}) {
	const {checked} = useCheckbox(uniqueID);
	const {mutate} = useSWRConfig();

	function handleChange(e) {
		localStorage.setItem(`checkbox/${uniqueID}`, e.target.checked);
		mutate(`checkbox/${uniqueID}`, e.target.checked);
	}

	return (
		<>
			<label className={styles.container}>
				<input id={uniqueID} name={name} onChange={handleChange} className={styles.checkBox} checked={checked} type="checkbox"></input>
				{title}
			</label>
		</>
	);
}

CheckBox.defaultProps = {
	title: "Title",
};

CheckBox.propTypes = {
	uniqueID: PropTypes.string,
	title: PropTypes.string,
	name: PropTypes.string,
};

export default CheckBox;
