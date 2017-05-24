const {FuseBox, TypeScriptHelpers, UglifyJSPlugin, EnvPlugin} = require("fuse-box");
const fuse = FuseBox.init({
	homeDir: "src",
	output: "dist/$name.js",
	cache: false,
	sourceMaps: true,
	plugins: [
		TypeScriptHelpers(),
		//EnvPlugin({NODE_ENV: production ? "production" : "development"}),
		//production && UglifyJSPlugin(),
	],
	package: {
		name: "fuse-async",
		main: 'index.ts'
	},
	globals: {
		'fuse-async': '*'
	}
});
fuse.bundle("server").instructions('> server/index.ts');
fuse.bundle("client").instructions('> client/index.ts');

fuse.run();
