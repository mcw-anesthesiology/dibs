<form on:submit={handleSubmit} class:loading>
	<label>
		Image
		<input type="file" disabled={loading} on:change={handleImageChange} />
	</label>
	<label>
		Name
		<input type="text" bind:value={name} disabled={loading} required />
	</label>

	<label>
		Description
		<textarea bind:value={description} disabled={loading}></textarea>
	</label>

	<div class="button-container">
		<button type="submit" disabled={loading || !isValid}>
			Submit
		</button>

		<button type="button" on:click={handleCancel}>
			Cancel
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
	import { createEventDispatcher } from 'svelte';

	import { address, fetchConfig } from '../../utils.js';

	const dispatch = createEventDispatcher();

	let name = '';
	let description = '';
	let image = '';

	let loading = false;
	let error: Error;

	let isValid: boolean;
	$: isValid = Boolean(name);

	async function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files[0];
		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				image = reader.result as string;
			});
			reader.readAsDataURL(file);
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		loading = true;

		try {
			await fetch(address('resources'), {
				...fetchConfig(),
				method: 'POST',
				body: JSON.stringify({
					name,
					description,
					image,
				})
			});
			dispatch('submit');
		} catch (err) {
			console.error(err);
			error = err;
		}

		loading = false;
	}

	function handleCancel() {
		dispatch('close');
	}
</script>

<style>
	form {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}

	form.loading {
		cursor: wait;
	}

	label {
		text-align: left;
	}

	label ~ label {
		margin-top: 1em;
	}

	.button-container {
		width: 100%;
	}
</style>
