var cron = require("node-cron");

function fetchDataOnSchedule() {
	// fetch at 18:00 each tuesday
	cron.schedule("0 18 * * Tuesday", test, {
		scheduled: true,
		timezone: "America/Los_Angeles",
	});
}

function test() {
	console.log("registering...");
}
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		fetchDataOnSchedule();
	}

	// if (process.env.NEXT_RUNTIME === "edge") {
	// }
}
