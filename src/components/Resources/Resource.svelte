<section>
	<h2>Resource</h2>

	<a href="/#/resources/{id}/reserve">
		Reserve
	</a>

	{#if resource}
		<div class="resource">
			<h3>{resource.name}</h3>

			<pre>{resource.description}</pre>

			<Route path="/reserve">
				<Add resourceId={id} {reservations} on:submit={handleAdd} />
			</Route>

			<div>
				<h4>Reservations</h4>

				<List bind:after bind:before {reservations} />
			</div>
		</div>
	{/if}
</section>

<script type="typescript">
	import { Route, router } from 'tinro';

	import Add from '../Reservations/Add.svelte';
	import List from '../Reservations/List.svelte';

	import { Resource, Reservation } from '../../types.js';
	import { resourceGetter } from '../../stores.js';
	import { fetchReservations } from '../../utils.js';

	export let id: string;

	let resource: Resource = null;
	$: resource = $resourceGetter(id);

	let reservations: Reservation[];
	let after = new Date();
	let before = new Date();

	reload();

	function reload() {
		fetchReservations({'resource_id': id}).then(r => {
			reservations = r;
		});
	}

	function handleAdd() {
		router.goto(`/resources/${id}`);
		reload();
	}
</script>

<style>
	.resource {
		padding: 1em;
		border: 1px solid var(--border-color);
	}
</style>
