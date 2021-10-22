const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['./src/index.ts'],
  outdir: 'dist',
  minify: true,
  bundle: false,
  format: 'esm',
  platform: 'node',
  target: 'node14',
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));
