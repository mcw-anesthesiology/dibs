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
	{:else}
		<i>None found.</i>
	{/if}
	<Paginator bind:limit bind:offset pagesRemaining={reservations.length >= limit} />
</section>
<script type="typescript">
	import ListItem from './ListItem.svelte';
	import Paginator from '../Paginator.svelte';

	let limit = 1;
	let offset = 0;

	import { Reservation } from '../../types.js';
	import { fetchReservations } from '../../utils.js';

	let reservations: Reservation[] = [];

	$: fetchReservations({ limit, offset }).then(r => {
		reservations = r;
	});
</script>
