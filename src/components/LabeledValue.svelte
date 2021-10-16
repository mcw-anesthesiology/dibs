<div class="labeled-value">
	<span class="label">{label}</span>
	<span class="value"><slot></slot></span>
</div>

<script>
	export let label;
</script>

<style>
	div {
		display: flex;
		flex-direction: column;
		margin: 0.5em;
	}

	.label {
		color: #888;
		font-size: 0.9em;
	}
</style>
