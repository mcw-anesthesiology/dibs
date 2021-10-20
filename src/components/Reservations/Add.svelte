<form bind:this={form} on:submit={handleSubmit} class:loading>
	<div class="controls">
		{#if showResourceSelector}
			<label class="resource">
				Resource
				<select bind:value={resourceId} required disabled={loading}>
					<option disabled></option>
					{#each $resources as resource}
						<option value={resource.id}>{resource.name}</option>
					{/each}
				</select>
			</label>
		{/if}

		<DateTimeInput label="Reservation time" bind:start bind:end required disabled={loading} minDate={new Date()} />

		<label class="note">
			Note
			<textarea bind:value={description} disabled={loading}></textarea>
		</label>
	</div>

	{#if reservations.length > 0}
		<aside class="error-container">
			<p>Sorry, it is unavailable during that time.</p>

			<p>Existing reservations:</p>
			<ol>
				{#each reservations as reservation}
					<ListItem {reservation} />
				{/each}
			</ol>
		</aside>
	{/if}
	{#if error}
		<aside class="error-container">
			<button type="button" class="dismiss" aria-label="Dismiss" on:click={() => { error = null; }}>×</button>
			Sorry, there was a problem adding your reservation.
		</aside>
	{/if}

	<div class="button-container">
		<button type="submit" disabled={loading || !isValid}>
			Reserve
		</button>

		<button type="button" on:click={() => { dispatch('close'); } }>
			Cancel
		</button>
	</div>
</form>

<script type="typescript">
	import { onMount, createEventDispatcher } from 'svelte';

	import DateTimeInput from '../DateTimeInput.svelte';
	import ListItem from './ListItem.svelte';

	import { Reservation } from '../../types.js';
	import { address, fetchConfig, fetchReservations, dateTimeString } from '../../utils.js';
	import { resources } from '../../stores.js';

	export let showResourceSelector = false;
	export let resourceId: number | string = undefined;
	export let description = '';

	let inputStart: Date = undefined;
	let inputEnd: Date = undefined;
	export { inputStart as start, inputEnd as end };

	let start: Date = inputStart;
	let end: Date = inputEnd;

	let form: HTMLFormElement;
	let reservations: Reservation[] = [];

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (form) {
			form.scrollIntoView();
		}
	});

	let loading = false;
	let loadingReservations = false;
	let error: Error = null;

	let isValid = false;

	$: reload(start, end);

	async function reload(after: Date, before: Date) {
		if (!after || !before) {
			reservations = [];
			return;
		}

		loadingReservations = true;
		try {
			reservations = await fetchReservations({
				resource_id: resourceId,
				before: dateTimeString(before),
				after: dateTimeString(after),
			});
		} catch (err) {
			console.error(err);
		}
		loadingReservations = false;
	}

	$: isValid = !loading && !loadingReservations && resourceId && start && end && start <= end && reservations && reservations.length === 0;

	async function handleSubmit(event: Event) {
		event.preventDefault();

		loading = true;

		try {
			await fetch(address('reservations'), {
				...fetchConfig(),
				method: 'POST',
				body: JSON.stringify({
					resource_id: resourceId,
					reservation_start: dateTimeString(start),
					reservation_end: dateTimeString(end),
					description,
				})
			});
			dispatch('submit');
		} catch (err) {
			console.error(err);
			error = err;
		}

		loading = false;
	}
</script>

<style>
	form {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--border-color);
		padding: 2em;
		margin: 1em auto;
	}

	form > * ~ * {
		margin-top: 1em;
	}

	form.loading {
		cursor: wait;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.controls > :global(*) {
		margin: 1em;
	}

	aside {
		margin-top: 2em;
		padding: 1em;
		width: 100%;
	}

	ol {
		padding: 0 2em;
	}

	p {
		text-align: center;
	}
</style>
