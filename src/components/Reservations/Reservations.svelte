<section>
	<nav>
		<ul>
			<li>
				<a href="/#{$router.path}" class:active={$router.hash !== 'calendar'}>
					List view
				</a>
			</li>
			<li>
				<a href="/#{$router.path}#calendar" class:active={$router.hash === 'calendar'}>
					Calendar view
				</a>
			</li>
		</ul>
	</nav>

	{#if $router.hash === 'calendar'}
		<Calendar bind:this={calendar} {resourceId} />
	{:else}
		<List bind:this={list} {resourceId} />
	{/if}

	{#if canReserve}
		<div class="reserve-container">
			<Route path="/">
				<a class="dibs-outline-button" href="/#{$router.path}/reserve{$router.hash ? `#${$router.hash}` : ''}">
					Add ➕
				</a>
				<a class="dibs-outline-button" href="/#{$router.path}/recurring{$router.hash ? `#${$router.hash}` : ''}">
					Add recurring ➰
				</a>
			</Route>
			<Route path="/reserve" let:meta>
				<Add {resourceId} start={meta.query?.start ? new Date(decodeURIComponent(meta.query.start)) : undefined} end={meta.query?.end ? new Date(decodeURIComponent(meta.query.end)) : undefined} on:submit={handleAdd} on:close={handleBack} />
			</Route>
			<Route path="/recurring">
				<AddRecurring {resourceId} on:submit={handleAdd} on:close={handleBack} />
			</Route>
		</div>
	{/if}
</section>

<script type="typescript">
	import { Route, router } from 'tinro';

	import List from './List.svelte';
	import Calendar from './Calendar.svelte';
	import Add from './Add.svelte';
	import AddRecurring from './AddRecurring.svelte';

	export let resourceId: string = undefined;
	export let canReserve = false;

	let list: List;
	let calendar: Calendar;

	function handleBack() {
		router.goto($router.url.replace('/reserve', '').replace('/recurring', ''));
		router.location.query.clear();
	}

	function handleAdd() {
		list?.handleReload();
		handleBack();
	}
</script>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 2em;
	}

	.dibs-outline-button {
		margin: 0.5em;
	}

	nav ul {
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
	}

	nav li {
		display: block;
		margin: 0.5em;
	}

	nav a.active {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
