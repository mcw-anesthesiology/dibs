<div class="paginator">
	<button type="button" disabled={pageNumber == 0} on:click={() => { pageNumber = pageNumber - 1; }}>
		←
	</button>

	<label>
		Page
		<input type="number" value={pageNumber + 1} on:change={handlePageChange} />
	</label>

	<button type="button" disabled={!pagesRemaining} on:click={() => { pageNumber += 1; }}>
		→
	</button>
</div>

<script>
	export let limit = 10, offset = 0;
	export let pagesRemaining = true;

	let pageNumber = offset / limit;

	$: offset = pageNumber * limit;

	function handlePageChange(event) {
		const value = Number(event.target.value);
		if (Number.isNaN(value) || value < 1) return;

		pageNumber = value - 1;
	}
</script>
