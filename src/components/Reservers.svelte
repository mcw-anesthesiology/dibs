<section>
	<h2>Reservers</h2>

	<table>
		<thead>
			<tr>
				<th colspan="2">Resource</th>
				<th>Capabilities</th>
			</tr>
		</thead>
		<tbody>
			{#each $resources as resource}
				<tr>
					<th class="resource-cell">
						<span class="resource-color" style="background-color: {getColor(resource)}"></span>
						{resource.name}
					</th>
					<td class="img-cell">
						<img width="150" height="150" src={getAvatar(resource)} alt="" />
					</td>
					<td>
						<ul>
							<li><code>{DIBS_ADMIN_CAP}</code></li>
							{#each $resourceReserversGetter(resource.id) as reserver}
								<li>
									<code>{reserver.capability}</code>
									<button type="button" on:click={handleRemoveCap} data-id={reserver.id}>
										Remove
									</button>
								</li>
							{/each}
							<li>
								<form on:submit={handleAddCap}>
									<input type="hidden" name="resource_id" value={resource.id} />
									<input type="text" name="capability" aria-label="Capability" placeholder="new_capability_name" required />
									<button type="submit">
										Add capability
									</button>
								</form>
							</li>
						</ul>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<p>
		Users with any of the capabilities listed for the given resource will be able to make reservations.
	</p>

	<aside>
		<p>
			All WordPress Administrators are automatically assigned the
			<code>{DIBS_ADMIN_CAP}</code> capability.
		</p>

		<p>
			Use
			<a href="https://wordpress.org/plugins/user-role-editor/">
				User Role Editor
			</a>
			to
			<a href="/wp-admin/users.php" tinro-ignore>
				assign the capabilities above to users
			</a>
			(from the <i>Custom capabilities</i> section).
		</p>
	</aside>
</section>

<script type="typescript">
	import { address, fetchConfig, getColor, getAvatar } from '../utils.js';
	import { resources, resourceReserversGetter, reloadReservers } from '../stores.js';

	const DIBS_ADMIN_CAP = 'dibs_admin';

	interface FormElements extends HTMLFormControlsCollection {
		resource_id: HTMLInputElement;
		capability: HTMLInputElement;
	}

	async function handleAddCap(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const elements = form.elements as FormElements;
		const capability = elements.capability.value;
		const resource_id = elements.resource_id.value;

		if (!capability || !resource_id) return;

		try {
			await fetch(address('reservers'), {
				...fetchConfig(),
				method: 'POST',
				body: JSON.stringify({
					resource_id,
					capability
				})
			});
			reloadReservers();
			form.reset();
		} catch (err) {
			console.error(err);
			// TODO: Maybe do something better than an alert
			alert('There was a problem adding the capability.');
		}
	}

	async function handleRemoveCap(event: Event) {
		const button = event.target as HTMLButtonElement;
		const id = button.dataset.id;
		if (!id) return;

		// TODO: Confirm deletion?

		try {
			await fetch(address(`reservers/${id}`), {
				...fetchConfig(),
				method: 'DELETE'
			});
			reloadReservers();
		} catch (err) {
			console.error(err);
			alert('There was a problem removing the capability');
		}
	}
</script>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 2em;
	}

	th, td {
		padding: 0.5em 1em;
		border: 1px solid var(--border-color);
	}

	th {
		text-align: left;
	}

	.resource-cell {
		position: relative;
		border-right: none;
		font-size: 1.25em;
	}

	.resource-color {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 5px;
	}

	.img-cell {
		border-left: none;
		text-align: right;
	}

	img {
		object-fit: contain;
	}

	ul {
		padding-left: 1em;
		margin: 0;
	}

	aside {
		margin-top: 2em;
	}

	input {
		font-family: monospace;
	}
</style>
