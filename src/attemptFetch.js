/**
 * Similar to a normal fetch but will make multiple attempts if the fetch fails. Unlike a normal fetch though,
 * the response is parsed as json before being returned.
 *
 * An attempt is considered failed if the fetch itself throws an error (network),
 * the response is not ok, or if the response has an ErrorCode property and the value is not 0 or 1 (None: 0 Success: 1).
 * The ErrorCode property is specific to Bungie's API, which this app uses primarily.
 *
 * When an attempt fails, the error will be logged with console.error() and should all attempts fail, an error will be thrown.
 *
 * @param {number} attempts The number of attempts to try fetching the resource.
 * @param {string} url The url for the resource be to fetched from.
 * @param {object} options Options for the fetch such as method and headers.
 *
 * @returns The data from prasing the response as json with response.json().
 */
export async function attemptFetch(attempts, url, options) {
	// Clamp minimum attempts to 1.
	attempts = attempts < 1 ? 1 : attempts;

	// Attempt to fetch
	for (let i = 0; i < attempts; i++) {
		try {
			// Fetch the data.
			const response = await fetch(url, options);

			// Handle response not ok errors.
			if (!response.ok) {
				console.error(`Error: Response not ok! Attempt #${i}, URL: ${url}, Response status: ${response.status}, Response: ${response}`);
				continue;
			}

			const data = await response.json();

			// Handle Bungie API ErrorCode errors
			if (!data.ErrorCode || data.ErrorCode === 0 || data.ErrorCode === 1) {
				// Doesnt exist OR no error ( None: 0 Success: 1 )
				return data;
			} else {
				console.error(`Error: Bungie API ErrorCode! Attempt #${1}, URL: ${url}, ErrorCode: ${data.ErrorCode}`);
			}
		} catch (error) {
			// Handle network errors.
			console.error(`Error: Fetch failed! Attempt #${1}, URL: ${url}, Error message: ${error}`);
		}
	}
	console.error(`Failed to fetch the resource at "${url}" after ${attempts} attempts.`);
	throw new Error(`Failed to fetch the resource at "${url}" after ${attempts} attempts.`);
}
