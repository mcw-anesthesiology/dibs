<section>
	{#if resource}
		<h2>{resource.name}</h2>

		<pre>{resource.description ?? ''}</pre>

		<section>
			<h3>Reservations</h3>

			<Reservations resourceId={id} />
		</section>
	{/if}
</section>

<script type="typescript">
	import Reservations from '../Reservations/Reservations.svelte';

	import { Resource } from '../../types.js';
	import { resourceGetter } from '../../stores.js';

	export let id: string;

	let resource: Resource = null;
	$: resource = $resourceGetter(id);
</script>

<style>
</style>
