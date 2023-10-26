import useSWR from "swr";

/**
 * Gets data from local storage for the useCheckbox hook with useSWR.
 *
 * @param  {string} key The key to search local storage for.
 *
 * @returns {string | null} The current value associated with the given key, or null if the given key does not exist.
 */
function fetcher(key) {
	return localStorage.getItem(key);
}

/**
 * Gets a checkbox's value from local storage and returns it.
 *
 * @param {string} id
 * @returns An object with the following values:
 *
 * checked: A value being true if local storage is true, otherwise false, including if the value doesnt exist in local storage.
 *
 * error: From useSWR values {@link https://swr.vercel.app/docs/api}.
 */
export default function useCheckbox(id) {
	const {data, error} = useSWR(`checkbox/${id}`, fetcher);

	return {
		checked: data === "true" ? true : false,
		error,
	};
}
