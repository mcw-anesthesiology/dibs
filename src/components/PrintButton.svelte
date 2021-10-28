<button class="dibs-outline-button" on:click={handleClick} disabled={loading} class:loading>
	<slot>Print</slot>
</button>

<script type="typescript">
	import { printElement } from '../utils.js';

	export let target: Element | string;
	export let filename = 'download.pdf', landscape = false, options = {};

	let loading = false;

	async function handleClick() {
		const element = typeof target === 'string' ? document.querySelector(target) : target;

		loading = true;
		printElement(element, filename, {
			landscape,
			...options
		}).finally(() => {
			loading = false;
		});
	}
</script>

<style>
	button.loading {
		cursor: wait;
	}
</style>
