const gradients = [[165, 207, 255, 0.8],[255, 249, 165, 0.8],[255, 251, 30, 0.8],[255, 145, 0, 0.8],[255, 0, 0, 0.8],];
const pixelsPerStat = 5; // how many pixels each stat point is represented by on the stat bar
let heatBarSmoothing = false;
let minStat = 2;
let maxStat = 40;
let selectedClass = "titan";
const characterClass = Object.freeze({
    0: "titan",
    1: "hunter",
    2: "warlock",
    3: "unknown",
});

function createHeatMapSection(rgbCode, pixelLength) {
    let gradientSection = "";
    if (!heatBarSmoothing) gradientSection += "rgba" + "(" + rgbCode + ") 0px, ";
    gradientSection += "rgba" + "(" + rgbCode + ") " + pixelLength + "px";

    return gradientSection;
}

function createHeatMap(pixels) {
    let heatMapGradientCSS = "gray 0px, gray 200px)";

    for (const [i, pixel] of pixels.entries()) {
        const gradient = i < gradients.length ? gradients[i] : gradients[gradients.length - 1];
        heatMapGradientCSS = ", " + heatMapGradientCSS;
        heatMapGradientCSS = createHeatMapSection(gradient, pixel) + heatMapGradientCSS;
    }

    heatMapGradientCSS = "linear-gradient(to right, " + heatMapGradientCSS;
    return heatMapGradientCSS;
}

async function getArmor() {
    const res = await fetch("/armor", {method: "GET"})
    const data = await res.json();
    return data;
}

async function updateUI() {
    const data = await getArmor();
    // sort data from highest to lowest
    const statGroups = [[],[],[],[],[],[]];
    for (armor of data) {
        if (characterClass[armor.class] != selectedClass) continue;
        for (const [i, stat] of armor.stats.entries()) {
            if (stat > minStat && stat <= maxStat) {
                statGroups[i].push(stat * pixelsPerStat);
            }
        }
    }

    for (let [i, statGroup] of statGroups.entries()) {
        statGroup.sort((a, b) => b - a);

        const attributes = Object.freeze({
            0: "mobility",
            1: "resilience",
            2: "recovery",
            3: "discipline",
            4: "intellect",
            5: "strength",
        });

        // update stat bars
        document.getElementById(attributes[i]+"Bar").style.backgroundImage = createHeatMap(statGroup);

        // update armor count
        document.getElementById(attributes[i]+"Count").innerHTML = data.length;
    }
}

function toggleHeatBarSmoothing() {
    heatBarSmoothing = heatBarSmoothing ? false : true;
    updateUI();
}

function updateStatMinMax() {
    minStat = document.getElementById("statSliderMin").value;
    maxStat = document.getElementById("statSliderMax").value;
    updateUI();
}

function updateSelectedClass(newClass) {
    selectedClass = newClass;
    updateUI();
}

document.getElementById("heatBarSmoothing").addEventListener("click", () => toggleHeatBarSmoothing());
document.getElementById("statSliderMin").addEventListener("input", () => updateStatMinMax());
document.getElementById("statSliderMax").addEventListener("input", () => updateStatMinMax());
document.getElementById("hunter").addEventListener("click", () => updateSelectedClass("hunter"));
document.getElementById("titan").addEventListener("click", () => updateSelectedClass("titan"));
document.getElementById("warlock").addEventListener("click", () => updateSelectedClass("warlock"));

const run = () => {
    updateUI();
}
run();