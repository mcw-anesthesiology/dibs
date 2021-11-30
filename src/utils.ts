import { generateFromString } from 'generate-avatar';
import stc from 'string-to-color';
import download from 'downloadjs';

import {
	User,
	Resource,
	Reserver,
	Reservation,
	RecurrenceType,
} from './types.js';
import { parseDate, dateString } from './date-utils.js';

export * from './date-utils.js';

export async function sleep(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

function getRestNonce() {
	const meta = document.querySelector(
		'meta[name="wp_rest"]'
	) as HTMLMetaElement;

	if (meta) return meta.content;

	console.error('Error getting wp_rest nonce');
}

export function address(path: string): string {
	if (path.startsWith('/')) {
		path = path.substring(1);
	}

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

function getParams(obj: Record<string, any>): URLSearchParams {
	const params = new URLSearchParams();

	for (const [key, val] of Object.entries(obj)) {
		if (val) {
			if (val instanceof Date) {
				params.set(key, dateString(val));
			} else {
				params.set(key, val.toString());
			}
		}
	}

	return params;
}

async function fetchRecords(
	table: string,
	params?: Record<string, any>
): Promise<any> {
	let url = address(table);
	if (params) {
		url += '?' + getParams(params).toString();
	}

	return fetch(url, {
		...fetchConfig(),
	}).then(r => r.json());
}

export async function fetchMe(): Promise<User> {
	return fetchRecords('me') as Promise<User>;
}

export async function fetchUsers(): Promise<User[]> {
	return fetchRecords('users') as Promise<User[]>;
}

export async function fetchResources(
	params?: Record<string, any> | null
): Promise<Resource[]> {
	return fetchRecords('resources', params).then(r =>
		r.map(transformResource)
	);
}

export async function fetchResource(id: string | number): Promise<Resource> {
	return fetchRecords(`resources/${id}`).then(transformResource);
}

export async function fetchReservers(
	params?: Record<string, any> | null
): Promise<Reserver[]> {
	return fetchRecords('reservers', params) as Promise<Reserver[]>;
}

export async function fetchReservations(
	params?: Record<string, any> | null
): Promise<Reservation[]> {
	return fetchRecords('reservations', params).then(r =>
		r.map(transformReservation)
	);
}

export async function fetchReservation(
	id: string | number
): Promise<Reservation> {
	return fetchRecords(`reservations/${id}`).then(transformReservation);
}

export function transformResource(obj: any): Resource {
	return transformDates(obj, ['updated_at', 'archived_at']) as Resource;
}

export function transformReservation(obj: any): Reservation {
	return transformDates(obj, [
		'reservation_start',
		'reservation_end',
		'created_at',
		'updated_at',
		'deleted_at',
	]) as Reservation;
}

function transformDates(obj: any, keys: string[]): any {
	for (const key of keys) {
		if (obj[key]) {
			obj[key] = parseDate(obj[key]);
		}
	}

	return obj;
}

export function getAvatar(resource: Resource): string {
	if (resource.image) return resource.image;

	const uid = `${resource.id}-${resource.name}`;
	return `data:image/svg+xml;utf8,${generateFromString(uid)}`;
}

export function getColor(resource: Resource): string {
	return resource.color ?? stc(resource.name);
}

const PRINTER_ENDPOINT = 'https://printer.mcw-anesth.tech';

export async function printElement(
	target: Element,
	filename = 'download.pdf',
	options = {}
) {
	// Set value attributes for input elements
	const inputElements = Array.from(
		target.querySelectorAll(
			'input:not([type="checkbox"]):not([type="radio"]), textarea'
		)
	) as HTMLInputElement[];
	for (const el of inputElements) {
		el.setAttribute('value', el.value);
	}

	const checkableElements = Array.from(
		target.querySelectorAll('input[type="checkbox"], input[type="radio"]')
	) as HTMLInputElement[];
	for (const el of checkableElements) {
		if (el.checked) {
			el.setAttribute('checked', 'checked');
		} else {
			el.removeAttribute('checked');
		}
	}

	const body = `<html id="printer"><body><main>${target.outerHTML}</main></body></html>`;

	const styles = Array.from(document.styleSheets)
		.filter(styleSheet => !styleSheet.disabled)
		.map(styleSheet => {
			if (styleSheet.href) {
				return { url: styleSheet.href };
			}

			try {
				return {
					content: Array.from(styleSheet.cssRules)
						.map(rule => rule.cssText)
						.join(' '),
				};
			} catch (err) {
				console.error(err);
			}
		});

	styles.push({
		content: `html#printer, html#printer body, html#printer main { margin: 0 !important; padding: 0 !important; width: unset !important; height: unset !important; min-width: unset !important; min-height: unset !important; }`,
	});
	styles.push({ content: `html#printer main { padding: 0 1em; }` });

	const response = await fetch(PRINTER_ENDPOINT, {
		method: 'POST',
		body: JSON.stringify({
			body,
			styles,
			options,
		}),
	});

	if (!response.ok) {
		throw new Error(response.status.toString());
	}

	download(await response.blob(), filename, 'application/pdf');
}
