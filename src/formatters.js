export const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
});

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
});

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
	hour: 'numeric',
	minute: 'numeric',
});

export const percentFormatter = new Intl.NumberFormat('en-US', {
	style: 'percent',
});

export const longPercentFormatter = new Intl.NumberFormat('en-US', {
	style: 'percent',
	maximumFractionDigits: 3,
	minimumFractionDigits: 3,
});

export const decimalFormatter = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 3,
});

export function useFormatter(formatter, x) {
	try {
		return formatter.format(x);
	} catch (e) {
		console.error(e);
		return '';
	}
}

export function formatDate(d) {
	return useFormatter(dateFormatter, d);
}

export function formatPercent(x) {
	return useFormatter(percentFormatter, x);
}

export function formatLongPercent(x) {
	return useFormatter(longPercentFormatter, x);
}

export function formatDecimal(x) {
	return useFormatter(decimalFormatter, x);
}
