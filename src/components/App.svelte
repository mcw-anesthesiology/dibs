<article role="application">
	<header>
		<nav>
			<ul>
				<li>
					<a href="/#/">Home</a>
				</li>
				<li>
					<a href="/#/resources/">Resources</a>
				</li>
				<li>
					<a href="/#/reservations">Reservations</a>
				</li>
			</ul>
		</nav>
	</header>

	<main>
		<Route path="/" redirect="/resources" />
		<Route path="/resources/">
			<Resources />
		</Route>
		<Route path="/resources/:id" let:meta>
			<Resource id={meta.params.id} />
		</Route>
		<Route path="/reservations">
			<Reservations />
		</Route>
	</main>
</article>

<script type="typescript">
	import { Route, router } from 'tinro';

	import Resources from './Resources/Resources.svelte';
	import Resource from './Resources/Resource.svelte';
	import Reservations from './Reservations/Reservations.svelte';

	router.mode.hash();
</script>

<style>
	nav ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		margin: 0;
	}

	nav li {
		display: block;
		margin: 0.5em;
	}
</style>
