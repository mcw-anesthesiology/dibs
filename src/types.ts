export type DateString = string;

export interface User {
	id: string;
	name: string;
	admin: boolean;
}

export interface Resource {
	id: string; // Not sure why wordpress is giving me these as strings
	name: string;
	image: string | null;
	description: string | null;
	updated_at: Date;
	archived_at: Date | null;
	can_reserve?: boolean;
}

export interface Reserver {
	id: string;
	resource_id: string;
	capability: string;
}

export interface Reservation {
	id: string;
	user_id: string;
	resource_id: string;
	reservation_start: Date;
	reservation_end: Date;
	description: string | null;
	status: Status;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date | null;
}

export enum Status {
	Submitted = 'submitted',
	Cancelled = 'cancelled',
}
