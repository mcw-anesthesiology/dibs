import { derived, writable, Writable, Readable } from 'svelte/store';

import { Reservation, Resource, ReserverRole } from './types.js';
import { fetchReservations, fetchResources, fetchReservers } from './utils.js';

export const resources: Writable<Resource[]> = writable([], set => {
	fetchResources().then(resources => {
		set(resources);
	});
});

export const resourceGetter: Readable<(_: number | string) => Resource | null> =
	derived(
		resources,
		// eslint-disable-next-line eqeqeq
		$resources => (id: number | string) => $resources.find(r => r.id == id)
	);

export const reservations: Writable<Reservation[]> = writable([], set => {
	fetchReservations().then(reservations => {
		set(reservations);
	});
});

export const reservers: Writable<ReserverRole[]> = writable([], set => {
	fetchReservers().then(reservers => {
		set(reservers);
	});
});

export function reloadResources() {
	updateStore(resources, fetchResources);
}

export function reloadReservations() {
	updateStore(reservations, fetchReservations);
}

export function reloadReservers() {
	updateStore(reservers, fetchReservers);
}

function updateStore<T>(store: Writable<T>, fetcher: () => Promise<T>) {
	fetcher().then(r => {
		store.set(r);
	});
}
