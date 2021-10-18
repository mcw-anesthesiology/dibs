<div>
	<form>
		<fieldset>
			<legend>Reservation date</legend>

			<div class="date-controls">
				<button type="button" on:click={setThisMonth}>
					This month
				</button>

				<div>
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
				</div>
			</div>
		</fieldset>
	</form>

	{#if reservations?.length}
		<ol>
			{#each reservations as reservation}
				<ListItem {reservation} {showResource} />
			{/each}
		</ol>
	{:else}
		<i>No reservations found.</i>
	{/if}
</div>

<script type="typescript">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import ListItem from './ListItem.svelte';

	import { Reservation } from '../../types.js';
	import { thisMonth } from '../../utils.js';

	export let showResource = false;
	export let reservations: Reservation[];
	export let after: Date;
	export let before: Date;

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

	ol {
		padding: 0;
	}

	ol :global(li) {
		border: 1px solid var(--border-color);
	}
</style>
