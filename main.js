const data = [2,10,13,17,2,2,7,5,12];
const attributes = ["mobility", "resilience", "Recovery", "Discipline", "Intellect", "Strength"]
const gradients = [[165, 207, 255, 0.8],[255, 249, 165, 0.8],[255, 251, 30, 0.8],[255, 145, 0, 0.8],[255, 0, 0, 0.8],];
const pixelsPerStat = 5; // how many pixels each stat point is represented by on the stat bar
let heatBarSmoothing = false;
let minStat = 2;
let maxStat = 40;

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

function updateUI() {
    // sort data from highest to lowest
    data.sort((a, b) => b - a);

    // convert stats to pixels
    const pixels = data.reduce((newArray, currentValue) => {
        if (currentValue > minStat && currentValue <= maxStat) {
            newArray.push(currentValue * pixelsPerStat);
        }
        return newArray;
    }, []);

    console.log(pixels);

    // update UI
    for (const attribute of attributes) {
        // update stat bars
        document.getElementById(attribute+"Bar").style.backgroundImage = createHeatMap(pixels);

        // update armor count
        document.getElementById(attribute+"Count").innerHTML = data.length;
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

document.getElementById("heatBarSmoothing").addEventListener("click", () => toggleHeatBarSmoothing());
document.getElementById("statSliderMin").addEventListener("input", () => updateStatMinMax());
document.getElementById("statSliderMax").addEventListener("input", () => updateStatMinMax());

const run = () => {
    updateUI()
}
run();