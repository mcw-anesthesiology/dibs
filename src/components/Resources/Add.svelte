<form on:submit={handleSubmit} class:loading>
	<label>
		Name
		<input type="text" bind:value={name} disabled={loading} />
	</label>

	<label>
		Description
		<textarea bind:value={description} disabled={loading}></textarea>
	</label>

	<div class="button-container">
		<button type="submit" disabled={loading || !isValid}>
			Add resource
		</button>
	</div>

	{#if error}
		<aside class="error-container">
			<p>
				Sorry, there was a problem adding the resource.
			</p>
		</aside>
	{/if}
</form>

<script type="typescript">
	import { router } from 'tinro';

	import { address, fetchConfig } from '../../utils.js';

	let name = '';
	let description = '';

	let loading = false;
	let error: Error;

	let isValid: boolean;
	$: isValid = Boolean(name);

	async function handleSubmit(event: Event) {
		event.preventDefault();


		loading = true;

		try {
			await fetch(address('resources'), {
				...fetchConfig(),
				method: 'POST',
				body: JSON.stringify({
					name,
					description
				})
			});
			router.goto('/resources');
		} catch (err) {
			console.error(err);
			error = err;
		}

		loading = false;
	}
</script>

<style>
	form {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	form.loading {
		cursor: wait;
	}

	.button-container {
		width: 100%;
	}
</style>
