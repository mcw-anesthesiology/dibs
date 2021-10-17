<form on:submit={handleSubmit} class:loading>
	<label class="resource">
		Resource
		<select bind:value={resourceId} required disabled={loading}>
			<option disabled></option>
			{#each $resources as resource}
				<option value={resource.id}>{resource.name}</option>
			{/each}
		</select>
	</label>

	<fieldset>
		<legend>Reservation time</legend>

		<label>
			Start
			<Flatpickr options={startOptions} bind:value={start} required disabled={loading} />
		</label>
		–
		<label>
			End
			<Flatpickr options={endOptions} bind:value={end} required disabled={loading} />
		</label>
	</fieldset>

	<label class="note">
		Note
		<textarea name="description" disabled={loading}></textarea>
	</label>

	<div class="button-container">
		<button type="submit" disabled={loading || !isValid}>
			Reserve
		</button>

		<button type="button" on:click={() => { dispatch('close'); } }>
			Cancel
		</button>
	</div>

	{#if existingReservations.length > 0}
		<aside class="error-container">
			<p>Sorry, it is unavailable during that time.</p>

			<p>Existing reservations:</p>
			<ol>
				{#each existingReservations as reservation}
					<ListItem {reservation} />
				{/each}
			</ol>
		</aside>
	{/if}
</form>

<script type="typescript">
	import { createEventDispatcher } from 'svelte';
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import ListItem from './ListItem.svelte';

	import { Reservation } from '../../types.js';
	import { address, fetchConfig } from '../../utils.js';
	import { resources } from '../../stores.js';

	export let resourceId: number | string = undefined;
	export let reservations: Reservation[];
	export let start: Date = undefined;
	export let end: Date = undefined;

	const dispatch = createEventDispatcher();

	let loading = false;
	let error: Error = null;

	const startOptions = {
		enableTime: true,
	};

	let endOptions = {};
	$: endOptions = {
		enableTime: true,
		minDate: start,
		defaultDate: start,
	};

	let isValid = false;
	let existingReservations: Reservation[] = [];
	$: existingReservations = reservations.filter(r =>
			r.reservation_start <= end && r.reservation_end >= start
		);
	$: isValid = resourceId && start && end && start <= end && reservations && existingReservations.length === 0;

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		// @ts-ignore-line
		const description = form?.elements?.description?.value;

		loading = true;

		try {
			await fetch(address('reservations'), {
				...fetchConfig(),
				method: 'POST',
				body: JSON.stringify({
					resource_id: resourceId,
					reservation_start: start,
					reservation_end: end,
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
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--border-color);
		padding: 2em;
		margin: 1em auto;
	}

	form.loading {
		cursor: wait;
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
