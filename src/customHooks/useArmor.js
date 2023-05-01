import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useArmor() {
	const {data, error, isLoading, isValidating} = useSWR("/api/getArmor", fetcher, {refreshInterval: 300000});

	return {
		armorData: data,
		isLoading,
		error,
		isValidating,
	};
}
