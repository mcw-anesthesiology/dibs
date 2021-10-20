<article role="application" class="dibs-reservations">
	<header>
		<nav>
			<a class="dibs-outline-button home-button" href="/#/resources" use:active exact>
				🏠 Home
			</a>
		</nav>

		{#if $me?.admin}
			<nav>
				<ul>
					<li>
						<a href="/#/resources" use:active exact>
							Home
						</a>
					</li>
					<li>
						<a href="/#/reservations" use:active exact>
							Reservations
						</a>
					</li>
				</ul>
			</nav>
		{/if}
	</header>

	<main>
		<Route path="/" redirect="/resources" />
		<Route path="/resources/*" firstmatch>
			<Route path="/">
				<Resources />
			</Route>
			<Route path="/:id/*" let:meta>
				<Resource id={meta.params.id} />
			</Route>
		</Route>
		<Route path="/reservations/*">
			<section>
				<h2>Reservations</h2>

				<Reservations />
			</section>
		</Route>
	</main>
</article>

<script type="typescript">
	import { Route, router, active } from 'tinro';

	import Resources from './Resources/Resources.svelte';
	import Resource from './Resources/Resource.svelte';
	import Reservations from './Reservations/Reservations.svelte';

	import { me } from '../stores.js';

	import '../global.css';

	router.mode.hash();
</script>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	nav {
		padding: 1em;
		height: 2em;
	}

	nav :global(a.active) {
		opacity: 0.5;
		pointer-events: none;
	}

	nav :global(a.home-button.active) {
		display: none;
		pointer-events: none;
	}

	nav ul {
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
	}

	nav li {
		display: block;
		margin: 0.5em;
	}
</style>
