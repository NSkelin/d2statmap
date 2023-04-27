import React from "react";
import PropTypes from "prop-types";
import styles from "./Menu.module.css";

function Menu({title, titleBG, bodyBG, children}) {
	return (
		<section className={styles.content} style={{backgroundColor: titleBG}}>
			<h1 className={styles.header}>{title}</h1>
			<div className={styles.body} style={{backgroundColor: bodyBG}}>
				{children}
			</div>
		</section>
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
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

export default Menu;
