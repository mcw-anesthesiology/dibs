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

		{#each Object.values(RecurrenceType) as rType}
			<label>
				<input type="radio" bind:group={recurrenceType} value={rType} />
				{renderRecurrenceType(rType)}
			</label>
		{/each}
	</fieldset>

	<div>
		<DateTimeInput label="Starting" bind:start={firstStart} bind:end={firstEnd} minDate={today} />

		<label>
			Until
			<Flatpickr {options} bind:value={until} disabled={!firstEnd} />
		</label>
	</div>

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
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import DateTimeInput from '../DateTimeInput.svelte';

	import { RecurrenceType, Reservation, renderRecurrenceType } from '../../types.js';
	import { resources } from '../../stores.js';
	import { address, fetchConfig, fetchReservations } from '../../utils.js';
	import { dateTimeString, getRecurrenceDates } from '../../date-utils.js';

	export let showResourceSelector = false;
	export let resourceId: number | string = undefined;

	let form: HTMLFormElement;

	const dispatch = createEventDispatcher();

	onMount(() => {
		form?.scrollIntoView();
	});

	const today = new Date();
	let reservations: Reservation[] = [];

	let recurrenceType: RecurrenceType = RecurrenceType.MonthlyDate;
	let firstStart: Date;
	let firstEnd: Date;
	let until: Date;
	let description = '';

	$: reload(until);

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

	let loading = false;
	let loadingReservations = false;
	let isValid = false;

	$: isValid = !loading && !loadingReservations && recurrenceType && firstStart && firstEnd && until && until > firstEnd && firstEnd >= today;

	$: if (firstStart && until) {
		console.log(getRecurrenceDates(firstStart, until, recurrenceType));
	}

	let options: flatpickr.Options.Options;
	$: options = {
		minDate: firstEnd || today,
		clickOpens: Boolean(firstEnd)
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
	form {
		display: flex;
		flex-wrap: wrap;
	}

	form.loading {
		cursor: wait;
	}

	fieldset {
		display: flex;
		flex-direction: column;
	}
</style>
