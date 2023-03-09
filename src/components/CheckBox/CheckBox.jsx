import React from "react";
import PropTypes from "prop-types";
import styles from "./CheckBox.module.css";

function CheckBox({title, name, onChange}) {
	return (
		<>
			<label className={styles.container}>
				<input name={name} onChange={onChange} className={styles.checkBox} type="checkbox"></input>
				{title}
			</label>
		</>
	);
}

CheckBox.defaultProps = {
	title: "Title",
};

CheckBox.propTypes = {
	title: PropTypes.string,
	name: PropTypes.string,
	onChange: PropTypes.func,
};

export default CheckBox;
