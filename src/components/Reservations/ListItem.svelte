<li>
	<div>
		<span>#</span>
		<span>{reservation.id}</span>
	</div>

	<div>
		<span>Reserved by</span>
		<span>{reserver?.name ?? ''}</span>
	</div>
</li>

<script type="typescript">
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
</style>
