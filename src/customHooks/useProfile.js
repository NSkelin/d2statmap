import useSWR from "swr";

/**
 * Fetchs data for the useProfile hook with useSWR. Calls fetch() with the provided args.
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
 * Get all of the users Destiny2 memberships (xbox, steam, playstation, etc).
 *
 * @returns An object with the following values:
 *
 * profiles: The users Destiny2 memberships
 *
 * isLoading, error: From useSWR values {@link https://swr.vercel.app/docs/api}.
 */
export default function useProfile() {
	const {data, error, isLoading} = useSWR("/api/getDestinyMemberships", fetcher);

	// Redirect user to auth page if they're unauthorized.
	if (error && error.status === 401) {
		window.location.href = "/authenticate";
	}

	return {
		profiles: data,
		isLoading,
		error,
	};
}
