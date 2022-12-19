module.exports = {
	postbuild: async () => {
		const cpy = (await import("cpy")).default;
		await cpy(
			[
				"./.env"
			],
			"./dist/server/src"
		);
	},
};