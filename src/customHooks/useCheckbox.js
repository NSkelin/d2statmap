import useSWR from "swr";

const fetcher = (...args) => localStorage.getItem(...args);

export default function useCheckbox(id) {
	const {data, error} = useSWR(`checkbox/${id}`, fetcher);

	return {
		checked: data === "true" ? true : false,
		error,
	};
}
