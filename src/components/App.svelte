<article role="application" class="dibs-reservations">
	<header>
		<nav>
			<ul>
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
		<Route path="/resources/*" firstmatch>
			<Route path="/">
				<Resources />
			</Route>
			<Route path="/add">
				<h2>Add resource</h2>
				<AddResource />
			</Route>
			<Route path="/:id/*" let:meta>
				<Resource id={meta.params.id} />
			</Route>
		</Route>
		<Route path="/reservations/*">
			<Reservations />
		</Route>
	</main>
</article>

<script type="typescript">
	import { Route, router } from 'tinro';

	import Resources from './Resources/Resources.svelte';
	import Resource from './Resources/Resource.svelte';
	import AddResource from './Resources/Add.svelte';
	import Reservations from './Reservations/Reservations.svelte';

	import '../global.css';

	router.mode.hash();
</script>

<style>
	nav ul {
		justify-content: flex-end;
	}
</style>
