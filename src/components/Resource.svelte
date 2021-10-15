<section>
	<h2>Resource</h2>

	{#if resource}
		{JSON.stringify(resource)}

		{#if reservations?.length}
			<ol>
				{#each reservations as reservation}
					<li>{JSON.stringify(reservation)}</li>
				{/each}
			</ol>
		{/if}
	{/if}
</section>

<script type="typescript">
	import { Resource, Reservation } from '../types.js';
	import { fetchResource, fetchReservations } from '../utils.js';

	export let id: string;

	let resource: Resource = null;
	let reservations: Reservation[] = [];

	fetchResource(id).then(r => {
		resource = r;
	});

	fetchReservations({'resource_id': id}).then(r => {
		reservations = r;
	});
</script>
