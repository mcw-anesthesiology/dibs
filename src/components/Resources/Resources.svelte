<section>
	<ul class="resources-list">
		{#each $resources as resource}
			<li on:click={() => { router.goto(`/resources/${resource.id}`); }}>
				<img width="200" height="200" src={getAvatar(resource)} alt="" />

				<a href="/#/resources/{resource.id}">
					{resource.name}
				</a>

				<pre>{resource.description ?? ''}</pre>
			</li>
		{/each}
		{#if $me?.admin}
			{#if $router.hash === 'add'}
				<li class="add-form">
					<Add on:submit={handleAdd} on:close={handleClose} />
				</li>
			{:else}
				<li class="add-item" on:click={() => { router.location.hash.set('add'); }}>
					<div class="add-img"><span>+</span></div>

					<a href="/#/resources#add">
						Add new
					</a>
				</li>
			{/if}
		{/if}
	</ul>
</section>

<script type="typescript">
	import { router } from 'tinro';

	import Add from './Add.svelte';

	import { me, resources, reloadResources } from '../../stores.js';
	import { getAvatar } from '../../utils.js';

	function handleAdd() {
		reloadResources();
		handleClose();
	}

	function handleClose() {
		router.location.hash.clear();
	}
</script>

<style>
	.resources-list {
		width: 100%;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		justify-content: center;
	}

	.resources-list li {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--border-color);
		box-sizing: border-box;
		margin: 1em;
		padding: 1em;
		width: 250px;
		min-height: 250px;
		text-align: center;
	}

	.resources-list li:not(.add-form):hover {
		background-color: rgba(0, 0, 0, 0.05);
		cursor: pointer;
	}

	li img,
	li .add-img {
		width: 200px;
		height: 200px;
		margin-bottom: 0.5em;
	}

	img {
		object-fit: contain;
	}

	li.add-item {
		opacity: 0.5;
	}

	li.add-item:hover {
		opacity: 1;
	}

	.add-img {
		box-sizing: border-box;
		border: 2px dashed black;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.add-img span {
		font-size: 3em;
	}

	li a {
		font-size: 1.1em;
		margin: 0.5em 0;
	}

	@supports (display: grid) {
		.resources-list {
			display: grid;
			grid-gap: 2em;
			grid-template-columns: repeat(auto-fit, 250px);
		}

		.resources-list li {
			margin: 0;
		}
	}
</style>
