import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useArmor(mode) {
	let key = mode === "demo" ? "/api/getDummyArmor" : mode === "none" ? null : "/api/getArmor";
	const {data, error, isLoading, isValidating} = useSWR(key, fetcher, {refreshInterval: 300000});

	return {
		armorData: data,
		isLoading,
		error,
		isValidating,
	};
}
