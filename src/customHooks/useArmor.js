import useSWR from "swr";

/**
 * Fetchs data for the useArmor hook with useSWR. Calls fetch() with the provided args.
 *
 * @param  {...any} args Any arguments to pass to the fetch function.
 *
 * @returns The response.json() object.
 */
async function fetcher(...args) {
	const res = await fetch(...args);
	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		// Attach extra info to the error object.
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return await res.json();
}

/**
 * Retrieves the users armor data and refreshes every 5 minutes.
 *
 * @param {boolean | null} useDummyData Should the hook fetch dummy data (true), real data (false), or no data (null).
 *
 * @returns An object with the following values:
 *
 * armorData: The armor data returned from the api.
 *
 * isLoading, error, isValidating: From useSWR values {@link https://swr.vercel.app/docs/api}.
 */
export default function useArmor(useDummyData) {
	let key;
	if (useDummyData == null) key = null; // Null means dont fetch.
	else if (useDummyData === true) key = "/api/getDummyArmor"; // Get dummy data, probably for demo.
	else if (useDummyData === false) key = "/api/getArmor"; // Get a users actual armor data.

	// Fetch data.
	const {data, error, isLoading, isValidating} = useSWR(key, fetcher, {refreshInterval: 300000});

	if (error && error.status === 401) {
		// Redirect user to auth page if they're unauthorized.
		window.location.href = "/authenticate";
	} else if (error && error.status === 40) {
		// TODO: Not implemented
		window.location.href = "/accountSelection";
	}

	return {
		armorData: data,
		isLoading,
		error,
		isValidating,
	};
}
