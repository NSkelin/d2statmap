import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/menu.module.css";

function Menu({title, titleBG, bodyBG, children}) {
	return (
		<div className={styles.content} style={{backgroundColor: titleBG}}>
			<h1 className={styles.header}>{title}</h1>
			<div className={styles.body} style={{backgroundColor: bodyBG}}>
				{children}
			</div>
		</div>
	);
}

Menu.defaultProps = {
	title: "Title",
	titleBG: "#000",
	bodyBG: "#FFF",
};

Menu.propTypes = {
	title: PropTypes.string,
	titleBG: PropTypes.string,
	bodyBG: PropTypes.string,
};

export default Menu;
