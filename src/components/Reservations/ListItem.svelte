<li>
	<LabeledValue label="Resource">
		{resource?.name ?? ''}
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

	import { User, Reservation, Resource } from '../../types.js';
	import { resourceGetter, userGetter } from '../../stores.js';

	export let reservation: Reservation;

	let reserver: User;
	$: reserver = $userGetter(reservation.user_id);

	let resource: Resource;
	$: resource = $resourceGetter(reservation.resource_id);
</script>

<style>
	li {
		display: flex;
		flex-wrap: wrap;
		padding: 0.5em;
	}

	li:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	@supports (display: grid) {
		li {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
		}
	}
</style>
