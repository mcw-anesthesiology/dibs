<section bind:this={container} class="dibs-calendar" class:printing>
	<FullCalendar bind:this={calendarRef} {options} />
</section>

<div class="button-container">
	<button type="button" class="dibs-outline-button" on:click={handlePrint} disabled={printing} class:printing>
		Download current calendar view as PDF
	</button>
</div>

<script type="typescript">
	import { tick } from 'svelte';
	import { router } from 'tinro';
	import FullCalendar, { EventInput, CalendarOptions } from 'svelte-fullcalendar';
	import daygrid from '@fullcalendar/daygrid';
	import timegrid from '@fullcalendar/timegrid';
	import interaction, { DateClickArg } from '@fullcalendar/interaction';

	import { Resource, Reservation } from '../../types.js';
	import { address, fetchResource, transformReservation, getColor, sleep } from '../../utils.js';
	import { userGetter, resourceGetter } from '../../stores.js';
	import { printElement } from '../../utils.js';

	export let resourceId: string | undefined;

	let container: HTMLElement;

	let resource: Resource;
	$: getResource(resourceId);

	async function getResource(resourceId: string | undefined) {
		resource = resourceId ? await fetchResource(resourceId) : undefined;
	}

	let calendarRef: FullCalendar;

	export function handleReload() {
		calendarRef?.getAPI()?.refetchEvents();
	}

	let getTitle: (_: Reservation) => string;
	$: getTitle = reservation => {
		const user = $userGetter(reservation.user_id);

		let title = user?.name ?? '';

		if (!resourceId) {
			const resource = $resourceGetter(reservation.resource_id);
			if (resource) {
				title = resource.name + ' — ' + title;
			}
		}

		if (reservation.description) {
			title += ': ' + reservation.description;
		}

		return title;
	};

	let eventDataTransform: (_: any) => EventInput;
	$: eventDataTransform = obj => {
		const reservation = transformReservation(obj);

		const eventData: EventInput = {
			title: getTitle(reservation),
			start: reservation.reservation_start,
			end: reservation.reservation_end,
		};

		if (!resource) {
			const resource = $resourceGetter(reservation.resource_id);
			if (resource) {
				eventData.color = getColor(resource);
			}
		}

		return eventData;
	};

	let dateClick: (_: DateClickArg) => void;
	$: dateClick = info => {
		if (!resource?.can_reserve) return;

		if (info.date) {
			const params = new URLSearchParams({ start: info.date.toISOString() });
			let path = $router.path;
			if (!path.endsWith('/reserve')) {
				path += '/reserve';
			}
			path += `?${params}#calendar`;

			router.goto(path);
		}
	};

	let extraParams: any;
	$: extraParams = resourceId
		? {
			resource_id: resourceId
		}
		: undefined;

	let options: CalendarOptions;
	$: options = {
		height: printing ? 'auto' : undefined,
		initialView: 'timeGridWeek',
		plugins: [daygrid, timegrid, interaction],
		allDaySlot: false,
		slotMinTime: printing ? '06:00:00' : '00:00:00',
		slotMaxTime: printing ? '18:00:00' : '24:00:00',
		slotDuration: '00:15:00',
		slotLabelInterval: '01:00',
		scrollTime: '08:00:00',
		eventColor: resource ? getColor(resource) : undefined,
		headerToolbar: {
			center: 'dayGridMonth,timeGridWeek,dayGridWeek',
		},
		buttonText: {
			timeGridWeek: 'Schedule',
			dayGridMonth: 'Month',
			dayGridWeek: 'List',
			today: 'Today',
		},
		events: {
			url: address('reservations'),
			timeZoneParam: 'America/Chicago',
			extraParams,
		},
		eventDataTransform,
		dateClick,
		displayEventEnd: true,
		eventDisplay: 'block',
	};

	let printing = false;

	async function handlePrint() {
		printing = true;

		try {
			await tick();
			const calendar = calendarRef.getAPI();
			calendar.updateSize();
			calendar.render();
			const gridView = calendar.view.type === 'timeGridWeek';

			for (const styleSheet of document.styleSheets) {
				if (styleSheet.href && !styleSheet.href.includes('dibs')) {
					styleSheet.disabled = true;
				}
			}

			container.scrollIntoView();

			await sleep(500);
			await tick();
			await sleep(500);
			await printElement(container, 'calendar.pdf', {
				landscape: !gridView,
				scale: gridView ? 0.7 : 0.85,
				printBackground: true,
			});

			for (const styleSheet of document.styleSheets) {
				if (styleSheet.href && !styleSheet.href.includes('dibs')) {
					styleSheet.disabled = false;
				}
			}

			container.scrollIntoView();

		} catch (err) {
			console.error(err);
		} finally {
			printing = false;
			await tick();
			await sleep(500);
			const calendar = calendarRef?.getAPI();
			calendar?.updateSize();
			calendar?.render();
		}
	}
</script>

<style>
	section.printing {
		width: 1000px;
	}

	.button-container {
		margin: 1em;
		text-align: center;
	}

	button {
		opacity: 0.75;
	}

	button:hover {
		opacity: 1;
	}

	button.printing {
		cursor: wait;
	}

	section :global(.fc-daygrid-event) {
		white-space: normal;
	}

	section :global(.fc-h-event .fc-event-main-frame) {
		flex-wrap: wrap;
	}

	@media print {
		section {
			max-width: 100%;
		}

		section :global(.fc h2.fc-toolbar-title) {
			font-size: 1.75em;
			margin: 0 !important;
		}

		section :global(.fc-button) {
			display: none;
		}
	}
</style>
