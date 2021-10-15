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
			</ul>
		</nav>
	</header>

	<main>
		<Route path="/">
			<h2>Dibs</h2>
		</Route>
		<Route path="/resources/">
			<Resources />
		</Route>
		<Route path="/resources/:id" let:meta>
			<Resource id={meta.params.id} />
		</Route>
	</main>
</article>

<script type="typescript">
	import { Route, router } from 'tinro';

	import Resources from './Resources.svelte';
	import Resource from './Resource.svelte';

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
