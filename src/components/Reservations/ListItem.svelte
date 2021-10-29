<li class:showResource class:showCancel>
	{#if resource}
		<span class="resource-color" style="background-color: {getColor(resource)}"></span>
	{/if}

	{#if showResource}
		<span class="resource">
			{resource?.name ?? ''}
		</span>
	{/if}
	<LabeledValue label="Reserved by">
		{reserver?.name ?? ''}
	</LabeledValue>
	<LabeledValue label="Date">
		<RichDate date={reservation.reservation_start} />
	</LabeledValue>
	<LabeledValue label="Start">
		<RichDate date={reservation.reservation_start} timeOnly />
	</LabeledValue>
	<LabeledValue label="End">
		<RichDate date={reservation.reservation_end} timeOnly />
	</LabeledValue>
	<LabeledValue label="Note">
		<pre>{reservation.description ?? ''}</pre>
	</LabeledValue>

	{#if showCancel}
		<div class="button-container">
			<button type="button" on:click={handleCancel}>
				Cancel reservation
			</button>
			{#if reservation.recurrence_id}
				<button type="button" on:click={handleCancelSeries}>
					Cancel reservation and subsequent in series
				</button>
			{/if}
		</div>
	{/if}
</li>

<script type="typescript">
	import { createEventDispatcher } from 'svelte';

	import LabeledValue from '../LabeledValue.svelte';
	import RichDate from '../RichDate.svelte';

	import { User, Resource, Reservation } from '../../types.js';
	import { me, resourceGetter, userGetter } from '../../stores.js';
	import { address, fetchConfig, getColor } from '../../utils.js';
	import { formatDateTime } from '../../formatters.js';

	export let reservation: Reservation;
	export let showResource = false;

	const dispatch = createEventDispatcher();

	let reserver: User;
	$: reserver = $userGetter(reservation.user_id);

	let resource: Resource;
	$: resource = $resourceGetter(reservation.resource_id);

	const now = new Date();
	let showCancel = false;
	$: showCancel = ($me?.admin || $me?.id == reservation.user_id) && reservation.reservation_start > now;

	async function handleCancel() {
		if (!confirm(`Cancel the reservation for ${resource?.name} for ${formatDateTime(reservation.reservation_start)} – ${formatDateTime(reservation.reservation_end)}?`)) {
			return;
		}

		try {
			await fetch(address(`reservations/${reservation.id}`), {
				...fetchConfig(),
				method: 'DELETE'
			});
			dispatch('reload');
		} catch (err) {
			console.error(err);
			// TODO: Better alert
			alert('There was a problem cancelling the reservation.');
		}
	}

	async function handleCancelSeries() {
		if (!confirm(`Cancel the reservation for ${resource?.name} for ${formatDateTime(reservation.reservation_start)} – ${formatDateTime(reservation.reservation_end)}, and all subsequent reservations in the recurring reservation series?`)) {
			return;
		}

		try {
			await fetch(address(`reservations/recurring/${reservation.id}`), {
				...fetchConfig(),
				method: 'DELETE'
			});
			dispatch('reload');
		} catch (err) {
			console.error(err);
			// TODO: Better alert
			alert('There was a problem cancelling the reservations.');
		}
	}
</script>

<style>
	li {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 0.5em;
		border: 1px solid var(--border-color);
	}

	li:hover {
		background-color: rgba(0, 0, 0, 0.025);
	}

	.resource-color {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 5px;
	}

	.resource {
		font-size: 1.25em;
		padding: 0 1em;
	}

	@supports (display: grid) {
		li {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
		}

		li.showResource {
			grid-template-columns: repeat(7, 1fr);
		}
	}
</style>
