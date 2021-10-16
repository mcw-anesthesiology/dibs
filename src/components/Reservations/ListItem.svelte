<li>
	<LabeledValue label="#">
		{reservation.id}
	</LabeledValue>
	<LabeledValue label="Reserved by">
		{reserver?.name ?? ''}
	</LabeledValue>
	<LabeledValue label="Start">
		<RichDate date={reservation.reservation_start} showTime />
	</LabeledValue>
	<LabeledValue label="End">
		<RichDate date={reservation.reservation_end} showTime />
	</LabeledValue>
	<LabeledValue label="Note">
		<pre>{reservation.description}</pre>
	</LabeledValue>
</li>

<script type="typescript">
	import LabeledValue from '../LabeledValue.svelte';
	import RichDate from '../RichDate.svelte';

	import { User, Reservation } from '../../types.js';
	import { userGetter } from '../../stores.js';

	export let reservation: Reservation;

	let reserver: User;
	$: reserver = $userGetter(reservation.user_id);
</script>

<style>
	li {
		display: flex;
		flex-wrap: wrap;
	}

	pre {
		font-family: inherit;
		margin: 0;
	}
</style>
