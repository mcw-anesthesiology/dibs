<section>
	<h2>Reservations</h2>

	<a href="/#/reservations/add">
		Add
	</a>

	<List bind:after bind:before {reservations} />
</section>
<script type="typescript">
	import List from './List.svelte';

	import { Reservation } from '../../types.js';
	import { dateString, fetchReservations } from '../../utils.js';

	let after = new Date();
	let before = new Date();

	let reservations: Reservation[] = [];

	$: fetchReservations({
		before: dateString(before),
		after: dateString(after)
	}).then(r => {
		reservations = r;
	});
</script>
