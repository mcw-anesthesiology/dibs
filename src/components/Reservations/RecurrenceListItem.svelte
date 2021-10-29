<li>
	{#if reservations.length > 0}
		<s>
			<DateTimeRange {...block} />
		</s>
		<div class="error-container">
			<p>Overlaps with:</p>
			{#each reservations as reservation}
				<ListItem {reservation} on:reload />
			{/each}

		</div>
	{:else}
		<DateTimeRange {...block} />
	{/if}
</li>

<script type="typescript">
	import DateTimeRange from '../DateTimeRange.svelte';
	import ListItem from './ListItem.svelte';

	import { Block, Reservation } from '../../types.js';

	export let block: Block;
	export let reservations: Reservation[];
</script>
