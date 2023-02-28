import React from "react";
import NavBar from "./components/navBar.jsx";
import "./style.css";

function App() {
	return (
		<div className="App">
			<NavBar></NavBar>
			<form action="https://localhost:8080/login" method="GET" id="userSearch">
				<button id="login">Login</button>
			</form>

			<div id="classFilter">
				<button id="hunter">Hunter</button>
				<button id="warlock">Warlock</button>
				<button id="titan">Titan</button>
			</div>

			<div id="armorTypeFilter">
				<button id="allArmor">All</button>
				<button id="helmet">Helmet</button>
				<button id="arms">Arms</button>
				<button id="chest">Chest</button>
				<button id="legs">Legs</button>
			</div>

			<div id="attributes">
				<div id="attribute_names">
					<div className="attribute_name">Mobility</div>
					<div className="attribute_name">Resilience</div>
					<div className="attribute_name">Recovery</div>
					<div className="attribute_name">Discipline</div>
					<div className="attribute_name">Intellect</div>
					<div className="attribute_name">Strength</div>
				</div>

				<div id="stat_bars">
					<div id="mobilityBar" className="stat_bar"></div>
					<div id="resilienceBar" className="stat_bar"></div>
					<div id="recoveryBar" className="stat_bar"></div>
					<div id="disciplineBar" className="stat_bar"></div>
					<div id="intellectBar" className="stat_bar"></div>
					<div id="strengthBar" className="stat_bar"></div>
				</div>

				<div id="armor_counts">
					<div id="mobilityCount" className="armor_count">
						3
					</div>
					<div id="resilienceCount" className="armor_count">
						3
					</div>
					<div id="recoveryCount" className="armor_count">
						3
					</div>
					<div id="disciplineCount" className="armor_count">
						3
					</div>
					<div id="intellectCount" className="armor_count">
						3
					</div>
					<div id="strengthCount" className="armor_count">
						3
					</div>
				</div>
			</div>

			<div id="options">
				<h1>Options</h1>
				<label>
					<input type="checkbox" id="heatBarSmoothing" name="heatBarSmoothing"></input>
					Heatbar smoothing
				</label>
				Min stat
				<input type="range" id="statSliderMin" min="0" max="40" value="2"></input>
				Max stat
				<input type="range" id="statSliderMax" min="0" max="40" value="40"></input>
			</div>
		</div>
	);
}

export default App;
