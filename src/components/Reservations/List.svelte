<div>
	<form>
		<fieldset>
			<legend>Reservation date</legend>

			<button type="button" on:click={setThisMonth}>
				This month
			</button>

			<button type="button" on:click={() => { shiftMonth(-1); }} disabled={!after || !before}>
				← Prev month
			</button>

			<label>
				Start
				<Flatpickr bind:value={after} />
			</label>
			–
			<label>
				End
				<Flatpickr bind:value={before} />
			</label>

			<button type="button" on:click={() => { shiftMonth(1); }} disabled={!after || !before}>
				Next month →
			</button>
		</fieldset>
	</form>

	{#if reservations?.length}
		<ol>
			{#each reservations as reservation}
				<ListItem {reservation} showResource={!resourceId} on:reload={handleReload} />
			{/each}
		</ol>
	{:else}
		<p>
			<i>No reservations found.</i>
		</p>
	{/if}
</div>

<script type="typescript">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import ListItem from './ListItem.svelte';

	import { Reservation } from '../../types.js';
	import { thisMonth, fetchReservations } from '../../utils.js';

	export let resourceId: string = undefined;
	export let reservations: Reservation[] = [];

	let [after, before] = thisMonth();

	function shiftMonth(num: number) {
		if (!after || !before) return;

		after.setMonth(after.getMonth() + num);
		after.setDate(1);
		before.setFullYear(after.getFullYear(), after.getMonth() + 1, 0);
		after = after;
		before = before;
	}

	function setThisMonth() {
		const [a, b] = thisMonth();
		after = a;
		before = b;
	}

	$: reload(after, before);

	async function reload(after: Date, before: Date) {
		reservations = await fetchReservations({
			resource_id: resourceId,
			before,
			after,
		});
	}

	export function handleReload() {
		reload(after, before);
	}
</script>

<style>
	form {
		display: flex;
		justify-content: flex-end;
	}

	form fieldset :global(input) {
		width: 6em;
	}

	button {
		margin: 0.5em 1em;
	}

	ol {
		padding: 0;
	}

	ol :global(li) {
		border: 1px solid var(--border-color);
	}

	p {
		text-align: center;
		margin: 2em;
	}
</style>
