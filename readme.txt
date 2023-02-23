_______________________________
|                             |
|  1. WHAT IS PUG-TO-SVELTE?  |
|_____________________________|

It lets you write Svelte components using Pug instead of vanilla HTML. In other words, it's a transpiler for Pug templates.

It's intended for use as part of the build process for Svelte applications, and aims to integrate Pug and Svelte smoothly without losing too much in the process.

_______________________
|                     |
|  2. PACKAGE STATUS  |
|_____________________|

COMPLETE --- the package has been used in production for multiple years, and requires no further development.

___________________________________
|                                 |
|  3. CAPABILITIES & LIMITATIONS  |
|_________________________________|

Capabilities:
1. Converts Pug to HTML while preserving Svelte logic expressions and control structures.
2. Supports all Svelte and Pug features except for those listed in "Limitations" below.
3. Zero artificial syntax. All supported features use the same syntax as the respective features in Pug or Svelte.
4. Can be combined with other transpilers (e.g. for scripts/styles) within the normal Svelte preprocessing workflow.
5. Fast, lightweight, and efficient.

Limitations:
1. Pug: NO spaces as indentation. Use tabs only.
2. Pug: NO tags split across multiple lines. Each tag must be on a single line.
3. Svelte: NO prop shorthands. For props with identical names and values, write both.
4. Svelte: NO spread props.
5. Svelte: NO style props.

_______________________
|                     |
|  4. EXAMPLE SYNTAX  |
|_____________________|

script.
	// import ...
	export let phaserSetting = 'stun'
	const shirtColor = '#FF0000'
	let powerLevel = 0

<!-- DUE TO REGULATION 336127-A, THIS PROCEDURE MAY ONLY BE MODIFIED BY A LICENSED WARP DRIVE TECHNICIAN -->
{#await startupEngines}
	EngineSpinner(speed='faster')
{:then warpCoreStatus}
	{#if powerLevel > 9000}
		h1 Navigation plan: Andromeda Galaxy
		{#if warpCoreStatus.inRange}
			ol#galaxy-map
				{#each warpCoreStatus.reachablePlanets as planet}
					FastestRouteAnalysis(celestialBody={planet})
		{:else}
			figure
				img(src='/public/space_hi_res_final.jpg')
				figcaption You stare out at a distant galaxy, unable to bridge the vastness of the universe.
	{:else}
		label(for='fusion-battery') Charge up the helium core! It's time to get going!
		input#fusion-battery(type='number' bind:value={powerLevel})
{:catch systemCrash}
	h1 Houston, we have a problem!
	.error-report
		| Computer says: {systemCrash.errorMessage}
		| Looks like we're not going to space today.
		button(on:click={systemCrash.moreMagic}) Maybe this will work?
		p Or how about starting
			a.extragalactic-link(href='https://svelte.dev/' target='_blank') a new galaxy?

style.
	.extragalactic-link {
		color: gold;
	}
	:global(#final-frontier) {
		background: var(--bg-full-of-stars);
	}

_____________________________________
|                                   |
|  5. INSTALLATION & CONFIGURATION  |
|___________________________________|

Make sure to read the "Capabilities & Limitations" section to ensure that you are OK with the syntax restrictions listed.

1. Install the 'pug-to-svelte' package from NPM. (Or, simply download and add the "index.js" file in this directory to your project.)
2. Import the default export from the package (or file). This export is a function that transpiles Pug-based Svelte components into regular HTML-based Svelte components.
3. Simply input Pug templates into the function and provide the output to the Svelte compiler (both as strings). It's recommended to set this up using Svelte's "preprocess" feature.

__________________________________________
|                                        |
|  6. EXAMPLE CONFIGURATION (WEBPACK 5)  |
|________________________________________|

const pugToSvelte = require('pug-to-svelte')

module.exports = {
	module: {
		rules: [{
			test: /\.pug$/,
			use: [{
				loader: 'svelte-loader',
				options: {
					preprocess: [{
						markup: ({ content }) => ({ code: pugToSvelte(content) })
					}]
				}
			}]
		}]
	}
}