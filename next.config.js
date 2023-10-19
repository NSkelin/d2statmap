const nextConfig = {
	reactStrictMode: true,

	webpack(config) {
		// Grab the existing rule that handles SVG imports
		const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				resourceQuery: {not: /url/}, // exclude if *.svg?url
				use: ["@svgr/webpack"],
			}
		);

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	},

	compiler: {
		styledComponents: true,
	},

	async redirects() {
		return [
			// not authenticated
			{
				source: "/",
				missing: [
					{
						type: "cookie",
						key: "auth",
					},
				],
				destination: "/authenticate",
				permanent: false,
			},
			{
				source: "/accountSelection",
				missing: [
					{
						type: "cookie",
						key: "auth",
					},
				],
				destination: "/authenticate",
				permanent: false,
			},
			// hasnt selected an account
			{
				source: "/",
				has: [
					{
						type: "cookie",
						key: "auth",
					},
				],
				missing: [
					{
						type: "cookie",
						key: "membership",
					},
				],
				destination: "/accountSelection",
				permanent: false,
			},
			{
				source: "/authenticate",
				has: [
					{
						type: "cookie",
						key: "auth",
					},
				],
				missing: [
					{
						type: "cookie",
						key: "membership",
					},
				],
				destination: "/accountSelection",
				permanent: false,
			},
			// authenticated and selected an account
			{
				source: "/authenticate",
				has: [
					{
						type: "cookie",
						key: "auth",
					},
					{
						type: "cookie",
						key: "membership",
					},
				],
				destination: "/",
				permanent: false,
			},
			{
				source: "/accountSelection",
				has: [
					{
						type: "cookie",
						key: "auth",
					},
					{
						type: "cookie",
						key: "membership",
					},
				],
				destination: "/",
				permanent: false,
			},
		];
	},

	experimental: {
		instrumentationHook: true,
	},
};

export default nextConfig;
