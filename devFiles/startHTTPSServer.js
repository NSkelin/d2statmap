// this file will create a self signed certificate for https and host it
// it is meant to be used for testing auth0 with bungie.net in a localhost dev environment
import * as dotenv from "dotenv";
dotenv.config();

// express
import express from "express";
const app = express();

import https from "https";
import mkcert from "mkcert";

async function runHTTPSDevServer() {
	const ca = await mkcert.createCA({
		organization: "Dev CA",
		countryCode: "Dev",
		state: "Dev",
		locality: "Dev",
		ValidityDays: 1,
	});
	const cert = await mkcert.createCert({
		domains: ["127.0.0.1", "localhost"],
		validityDays: 1,
		caKey: ca.key,
		caCert: ca.cert,
	});
	https.createServer({key: cert.key, cert: cert.cert}, app).listen(process.env.DEV_HTTPS_PORT, () => {
		console.log(`HTTPS server started on port ${process.env.DEV_HTTPS_PORT}`);
	});
}

runHTTPSDevServer();
