/* eslint-env node */

import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript-resolve';

export default ({ mode }) => {
	const isProduction = mode === 'production';

	return {
		root: 'src',
		plugins: [
			svelte({
				emitCss: true,
				preprocess: sveltePreprocess(),
				compilerOptions: {
					dev: !isProduction,
				},
			}),
			typescript(),
		],
		envDir: '..',
		publicDir: '../public',
		build: {
			outDir: '../dist',
			emptyOutDir: true,
			minify: isProduction,
			lib: {
				entry: path.resolve(__dirname, 'src/main.js'),
				formats: ['umd'],
				name: 'Dibs',
				fileName: format => `dibs.${format}.js`,
			},
		},
	};
};
