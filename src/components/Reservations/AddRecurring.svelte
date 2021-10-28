<form bind:this={form} on:submit={handleSubmit} class:loading>
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

	<fieldset>
		<legend>Recurrence type</legend>

		<label>
			<input type="radio" bind:group={recurrenceType} value={RecurrenceType.Weekly} />
			Weekly
		</label>
		<label>
			<input type="radio" bind:group={recurrenceType} value={RecurrenceType.MonthlyDate} />
			Monthly
		</label>
		<label>
			<input type="radio" bind:group={recurrenceType} value={RecurrenceType.MonthlyWeekDay} />
			Custom
		</label>
	</fieldset>

	<label>
		Until
		<Flatpickr {options} bind:value={recurringUntil} />
	</label>

	<label class="note">
		Note
		<textarea bind:value={description} disabled={loading}></textarea>
	</label>

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

	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import { RecurrenceType, Reservation } from '../../types.js';
	import { resources } from '../../stores.js';
	import { address, fetchConfig, fetchReservations, dateTimeString } from '../../utils.js';

	export let showResourceSelector = false;
	export let resourceId: number | string = undefined;

	let form: HTMLFormElement;

	const dispatch = createEventDispatcher();

	onMount(() => {
		form?.scrollIntoView();
	});

	const today = new Date();
	let reservations: Reservation[] = [];
	$: reload(recurringUntil);

	async function reload(until: Date) {
		if (!until) {
			reservations = [];
			return;
		}

		loadingReservations = true;
		try {
			reservations = await fetchReservations({
				resource_id: resourceId,
				before: dateTimeString(until),
				after: dateTimeString(today),
			});
		} catch (err) {
			console.error(err);
		}
		loadingReservations = false;
	}


	let recurrenceType: RecurrenceType = RecurrenceType.MonthlyDate;
	let recurringUntil: Date;
	let description = '';

	let loading = false;
	let loadingReservations = false;
	let isValid = false;
	$: isValid = !loading && !loadingReservations && recurrenceType && recurringUntil && recurringUntil > today;

	const options = {
		minDate: today
	};

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;

		try {
			dispatch('submit');
		} catch (err) {
			console.error(err);
		}

		loading = false;
	}
</script>

<style>
	form.loading {
		cursor: wait;
	}
</style>
