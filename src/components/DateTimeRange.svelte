<span>
	<RichDate date={start} showTime />
	–
	<RichDate date={end} timeOnly />
</span>

<script type="typescript">
	import RichDate from './RichDate.svelte';

	export let start: Date;
	export let end: Date;
</script>
