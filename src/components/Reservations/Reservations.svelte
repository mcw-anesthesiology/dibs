<section>
	<nav>
		<ul>
			<li>
				<a href="/#{$router.path}#list" class:active={$router.hash !== 'calendar'}>
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
				<a class="dibs-outline-button" href="/#{$router.path}/reserve#{$router.hash}">
					Add ➕
				</a>
			</Route>
			<Route path="/reserve" let:meta>
				<Add {resourceId} start={meta.query?.start ? new Date(decodeURIComponent(meta.query.start)) : undefined} end={meta.query?.end ? new Date(decodeURIComponent(meta.query.end)) : undefined} on:submit={handleAdd} on:close={handleBack} />
			</Route>
		</div>
	{/if}
</section>

<script type="typescript">
	import { Route, router } from 'tinro';

	import List from './List.svelte';
	import Calendar from './Calendar.svelte';
	import Add from './Add.svelte';

	export let resourceId: string = undefined;
	export let canReserve = false;

	let list: List;
	let calendar: Calendar;

	function handleBack() {
		router.goto($router.url.replace('/reserve', ''));
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
		flex-direction: column;
		justify-content: center;
		align-items: center;
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

	.reserve-container {
		margin-top: 2em;
	}
</style>
