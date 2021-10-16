<section>
	<h2>Resource</h2>

	{#if resource}
		{JSON.stringify(resource)}

		<a href="/#/resources/{id}/reserve">Reserve</a>

		{#if reservations?.length}
			<ol>
				{#each reservations as reservation}
					<ListItem {reservation} />
				{/each}
			</ol>
		{/if}

		<Route path="/reserve">
			<Add resourceId={id} {reservations} on:submit={handleAdd} />
		</Route>
	{/if}
</section>

<script type="typescript">
	import { Route, router } from 'tinro';

	import Add from '../Reservations/Add.svelte';
	import ListItem from '../Reservations/ListItem.svelte';

	import { Resource, Reservation } from '../../types.js';
	import { resourceGetter } from '../../stores.js';
	import { fetchReservations } from '../../utils.js';

	export let id: string;

	let resource: Resource = null;
	$: resource = $resourceGetter(id);

	let reservations: Reservation[];

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
