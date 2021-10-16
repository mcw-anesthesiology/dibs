<time datetime={dateObj?.toISOString()}>
	{useFormatter(formatter, dateObj)}
</time>

<script>
	import { parseDate } from '../utils.js';
	import { useFormatter, dateFormatter, dateTimeFormatter } from '../formatters.js';

	export let date;
	export let showTime = false;
	let formatter;

	let dateObj;
	$: dateObj = date instanceof Date ? date : parseDate(date);

	$: formatter = showTime ? dateTimeFormatter : dateFormatter;
</script>
