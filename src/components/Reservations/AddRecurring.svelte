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

		<fieldset>
			<legend>Recurrence type</legend>

			{#each Object.values(RecurrenceType) as rType}
				<label>
					<input type="radio" bind:group={recurrenceType} value={rType} />
					{renderRecurrenceType(rType)}
				</label>
			{/each}
		</fieldset>

		<fieldset class="dates-container">
			<DateTimeInput label="First reservation" bind:start={firstStart} bind:end={firstEnd} minDate={today} />

			<label>
				Recurring until
				<Flatpickr {options} bind:value={until} disabled={!firstEnd} />
			</label>
		</fieldset>

		<label class="note">
			Note
			<textarea bind:value={description} disabled={loading}></textarea>
		</label>
	</div>

	{#if recurrences?.length > 0}
		<aside>
			<p>Reservations to add:</p>
			<ol>
				{#each recurrences as block}
					<RecurrenceListItem {block} reservations={getReservations(block, reservations)} on:reload={handleReload} />
				{/each}
			</ol>
		</aside>
	{/if}


	{#if error}
		<div class="error-container">
			<button type="button" class="dismiss" aria-label="Dismiss" on:click={() => { error = null; }}>×</button>
			<p>
				Sorry, there was a problem adding your reservations.
			</p>
		</div>
	{/if}

	{#if response}
		<div class="response-container">
			{#if response.added?.length > 0}
				<p>
					Successfully added {response.added.length} reservations.
				</p>
			{/if}

			{#if response.notAdded?.length > 0}
				<div class="error-container">
					<p>Failed adding reservations:</p>

					<ol>
						{#each response.notAdded as block}
							<DateTimeRange {...block} />
						{/each}
					</ol>
				</div>
			{/if}

			<button type="button" on:click={() => { dispatch('close'); }}>
				Close
			</button>
		</div>
	{:else}
		<div class="button-container">
			<button type="submit" disabled={!isValid}>
				Reserve
			</button>

			<button type="button" on:click={() => { dispatch('close'); } }>
				Cancel
			</button>
		</div>
	{/if}
</form>

<script type="typescript">
	import { onMount, createEventDispatcher } from 'svelte';
	import Flatpickr from 'svelte-flatpickr';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import DateTimeInput from '../DateTimeInput.svelte';
	import DateTimeRange from '../DateTimeRange.svelte';
	import RecurrenceListItem from './RecurrenceListItem.svelte';

	import { RecurrenceType, RecurrenceResponse, Reservation, Block } from '../../types.js';
	import { resources } from '../../stores.js';
	import { address, fetchConfig, fetchReservations, renderRecurrenceType } from '../../utils.js';
	import { getDatePart, combineDateTime, dateTimeString, getRecurrenceDates } from '../../date-utils.js';

	export let showResourceSelector = false;
	export let resourceId: number | string = undefined;

	let form: HTMLFormElement;

	const dispatch = createEventDispatcher();

	onMount(() => {
		form?.scrollIntoView();
	});

	const today = getDatePart(new Date());
	let reservations: Reservation[] = [];

	let recurrenceType: RecurrenceType = RecurrenceType.MonthlyDate;
	let firstStart: Date;
	let firstEnd: Date;
	let until: Date;
	let description = '';

	$: reload(until, firstStart);

	async function reload(until: Date, firstStart: Date) {
		if (!until) {
			reservations = [];
			return;
		}

		loadingReservations = true;
		try {
			reservations = await fetchReservations({
				resource_id: resourceId,
				before: dateTimeString(until),
				after: dateTimeString(firstStart),
			});
		} catch (err) {
			console.error(err);
		}
		loadingReservations = false;
	}

	function handleReload() {
		reload(until, firstStart);
		dispatch('reload');
	}

	function isReserved(block: Block, reservations: Reservation[]): boolean {
		return reservations.some(reservation =>
			reservation.reservation_start <= block.end
			&& reservation.reservation_end >= block.start
		);
	}

	function getReservations(block: Block, reservations: Reservation[]): Reservation[] {
		return reservations.filter(reservation =>
			reservation.reservation_start <= block.end
			&& reservation.reservation_end >= block.start
		);
	}

	let loading = false;
	let loadingReservations = false;
	let isValid = false;
	$: isValid = !loading && !loadingReservations && resourceId && recurrenceType && firstStart && firstEnd && until && until > firstEnd && firstEnd >= today && availableRecurrences.length > 0;

	let recurrences: Block[] = [];
	$: recurrences = getRecurrenceDates(firstStart, until, recurrenceType)
		.map(date => ({
			start: combineDateTime(date, firstStart),
			end: combineDateTime(date, firstEnd)
		}));
	let availableRecurrences: Block[] = [];
	$: availableRecurrences = recurrences.filter(block => !isReserved(block, reservations));

	let options: flatpickr.Options.Options;
	$: options = {
		minDate: firstEnd || today,
		clickOpens: Boolean(firstEnd)
	};

	let response: RecurrenceResponse;
	let error: Error;

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!isValid || response) return;

		loading = true;

		try {
			const r = await fetch(address('reservations/recurring'), {
				...fetchConfig(),
				method: 'POST',
				body: JSON.stringify({
					resource_id: resourceId,
					description,
					recurrences: availableRecurrences,
				})
			});
			dispatch('submit');

			if (!r.ok) throw new Error(await r.text());
			response = await r.json() as RecurrenceResponse;
		} catch (err) {
			console.error(err);
			error = err;
		}

		loading = false;
	}
</script>

<style>
	form {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--border-color);
		padding: 2em 1em;
		margin: 1em auto;
	}

	form.loading {
		cursor: wait;
	}

	.controls {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: flex-start;
	}

	.controls > * {
		margin: 0.5em;
	}

	fieldset {
		display: flex;
		flex-direction: column;
	}

	aside {
		margin: 1em 0;
	}

	form .button-container {
		margin-top: 2em;
	}

	.dates-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: none;
	}

	.dates-container > label {
		margin-top: 1em;
	}

	.dates-container > label :global(.flatpickr-input) {
		width: 12em;
	}

	.response-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
