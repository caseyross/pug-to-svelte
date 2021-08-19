# pug-to-svelte

Write Svelte components as Pug templates, without the compromises imposed by existing methods like `svelte-preprocess`'s native Pug handling.


## Supported syntax

`pug-to-svelte` supports almost all of Svelte's syntax. Notable exceptions include:

- Shorthand attributes are not supported. (E.g., still use `Component(prop={prop})`, not `Component(prop)`, if the prop and value have the same name.)

Besides the exceptions listed, if you find that `pug-to-svelte` is missing support for some syntax feature, please open an issue.


## Syntax example

```pug
script.
	export let promise = Promise.reject('Oops! The developer messed up!')

{#await promise}
	LoadingAnimation(type='spinner')
{:then value}
	h1 My Favorite Things
	{#if value.list && value.list.length > 0}
		ol#favorites
			{#each value.list as item, i}
				FavoriteThing(item={item} rank={i + 1})
	{:else if value.corrupted}
		.list-gone Sorry, we've lost your favorite things. Tough luck.
	{:else}
		.list-not-created You haven't created this list yet.
		a(href='/{user.id}/favorites/create') Why not do it now?
{:catch error}
	h1 Uh-oh!
	.network-error
		| Couldn't connect to the server!
		| The error was: {error}
		button(on:click={() => retryPromise()}) Retry?
		p Or return to
			a.logo(href='/') the homepage.

style.
	button {
		font-size: 0.75rem;
	}
```

## Installation

`pug-to-svelte` exports a single function that converts a string from Pug-based to HTML-based Svelte syntax.

Just apply it in your build step wherever you need to do that conversion.

For example, say you want to use `webpack`, with `svelte-loader` for Svelte, and `svelte-preprocess` to handle CoffeeScript and Stylus. Then you can hook things up like this:
```javascript
const pugToSvelte = require('pug-to-svelte')
const autoToSvelte = require('svelte-preprocess')

module.exports = {
	// ...
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'svelte-loader',
						options: {
							preprocess: [
								{
									markup: ({ content }) => {
										return {
											code: pugToSvelte(content)
										}
									} 
								},
								autoToSvelte({
									defaults: {
										script: 'coffeescript',
										style: 'stylus',
									}
								})
							]
						},
					},
				],
			},
			// more rules... 
		]
	},
	// ...
}
```

## Usage

If you've got everything installed right, you should be able to write your templates directly in Pug now, while making full use of Svelte features.
```pug
script.
	// ... code ...

// ... component markup ...
// ... (can have as many top-level elements as you want) ...

style.
	// ... styles ...
```

## Contributing

`pug-to-svelte` is feature complete, and any additional contributions are likely to be appreciated, but not welcomed. In other words, unless you've discovered a massive bug, it's probably better for you to spend your time elsewhere.

## Thanks

Inspired by [pynnl/pug2svelte](https://github.com/pynnl/pug2svelte) and [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess).