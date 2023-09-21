import useSWR from "swr";

const fetcher = async (...args) => {
	const res = await fetch(...args);
	if (!res.ok) {
		const error = new Error("An error occurred while fetching the data.");
		// Attach extra info to the error object.
		error.info = await res.json();
		error.status = res.status;
		throw error;
	}
	return await res.json();
};

export default function useArmor(mode) {
	let key = mode === "demo" ? "/api/getDummyArmor" : mode === "none" ? null : "/api/getArmor";
	const {data, error, isLoading, isValidating} = useSWR(key, fetcher, {refreshInterval: 300000});

	if (error && error.status === 401) {
		window.location.href = "/authenticate";
	}

	return {
		armorData: data,
		isLoading,
		error,
		isValidating,
	};
}
