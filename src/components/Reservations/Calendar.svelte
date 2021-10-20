<section>
	<FullCalendar bind:this={calendarRef} {options} />
</section>

<script type="typescript">
	import { router } from 'tinro';
	import FullCalendar, { EventInput, CalendarOptions } from 'svelte-fullcalendar';
	import daygrid from '@fullcalendar/daygrid';
	import timegrid from '@fullcalendar/timegrid';
	import interaction, { DateClickArg } from '@fullcalendar/interaction';

	import { Resource, Reservation } from '../../types.js';
	import { address, fetchResource, transformReservation } from '../../utils.js';
	import { userGetter, resourceGetter } from '../../stores.js';

	export let resourceId: string;

	let resource: Resource;
	$: getResource(resourceId);

	async function getResource(resourceId: string) {
		resource = await fetchResource(resourceId);
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
		return {
			title: getTitle(reservation),
			start: reservation.reservation_start,
			end: reservation.reservation_end,
		};
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
		initialView: 'timeGridWeek',
		plugins: [daygrid, timegrid, interaction],
		allDaySlot: false,
		slotDuration: '00:15:00',
		slotLabelInterval: '01:00',
		scrollTime: '08:00:00',
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
	};
</script>
