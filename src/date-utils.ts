import { DateString, RecurrenceType } from './types.js';

// WordPress ignores timezones, assume received date is UTC
export function parseDate(date: DateString): Date {
	const d = new Date(date);
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d;
}

export function getDatePart(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

export function dateString(date: Date): string {
	const s = date.toISOString();
	return s.substring(0, s.indexOf('T'));
}

export function dateStringLocal(date: Date): string {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function dateTimeString(date: Date): string {
	return date.toISOString();
}

export function thisMonth(): [Date, Date] {
	const after = new Date();
	const before = new Date();
	after.setDate(1);
	before.setMonth(before.getMonth() + 1, 0);

	return [after, before];
}

export function combineDateTime(date: Date, time: Date): Date | undefined {
	if (!date || !time) return undefined;

	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		time.getHours(),
		time.getMinutes(),
		time.getSeconds()
	);
}

export function getWeekdayNumber(date: Date): number {
	return Math.floor(date.getDate() / 7);
}

export function getWeekdayNumberFromEnd(date: Date): number {
	const end = getEndOfMonth(date);
	return Math.floor((end.getDate() - date.getDate()) / 7);
}

export function getWeekOfMonth(date: Date): number {
	const start = getStartOfMonth(date);
	let week = Math.floor(date.getDate() / 7);
	if (date.getDay() < start.getDay()) {
		week++;
	}

	return week;
}

export function getStartOfMonth(date: Date): Date {
	const d = new Date(date);
	d.setDate(1);
	return d;
}

export function getEndOfMonth(date: Date): Date {
	const d = new Date(date);
	d.setMonth(d.getMonth() + 1, 0);
	return d;
}

export function getWeekOfMonthFromEnd(date: Date): number {
	const end = getEndOfMonth(date);
	let week = Math.floor((end.getDate() - date.getDate()) / 7);
	if (date.getDay() > end.getDay()) {
		week++;
	}

	return week;
}

export function getRecurrenceDates(
	startDate: Date,
	endDate: Date,
	recurrenceType: RecurrenceType
): Date[] {
	const dates: Date[] = [];

	let d = getDatePart(startDate);

	switch (recurrenceType) {
		case RecurrenceType.Daily:
			while (d <= endDate) {
				dates.push(new Date(d));
				d.setDate(d.getDate() + 1);
			}
			break;
		case RecurrenceType.Weekly:
			while (d <= endDate) {
				dates.push(new Date(d));
				d.setDate(d.getDate() + 7);
			}
			break;
		case RecurrenceType.MonthlyDate:
			{
				let month = d.getMonth();
				let i = 0;
				while (d <= endDate && i < 100) {
					i++;
					if (d.getDate() === startDate.getDate()) {
						dates.push(new Date(d));
					}
					d.setMonth(++month, startDate.getDate());
					month = month % 12;
				}
			}
			break;
		case RecurrenceType.MonthlyWeekDayStart:
			{
				let month = d.getMonth();
				const dayOfWeek = d.getDay();
				const weekdayNum = getWeekdayNumber(d);
				let i = 0;
				while (d <= endDate && i < 100) {
					i++;
					if (d.getMonth() === month) {
						dates.push(new Date(d));
					}
					d.setMonth(++month, 1 + weekdayNum * 7);

					month = month % 12;

					let diff = dayOfWeek - d.getDay();
					if (diff < 0) {
						diff += 7;
					}

					d.setDate(d.getDate() + diff);
				}
			}
			break;
		case RecurrenceType.MonthlyWeekDayEnd:
			{
				let month = d.getMonth();
				const dayOfWeek = d.getDay();
				const weekdayNumFromEnd = getWeekdayNumberFromEnd(d);
				let i = 0;
				while (d <= endDate && i < 100) {
					i++;
					dates.push(new Date(d));
					d.setMonth(++month + 1, weekdayNumFromEnd * -7);
					month = month % 12;
					let diff = d.getDay() - dayOfWeek;
					if (diff < 0) {
						diff += 7;
					}

					d.setDate(d.getDate() - diff);
				}
			}
			break;
		case RecurrenceType.Yearly:
			{
				let year = d.getFullYear();
				let i = 0;
				while (d <= endDate && i < 100) {
					i++;
					if (
						d.getMonth() === startDate.getMonth() &&
						d.getDate() === startDate.getDate()
					) {
						dates.push(new Date(d));
					}
					d.setFullYear(
						++year,
						startDate.getMonth(),
						startDate.getDate()
					);
				}
			}
			break;
	}

	return dates;
}
