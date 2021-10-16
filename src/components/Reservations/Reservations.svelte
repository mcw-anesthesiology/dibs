<section>
	<h2>Reservations</h2>

	<a href="/#/reservations/add">
		Add
	</a>

	<form>
		<fieldset>
			<legend>Reservation date</legend>

			<button type="button" on:click={thisMonth}>
				This month
			</button>

			<button type="button" on:click={() => { shiftMonth(-1); }}>
				← Previous month
			</button>

			<label>
				Start
				<Flatpickr options={startOptions} bind:value={after} />
			</label>
			–
			<label>
				End
				<Flatpickr options={endOptions} bind:value={before} />
			</label>

			<button type="button" on:click={() => { shiftMonth(1); }}>
				Next month →
			</button>
		</fieldset>
	</form>
	{#if reservations?.length}
		<ol>
			{#each reservations as reservation}
				<ListItem {reservation} />
			{/each}
		</ol>
	{:else}
		<i>None found.</i>
	{/if}
</section>
<script type="typescript">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import ListItem from './ListItem.svelte';


	import { Reservation } from '../../types.js';
	import { dateString, fetchReservations } from '../../utils.js';

	let after = new Date();
	let before = new Date();
	thisMonth();

	console.log({ startOfMonth: after, endOfMonth: before });

	const startOptions = {
		defaultDate: after,
	};

	const endOptions = {
		defaultDate: before,
	};

	$: console.log({ before, after });

	let reservations: Reservation[] = [];

	$: fetchReservations({
		before: dateString(before),
		after: dateString(after)
	}).then(r => {
		reservations = r;
	});

	function shiftMonth(num: number) {
		after.setMonth(after.getMonth() + num);
		after.setDate(1);
		before.setFullYear(after.getFullYear(), after.getMonth() + 1, 0);
		after = after;
		before = before;
	}

	function thisMonth() {
		const d = new Date();
		after.setFullYear(d.getFullYear(), d.getMonth(), 1);
		before.setFullYear(d.getFullYear(), d.getMonth() + 1, 0);
		after = after;
		before = before;
	}
</script>
