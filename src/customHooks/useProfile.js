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

export default function useProfile() {
	const {data, error, isLoading} = useSWR("/api/getDestinyMemberships", fetcher);

	if (error && error.status === 401) {
		window.location.href = "/authenticate";
	}
	return {
		profiles: data,
		isLoading,
		error,
	};
}
