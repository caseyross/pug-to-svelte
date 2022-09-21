Have you ever wanted to write [Svelte](https://svelte.dev) components using [Pug](https://pugjs.org) markup, while maintaining all of the templating features that make Svelte great?

Now you can.

# Installation

### Compatibility
Due to the whitespace-based nature of Pug, you should be prepared to use tabs for indentation in components. This package is NOT compatible with code indented using spaces.

### Install process
1. Install this package normally using your favorite JS package manager.
2. Determine an appropriate location (build step, etc.) in your codebase that's suited to managing a Pug -> Svelte transpile process. This will most likely be Svelte's `preprocess` API surface.
3. Import the default export from this package into the location you chose. This default export is a function that transpiles a string from Pug-based Svelte syntax to "normal" HTML-based Svelte syntax.
4. Hook in the transpilation function wherever the transpile needs to happen.

(For an example configuration with [Webpack](https://webpack.js.org), see the "Examples" section.)

# Usage
Once installation is complete, simply write Svelte components normally, with Pug markup in place of HTML. Omit end tags (`{/if}`, `{/each}`, `{/await}`, `{/key}`) for Svelte logic conditionals, matching Pug. (For an example component, see the "Examples" section.)

This package supports almost all of Svelte's syntax features. There are a handful of features that are not supported; these are listed in the next section.

# Limitations
The following syntaxes (marked with an X) are NOT supported. If necessary, use the suggested alternatives (marked with a check mark).

### Split-line tags
❌
```pug
Component(
	propA={valueA}
	propB={valueB}
)
```
✅
```pug
Component(propA={valueA} propB={valueB})
```

### Shorthand props / attributes
- ❌ `Component(prop)` -> ✅ `Component(prop={prop})`
- ❌ `Component({prop})` -> ✅ `Component(prop={prop})`
- ❌ `element({attribute})` -> ✅ `element(attribute={attribute})`

### Spread props
- ❌ `Component({...props})` -> ✅ `Component(propA={valueA} propB={valueB} propC={valueC})`
- ❌ `Component({...$$props})` -> ✅ `Component(propA={valueA} propB={valueB} propC={valueC})`
- ❌ `element({...$$restProps})` -> ✅ `element(attributeA={valueA} attributeB={valueB} attributeC={valueC})`

### Style props
- ❌ `Component(--style-var='value')` -> ✅ `Component(prop={value})`

# Examples

Pug / JS / CSS component example:
```pug
script.
	export let phasers = 'stun'
	const shirtColor = 'red'

<!-- DUE TO REGULATION 336127-A, THIS PROCEDURE MAY ONLY BE MODIFIED WHILE WEARING TYPE-D PROTECTIVE GEAR -->
{#await startupEngines}
	EngineSpinner(speed='faster')
{:then warpCoreStatus}
	{#if powerLevel > 9000}
		h1 Navigation plan: Andromeda Galaxy
		{#each reachablePlanets as planet}
			ol#galaxy-mapping
				FastestRouteAnalysis(celestialBody={planet})
		{:else}
			img.empty(src='/vastness_of_space.jpg')
	{:else}
		input#fusion-battery(type='number' bind:value={powerLevel})
		label(for='fusion-battery') Charge it up!
{:catch ghostsInTheMachine}
	h1 Houston, we have a problem!
	.error-report
		| Computer says: {errorMessage}
		| Looks like we're not going to space today.
		button(on:click={() => flipTheMagicSwitch()}) Maybe this will work?
		p Or how about starting
			a.extragalactic(href='https://svelte.dev/' target='_blank') a new galaxy?

style.
	.empty {
		pointer-events: none;
	}
	:global(#the-final-frontier) {
		background: var(--filled-with-stars);
	}
```

Webpack 5 / [svelte-loader](https://github.com/sveltejs/svelte-loader) configuration example:
```javascript
const pugToSvelte = require('pug-to-svelte')

module.exports = {
	module: {
		rules: [{
			test: /\.pug$/,
			use: [{
				loader: 'svelte-loader',
				options: {
					preprocess: [{
						markup: ({ content }) => ({ code: pugToSvelte(content) }),
					}]
				},
			}],
		}]
	},
}
```

# About

### Development status
Development of this package is complete, and no code updates will be made. If you rely on this package as part of your build environment, rest assured that it will remain stable.

### Credits
Inspired by:
- [tienpv222/pug2svelte](https://github.com/tienpv222/pug2svelte)
- [sveltejs/svelte-preprocess](https://github.com/sveltejs/svelte-preprocess)