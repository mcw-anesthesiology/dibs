<section>
	<List bind:this={list} {resourceId} />

	{#if canReserve}
		<div>
			<Route path="/">
				<a class="dibs-outline-button" href="/#{$router.path}/reserve">
					Add ➕
				</a>
			</Route>
			<Route path="/reserve">
				<Add {resourceId} on:submit={handleAdd} on:close={handleBack} />
			</Route>
		</div>
	{/if}
</section>

<script type="typescript">
	import { Route, router } from 'tinro';

	import List from './List.svelte';
	import Add from './Add.svelte';

	export let resourceId: string = undefined;
	export let canReserve = false;

	let list: List;

	function handleBack() {
		router.goto($router.path.replace('/reserve', ''));
	}

	function handleAdd() {
		list.handleReload();
		handleBack();
	}
</script>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
