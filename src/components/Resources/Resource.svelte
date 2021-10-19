<section>
	{#if resource}
		<div class="row">
			<div class="details">
				<h2>{resource.name}</h2>

				<pre>{resource.description ?? ''}</pre>

				{#if $me?.admin}
					<div class="edit-container">
						{#if $router.hash === 'edit'}
							<Add {...resource} on:submit={handleEdit} on:close={handleClose} />
						{:else}
							<a class="dibs-outline-button" href="/#/resources/{resource.id}#edit">
								Edit
							</a>
						{/if}
					</div>
				{/if}
			</div>

			<div>
				<img src={getAvatar(resource)} alt="" />
			</div>
		</div>

		<section>
			<h3>Reservations</h3>

			<Reservations resourceId={id} />
		</section>
	{/if}
</section>

<script type="typescript">
	import { router } from 'tinro';

	import Add from './Add.svelte';
	import Reservations from '../Reservations/Reservations.svelte';

	import { Resource } from '../../types.js';
	import { me, resourceGetter, reloadResources } from '../../stores.js';
	import { getAvatar } from '../../utils.js';

	export let id: string;

	let resource: Resource = null;
	$: resource = $resourceGetter(id);

	function handleEdit() {
		reloadResources();
		handleClose();
	}

	function handleClose() {
		router.location.hash.clear();
	}
</script>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
	}

	.row > * {
		flex-basis: calc(50% - 2em);
		margin: 1em;
	}

	img {
		max-width: 100%;
	}

	.details {
		display: flex;
		flex-direction: column;
	}

	.edit-container {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.edit-container :global(form) {
		border: 1px solid var(--border-color);
		padding: 2em;
	}
</style>
