<section>
	<form on:submit={handleSubmit}>

		<label>
			Resource
			<select bind:value={resourceId} required>
				<option disabled></option>
				{#each $resources as resource}
					<option value={resource.id}>{resource.name}</option>
				{/each}
			</select>
		</label>

		<label>
			Start
			<Flatpickr options={startOptions} bind:value={start} required />
		</label>

		<label>
			End
			<Flatpickr options={endOptions} bind:value={end} required />
		</label>

		<label>
			Note
			<textarea name="description"></textarea>
		</label>

		<button type="submit" disabled={!isValid}>
			Submit
		</button>
	</form>
</section>

<script type="typescript">
	import { createEventDispatcher } from 'svelte';
	import Flatpickr from 'svelte-flatpickr/src/Flatpickr.svelte';
	import 'flatpickr/dist/flatpickr.css';

	import { Reservation, Resource } from '../../types.js';
	import { address, fetchConfig, fetchReservations } from '../../utils.js';
	import { resources } from '../../stores.js';

	export let resourceId: number | string = undefined;
	export let reservations: Reservation[] = undefined;
	export let start: Date = undefined;
	export let end: Date = undefined;

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

	if (!reservations) {
		fetchReservations().then(r => {
			reservations = r;
		});
	}

	let isValid = false;
	$: isValid = resourceId && start && end && start <= end && reservations && canReserve(start, end, reservations);

	const dispatch = createEventDispatcher();

	function canReserve(start: Date, end: Date, reservations: Reservation[]): boolean {
		return !reservations.some(r =>
			r.reservation_start <= end && r.reservation_end >= start
		);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
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
