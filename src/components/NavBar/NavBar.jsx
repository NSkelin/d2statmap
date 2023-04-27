import React from "react";
import styles from "./NavBar.module.css";
import NavIcon from "../../assets/patrol.svg";
import RefreshIcon from "../../assets/refresh.svg";
import Button from "../Button";
import styled, {keyframes, css} from "styled-components";
import PropTypes from "prop-types";

const spinAnimation = keyframes`
	from {
        transform: scale(1) rotate(0deg);
    }
    to {
        transform: scale(1) rotate(360deg);
    }
`;

const RefreshButton = styled.button`
	padding: 0;
	border: none;
	background: none;
	height: 40px;
	width: 40px;
	animation: ${(props) =>
		props.shouldRotate
			? css`
					${spinAnimation} 2s infinite linear
			  `
			: "none"};
`;

function NavBar({loggedIn, rotate, onLogout, onRefresh}) {
	const right = () => {
		if (loggedIn)
			return (
				<>
					<Button onClick={onLogout}>Logout</Button>
					<RefreshButton onClick={onRefresh} shouldRotate={rotate}>
						<RefreshIcon className={styles.refreshIcon}></RefreshIcon>
					</RefreshButton>
				</>
			);
		else return null;
	};

	return (
		<header className={styles.navBar}>
			<div className={styles.left}>
				<NavIcon className={styles.navIcon}></NavIcon>
				<h1>
					<b>D2StatMap</b>
				</h1>
			</div>
			<nav className={styles.right}>{right()}</nav>
		</header>
	);
}

NavBar.defaultProps = {
	rotate: false,
};

NavBar.propTypes = {
	loggedIn: PropTypes.bool,
	rotate: PropTypes.bool,
	onLogout: PropTypes.func,
	onRefresh: PropTypes.func,
};

export default NavBar;
