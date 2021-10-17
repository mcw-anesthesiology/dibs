<section>
	<h2>Resource</h2>

	<nav>
		<ul>
			<li>
				<a href="/#/resources/{id}/reserve">
					Reserve
				</a>
			</li>
		</ul>
	</nav>

	{#if resource}
		<div class="resource">
			<h3>{resource.name}</h3>

			<pre>{resource.description ?? ''}</pre>

			<Route path="/reserve">
				<Add resourceId={id} {reservations} on:submit={handleAdd} on:close={handleBack} />
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
	import { thisMonth, fetchReservations } from '../../utils.js';

	export let id: string;

	let resource: Resource = null;
	$: resource = $resourceGetter(id);

	let reservations: Reservation[];
	let [after, before] = thisMonth();

	reload();

	function reload() {
		fetchReservations({'resource_id': id}).then(r => {
			reservations = r;
		});
	}

	function handleBack() {
		router.goto(`/resources/${id}`);
	}

	function handleAdd() {
		reload();
		handleBack();
	}
</script>

<style>
	.resource {
		padding: 1em;
	}
</style>
