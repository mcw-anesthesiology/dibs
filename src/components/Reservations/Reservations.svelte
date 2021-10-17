<section>
	<h2>Reservations</h2>

	<nav>
		<ul>
			<li>
				<a href="/#/reservations/add">
					Add
				</a>
			</li>
		</ul>
	</nav>

	<Route path="/add">
		<Add {reservations} on:submit={handleAdd} on:close={handleBack} />
	</Route>

	<List bind:after bind:before {reservations} />
</section>
<script type="typescript">
	import { Route, router } from 'tinro';

	import List from './List.svelte';
	import Add from './Add.svelte';

	import { Reservation } from '../../types.js';
	import { thisMonth, dateString, fetchReservations } from '../../utils.js';

	let [after, before] = thisMonth();

	let reservations: Reservation[] = [];

	$: reload(after, before);

	function reload(after: Date, before: Date) {
		fetchReservations({
			before: before ? dateString(before) : undefined,
			after: after ? dateString(after): undefined
		}).then(r => {
			reservations = r;
		});
	}

	function handleBack() {
		router.goto('/reservations');
	}

	function handleAdd() {
		handleBack();
		reload(after, before);
	}
</script>
