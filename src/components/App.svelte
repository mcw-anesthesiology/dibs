<article role="application" class="dibs-reservations">
	<header>
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
	import AddResource from './Resources/Add.svelte';
	import Reservations from './Reservations/Reservations.svelte';

	import '../global.css';

	router.mode.hash();
</script>

<style>
	nav ul {
		justify-content: flex-end;
	}

	nav :global(a.active) {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
