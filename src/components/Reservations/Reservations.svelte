<section>
	<h2>Reservations</h2>

	<a href="/#/reservations/add">
		Add
	</a>

	{#if reservations?.length}
		<ol>
			{#each reservations as reservation}
				<ListItem {reservation} />
			{/each}
		</ol>
	{/if}
</section>
<script type="typescript">
	import ListItem from './ListItem.svelte';

	import { Reservation } from '../../types.js';
	import { fetchReservations } from '../../utils.js';

	let reservations: Reservation[] = [];

	// TODO: Paginate
	fetchReservations().then(r => {
		reservations = r;
	});
</script>
