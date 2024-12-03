
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "000, 000, 000",
		"--theme-font-color-dark": "000, 000, 000",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #275D38 
		"--color-primary-50": "223 231 225", // #dfe7e1
		"--color-primary-100": "212 223 215", // #d4dfd7
		"--color-primary-200": "201 215 205", // #c9d7cd
		"--color-primary-300": "169 190 175", // #a9beaf
		"--color-primary-400": "104 142 116", // #688e74
		"--color-primary-500": "39 93 56", // #275D38
		"--color-primary-600": "35 84 50", // #235432
		"--color-primary-700": "29 70 42", // #1d462a
		"--color-primary-800": "23 56 34", // #173822
		"--color-primary-900": "19 46 27", // #132e1b
		// secondary | #00834d 
		"--color-secondary-50": "217 236 228", // #d9ece4
		"--color-secondary-100": "204 230 219", // #cce6db
		"--color-secondary-200": "191 224 211", // #bfe0d3
		"--color-secondary-300": "153 205 184", // #99cdb8
		"--color-secondary-400": "77 168 130", // #4da882
		"--color-secondary-500": "0 131 77", // #00834d
		"--color-secondary-600": "0 118 69", // #007645
		"--color-secondary-700": "0 98 58", // #00623a
		"--color-secondary-800": "0 79 46", // #004f2e
		"--color-secondary-900": "0 64 38", // #004026
		// tertiary | #4ba23F 
		"--color-tertiary-50": "228 241 226", // #e4f1e2
		"--color-tertiary-100": "219 236 217", // #dbecd9
		"--color-tertiary-200": "210 232 207", // #d2e8cf
		"--color-tertiary-300": "183 218 178", // #b7dab2
		"--color-tertiary-400": "129 190 121", // #81be79
		"--color-tertiary-500": "75 162 63", // #4ba23F
		"--color-tertiary-600": "68 146 57", // #449239
		"--color-tertiary-700": "56 122 47", // #387a2f
		"--color-tertiary-800": "45 97 38", // #2d6126
		"--color-tertiary-900": "37 79 31", // #254f1f
		// success | #4ba23F 
		"--color-success-50": "228 241 226", // #e4f1e2
		"--color-success-100": "219 236 217", // #dbecd9
		"--color-success-200": "210 232 207", // #d2e8cf
		"--color-success-300": "183 218 178", // #b7dab2
		"--color-success-400": "129 190 121", // #81be79
		"--color-success-500": "75 162 63", // #4ba23F
		"--color-success-600": "68 146 57", // #449239
		"--color-success-700": "56 122 47", // #387a2f
		"--color-success-800": "45 97 38", // #2d6126
		"--color-success-900": "37 79 31", // #254f1f
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #c21200 
		"--color-error-50": "246 219 217", // #f6dbd9
		"--color-error-100": "243 208 204", // #f3d0cc
		"--color-error-200": "240 196 191", // #f0c4bf
		"--color-error-300": "231 160 153", // #e7a099
		"--color-error-400": "212 89 77", // #d4594d
		"--color-error-500": "194 18 0", // #c21200
		"--color-error-600": "175 16 0", // #af1000
		"--color-error-700": "146 14 0", // #920e00
		"--color-error-800": "116 11 0", // #740b00
		"--color-error-900": "95 9 0", // #5f0900
		// surface | #ffffff 
		"--color-surface-50": "255 255 255", // #ffffff
		"--color-surface-100": "255 255 255", // #ffffff
		"--color-surface-200": "255 255 255", // #ffffff
		"--color-surface-300": "255 255 255", // #ffffff
		"--color-surface-400": "255 255 255", // #ffffff
		"--color-surface-500": "255 255 255", // #ffffff
		"--color-surface-600": "230 230 230", // #e6e6e6
		"--color-surface-700": "191 191 191", // #bfbfbf
		"--color-surface-800": "153 153 153", // #999999
		"--color-surface-900": "255, 255", // #7d7d7d
		
	}
}