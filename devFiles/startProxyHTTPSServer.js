// this file will create a self signed SSL certificate and run a local HTTPS server using it.
// it is meant to be used as a proxy server for testing the bungie api in a localhost dev environment
// it will redirect from this server to localhost: redirectPort

// express
import express from "express";
const app = express();

import https from "https";
import mkcert from "mkcert";

// this scripts port
const proxyPort = 8080;
const redirectPort = 3000;

app.get("/authorized", (req, res) => {
	res.redirect(`http://localhost:${redirectPort}/api${req.originalUrl}`);
});

async function startProxyHTTPSServer() {
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
	https.createServer({key: cert.key, cert: cert.cert}, app).listen(proxyPort, () => {
		console.log(`HTTPS server started on port ${proxyPort}`);
	});
}

startProxyHTTPSServer();
