import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'
import { myCustomTheme } from './schedulingapptheme'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			colors: {
				'opaque-white': 'rgba(255, 255, 255, 0.5)',

		},
	},
},
	plugins: [
		skeleton({
			themes: {
				custom: [
					myCustomTheme
				]
			},
		}),
	],
} satisfies Config;
