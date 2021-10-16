import type {
	User,
	Resource,
	ReserverRole,
	Reservation,
	Status,
	DateString,
} from './types.js';

function getRestNonce() {
	const meta = document.querySelector(
		'meta[name="wp_rest"]'
	) as HTMLMetaElement;

	if (meta) return meta.content;

	console.error('Error getting wp_rest nonce');
}

export function address(path: string): string {
	return `${import.meta.env.VITE_BASE_URL}${
		import.meta.env.VITE_API_PATH
	}/${path}`;
}

export function headers(): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		'X-WP-Nonce': getRestNonce(),
	};
}

export function fetchConfig(): Record<string, any> {
	return {
		headers: headers(),
		credentials: 'include',
	};
}

async function fetchRecords(
	table: string,
	params?: Record<string, string>
): Promise<any> {
	let url = address(table);
	if (params) {
		const search = new URLSearchParams(params);
		url += '?' + search.toString();
	}

	return fetch(url, {
		...fetchConfig(),
	}).then(r => r.json());
}

export async function fetchUsers(): Promise<User[]> {
	return fetchRecords('users') as Promise<User[]>;
}

export async function fetchResources(
	params?: Record<string, string> | null
): Promise<Resource[]> {
	return fetchRecords('resources', params) as Promise<Resource[]>;
}

export async function fetchResource(id: string | number): Promise<Resource> {
	return fetchRecords(`resources/${id}`).then(
		dateTransformer(['updated_at', 'archived_at'])
	) as Promise<Resource>;
}

export async function fetchReservers(
	params?: Record<string, string> | null
): Promise<ReserverRole[]> {
	return fetchRecords('reserver', params) as Promise<ReserverRole[]>;
}

export async function fetchReservations(
	params?: Record<string, string> | null
): Promise<Reservation[]> {
	return fetchRecords('reservations', params).then(r =>
		r.map(
			dateTransformer([
				'reservation_start',
				'reservation_end',
				'created_at',
				'updated_at',
				'deleted_at',
			])
		)
	) as Promise<Reservation[]>;
}

export async function fetchReservation(
	id: string | number
): Promise<Reservation> {
	return fetchRecords(`reservations/${id}`) as Promise<Reservation>;
}

function dateTransformer(fields: string[]): (obj: any) => any {
	return obj => transformDates(obj, fields);
}

function transformDates(obj: any, keys: string[]): any {
	for (const key of keys) {
		if (obj[key]) {
			obj[key] = parseDate(obj[key]);
		}
	}

	return obj;
}

export function parseDate(date: DateString): Date {
	return new Date(date);
}
