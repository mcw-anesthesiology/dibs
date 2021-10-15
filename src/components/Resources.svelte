<section>
	<h2>Resources</h2>

	<table>
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Description</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each resources as resource}
				<tr>
					<td>
						<a href="/#/resources/{resource.id}">
							{resource.id}
						</a>
					</td>
					<td>{resource.name}</td>
					<td>{resource.description}</td>
					<td></td>
				</tr>
			{:else}
				<tr>
					<td colspan="4">Loading...</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<script type="typescript">
	import { Resource } from '../types.js';
	import { fetchResources } from '../utils.js';

	let resources: Resource[] = [];

	fetchResources().then(r => {
		resources = r;
	});

</script>
