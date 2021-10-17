<div>
	<form>
		<fieldset>
			<legend>Reservation date</legend>

			<div class="date-controls">
				<button type="button" on:click={thisMonth}>
					This month
				</button>

				<div>
					<button type="button" on:click={() => { shiftMonth(-1); }}>
						← Prev month
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
				</div>
			</div>
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
</div>

<script type="typescript">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import ListItem from './ListItem.svelte';

	import { Reservation } from '../../types.js';

	export let reservations: Reservation[];
	export let after = new Date();
	export let before = new Date();
	thisMonth();


	const startOptions = {
		defaultDate: after,
	};

	const endOptions = {
		defaultDate: before,
	};

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

<style>
	form {
		display: flex;
		justify-content: flex-end;
	}

	.date-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	button {
		margin: 0.5em 1em;
	}
</style>
