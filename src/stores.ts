import { derived, writable, Writable, Readable } from 'svelte/store';

import type { User, Reservation, Resource, Reserver } from './types.js';
import {
	fetchMe,
	fetchUsers,
	fetchReservations,
	fetchResources,
	fetchReservers,
} from './utils.js';

export const me: Writable<User | null> = writable(null, set => {
	fetchMe().then(me => {
		set(me);
	});
});

export const users: Writable<User[]> = writable([], set => {
	fetchUsers().then(users => {
		set(users);
	});
});

export const userMap: Readable<Map<string, User>> = derived(
	users,
	$users => new Map($users.map(u => [u.id.toString(), u]))
);

export const userGetter: Readable<(_: number | string) => User | null> =
	derived(
		userMap,
		$userMap => (id: number | string) => $userMap.get(id.toString())
	);

export const resources: Writable<Resource[]> = writable([], set => {
	fetchResources().then(resources => {
		set(resources);
	});
});

export const resourceMap: Readable<Map<string, Resource>> = derived(
	resources,
	$resources => new Map($resources.map(r => [r.id.toString(), r]))
);

export const resourceGetter: Readable<(_: number | string) => Resource | null> =
	derived(
		resourceMap,
		// eslint-disable-next-line eqeqeq
		$resourceMap => (id: number | string) => $resourceMap.get(id.toString())
	);

export const reservations: Writable<Reservation[]> = writable([], set => {
	fetchReservations().then(reservations => {
		set(reservations);
	});
});

export const reservers: Writable<Reserver[]> = writable([], set => {
	fetchReservers().then(reservers => {
		set(reservers);
	});
});

export const resourceReserversMap: Readable<Map<string, Reserver[]>> = derived(
	reservers,
	$reservers => {
		const map = new Map();

		for (const reserver of $reservers) {
			const resourceId = reserver.resource_id.toString();
			let arr = map.get(resourceId);
			if (!arr) {
				arr = [];
				map.set(resourceId, arr);
			}
			arr.push(reserver);
		}

		return map;
	}
);

export const resourceReserversGetter: Readable<
	(_: number | string) => Reserver[]
> = derived(
	resourceReserversMap,
	$map => (id: number | string) => $map.get(id.toString()) || []
);

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
