import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useArmor(dummyData) {
	const {data, error, isLoading, isValidating} = dummyData
		? useSWR("/api/getDummyArmor", fetcher)
		: useSWR("/api/getArmor", fetcher, {refreshInterval: 300000});

	return {
		armorData: data,
		isLoading,
		error,
		isValidating,
	};
}
