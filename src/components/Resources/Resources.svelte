<section>
	<h2>Resources</h2>

	<nav>
		<ul>
			<li>
				<a href="/#/resources/add">
					Add
				</a>
			</li>
		</ul>
	</nav>

	<table>
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			{#each resources as resource}
				<tr on:click|stopPropagation={() => { router.goto(`/resources/${resource.id}`) }}>
					<td>
						<a href="/#/resources/{resource.id}">
							{resource.id}
						</a>
					</td>
					<td>{resource.name}</td>
					<td>{resource.description ?? ''}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="3">Loading...</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<script type="typescript">
	import { router } from 'tinro';

	import { Resource } from '../../types.js';
	import { fetchResources } from '../../utils.js';

	let resources: Resource[] = [];

	fetchResources().then(r => {
		resources = r;
	});
</script>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}

	tr {
		border: 1px solid var(--border-color);
	}

	tbody tr:hover {
		background-color: rgba(0, 0, 0, 0.05);
		cursor: pointer;
	}

	th, td {
		text-align: left;
		padding: 0.5em 1em;
	}
</style>
