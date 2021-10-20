<fieldset>
	<legend>{label}</legend>

	<div class="controls-container">
		<label class="date-control">
			Date
			<Flatpickr options={dateOptions} bind:value={date} {required} {disabled} />
		</label>

		<div class="times-container">
			<label>
				Start
				<Flatpickr options={startOptions} bind:value={startTime} {required} disabled={disabled || !date} />
			</label>
			–
			<label>
				End
				<Flatpickr options={endOptions} bind:value={endTime} {required} disabled={disabled || !date || !startTime} />
			</label>
		</div>
	</div>
</fieldset>

<script type="typescript">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';

	import { getDatePart, dateStringLocal } from '../utils.js';

	export let label = 'Date';
	export let required = false;
	export let disabled = false;
	export let minDate: Date = undefined;

	export let start: Date = undefined;
	export let end: Date = undefined;

	let date: Date = start;
	let startTime: Date = start;
	let endTime: Date = end;

	$: setEndTime(startTime);

	function setEndTime(startTime: Date) {
		if (!startTime) return;

		const d = new Date(startTime);
		d.setMinutes(d.getMinutes() + 30);
		endTime = d;
	}

	$: start = combineDateTime(date, startTime);
	$: end = combineDateTime(date, endTime);

	$: if (date && minDate && getDatePart(date) < getDatePart(minDate)) {
		console.log('what');
		date = undefined;
		startTime = undefined;
		endTime = undefined;
		start = undefined;
		end = undefined;
	}

	$: if (!date) {
		startTime = undefined;
		endTime = undefined;
	}

	const dateOptions = {
		minDate: dateStringLocal(minDate)
	};

	const startOptions = {
		enableTime: true,
		noCalendar: true,
		minuteIncrement: 15,
		dateFormat: 'h:i K',
	};

	let endOptions = {};
	$: endOptions = {
		...startOptions,
		minDate: startTime
	};

	function combineDateTime(date: Date, time: Date): Date | undefined {
		if (!date || !time) return undefined;

		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			time.getHours(),
			time.getMinutes(),
			time.getSeconds(),
		);
	}
</script>

<style>
	.controls-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.date-control :global(.flatpickr-input) {
		width: 6em;
	}

	.times-container {
		margin-top: 1em;
	}

	.times-container :global(.flatpickr-input) {
		width: 5em;
	}
</style>
