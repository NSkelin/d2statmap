import PropTypes from "prop-types";
import React from "react";
import {useSWRConfig} from "swr";
import useCheckbox from "../../customHooks/useCheckbox";
import styles from "./CheckBox.module.css";

/**
 * A custom checkbox component that saves its state into local storage so it can be remembered on reload.
 *
 * @param {string} uniqueID The unique ID used to reference the value stored in local storage.
 * @param {string} title The title for the checkbox that renders next to it.
 * @param name The button name attribute.
 */
function CheckBox({uniqueID, title, name}) {
	const {checked} = useCheckbox(uniqueID);
	const {mutate} = useSWRConfig();

	/**
	 * Saves the checkbox state into local storage.
	 */
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
