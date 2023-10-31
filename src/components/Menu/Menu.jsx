import PropTypes from "prop-types";
import React from "react";
import styles from "./Menu.module.css";

/**
 * Renders a title-able section of content that can contain other React elements.
 *
 * @param {string} title Title for this menu.
 * @param {string} titleBG Background color for the components title.
 * @param {string} bodyBG Background color for the components body.
 * @param {*} children React child elements to display inside the component.
 */
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
