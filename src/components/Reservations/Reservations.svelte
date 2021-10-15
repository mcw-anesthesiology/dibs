<section>
	<h2>Reservations</h2>


	{#if reservations?.length}
		<ol>
			{#each reservations as reservation}
				<li>{JSON.stringify(reservation)}</li>
			{/each}
		</ol>
	{/if}
</section>
<script type="typescript">
	import { Reservation } from '../../types.js';
	import { fetchReservations } from '../../utils.js';

	let reservations: Reservation[] = [];

	fetchReservations().then(r => {
		reservations = r;
	});
</script>
