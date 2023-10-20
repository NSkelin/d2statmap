import PropTypes from "prop-types";
import React, {useContext} from "react";
import styled, {css, keyframes} from "styled-components";
import {useSWRConfig} from "swr";
import NavIcon from "../../assets/patrol.svg";
import RefreshIcon from "../../assets/refresh.svg";
import useArmor from "../../customHooks/useArmor";
import {DemoContext} from "../../demoContext";
import Button from "../Button";
import styles from "./NavBar.module.css";

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

function NavBar({loggedIn, onLogout}) {
	const demo = useContext(DemoContext);
	const {mutate} = useSWRConfig();
	const {isValidating} = useArmor(loggedIn ? demo : null); // Dont fetch if logged out, leads to infinite loop.

	function handleRefresh() {
		if (!isValidating) mutate("/api/getArmor");
	}

	const right = () => {
		if (loggedIn)
			return (
				<>
					<Button onClick={onLogout}>Logout</Button>
					<RefreshButton onClick={handleRefresh} shouldRotate={isValidating}>
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
	onLogout: PropTypes.func,
};

export default NavBar;
