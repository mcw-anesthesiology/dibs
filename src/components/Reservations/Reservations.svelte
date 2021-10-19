<section>
	<List bind:after bind:before {reservations} showResource={!resourceId} />

	<div>
		<Route path="/">
			<a class="dibs-outline-button" href="/#{$router.path}/reserve">
				Add ➕
			</a>
		</Route>
		<Route path="/reserve">
			<Add {resourceId} {reservations} on:submit={handleAdd} on:close={handleBack} />
		</Route>
	</div>
</section>

<script type="typescript">
	import { Route, router } from 'tinro';

	import List from './List.svelte';
	import Add from './Add.svelte';

	import { Reservation } from '../../types.js';
	import { thisMonth, fetchReservations } from '../../utils.js';

	export let resourceId: string = undefined;

	let [after, before] = thisMonth();

	let reservations: Reservation[] = [];

	$: reload(after, before);

	function reload(after: Date, before: Date) {
		fetchReservations({
			resource_id: resourceId,
			before,
			after,
		}).then(r => {
			reservations = r;
		});
	}

	function handleBack() {
		router.goto($router.path.replace('/reserve', ''));
	}

	function handleAdd() {
		handleBack();
		reload(after, before);
	}
</script>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
