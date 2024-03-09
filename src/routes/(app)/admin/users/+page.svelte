
<script>
	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';

	const url_API = import.meta.env.VITE_API_SOCK;

	let page = parseInt(1);
	let total;
	async function fetchCategories() {
		try {
			const res = await dataAPI.get(`/categories`);
			categories = res.data.data;
			// total = res.data.pagination.totalPage;
			console.log(categories);
		} catch (error) {
			await Swal.fire({
				imageUrl: '/log-failed.svg',
				imageHeight: 130,
				imageAlt: 'A tall image',
				title: 'Oops!',
				text: 'An error occurred while fetching data'
			});
		}
	}

	let categories = null;
	let search = [];

	async function searchCategories() {
		folder = null;

		try {
			const res = await fetch(
				`${url_API}/backend/api/group/tata_usaha/search?page=${page}&record=10`,
				{
					method: 'POST',
					body: JSON.stringify({
						group_name: `%${search}%`
					}),

					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			).then((res) => res.json());
			folder = res.data;
			total = res.pagination.totalPage;
		} catch (error) {
			console.log(error);
		}
	}

	function handleSearchSubmitEnter(event) {
		if (event.key === 'Enter') {
			searchCategories();
		}
	}

	const handlePageChange = (e) => {
		page = e.detail;
		fetchFolder();
	};

	let cate_name = '';
	let cate_id = '';

	const handleSubmit = async () => {
		fetch(`${url_API}/categories/store`, {
			method: 'POST',
			body: JSON.stringify({
				cate_name: cate_name
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				console.log(response);
				if (response.status === 200) {
					await Swal.fire({
					icon: 'success',
					title: 'Your categories has been saved',
					showConfirmButton: false,
					timer: 1500
				});
				location.reload();
				} else {
					bootstrap.Modal.getInstance(document.getElementById('AddModal')).hide();
					await Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
				console.log(error);

				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	let updData = {};

	async function handleUpdateData(e) {
		const { groupId } = e.currentTarget.dataset;
		// let dateInmail = moment(updData.inmail_date * 100).format('MMM Do YY');
		try {
			const response = await dataAPI.get(`/backend/api/group/tata_usaha/${groupId}`);
			updData = response.data[0];
			// console.log(updData);
			cate_id = updData.cate_id;
			group_name = updData.group_name;
		} catch (error) {
			bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
			await Swal.fire({
				html: `
				<div class="d-flex align-items-center justify-content-center flex-column h-100">
					<img src="/log-failed.svg" width="150" height="150" />
					<h4 class="mb-0 mt-3 fw-semibold text-white">Oops!</h4>	
					<p class="mb-0 mt-2 fw-medium text-secondary">An error occurred while fetching data</p>
				</div>
			`,
				confirmButtonColor: '#596066',
				customClass: 'swal-height'
			});
		}
	}

	const updateData = async (event) => {
		event.preventDefault();
		const { groupId } = event.currentTarget.dataset;

		fetch(`${url_API}/backend/api/group/tata_usaha/${groupId}`, {
			method: 'PUT',
			body: JSON.stringify({
				group_name: group_name
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				console.log(response);
				if (response.status === 200) {
					bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
					await Swal.fire({
						html: `
				<div class="d-flex align-items-center justify-content-center flex-column h-100">
					<img src="/log-success.svg" width="150" height="150" />
					<h4 class="mb-0 mt-3 fw-semibold text-white">Create Folder successfully!</h4>
				</div>
			`,
						confirmButtonColor: '#596066',
						customClass: 'swal-height'
					});

					await searchFolder();
				} else {
					bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
					await Swal.fire({
						html: `
				<div class="d-flex align-items-center justify-content-center flex-column h-100">
					<img src="/log-failed.svg" width="150" height="150" />
					<h4 class="mb-0 mt-3 fw-semibold text-white">Oops!</h4>
					<p class="mb-0 mt-2 fw-medium text-secondary">An error occurred while saving data</p>
				</div>
			`,
						confirmButtonColor: '#596066',
						customClass: 'swal-height'
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleDelete = async (event) => {
		event.preventDefault();
		const { groupId } = event.currentTarget.dataset;

		fetch(`${url_API}/backend/api/group/tata_usaha/${groupId}`, {
			method: 'GET',

			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				console.log(response);
				// console.log(user_status_id);
				if (response.status === 200) {
					Swal.fire({
						title: 'Are you sure?',
						text: 'You want to delete this folder?',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, delete it!'
					}).then((result) => {
						if (result.isConfirmed) {
							fetch(`${url_API}/backend/api/group/tata_usaha/${groupId}`, {
								method: 'DELETE',

								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${localStorage.getItem('token')}`
								}
							});
							Swal.fire({
								html: `
					<div class="d-flex align-items-center justify-content-center flex-column h-100">
					<img src="/log-success.svg" width="150" height="150" />
					<h4 class="mb-0 mt-3 fw-semibold text-white">Your folder has been delete</h4>
				</div>
				`,
								confirmButtonColor: '#596066',
								customClass: 'swal-height'
							});
						}
					});
					await fetchFolder();

					// location.reload();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	onMount(async () => {
		await fetchCategories();
		// await fetchCategories();
		// await addValue();
		// new DataTable('#productlist', {
		// 	ordering: true,
		// 	lengthChange: true,
		// 	searching: true,
		// 	paging: true
		// });
	});

</script>
<div class="p-4 mt-4 sm:ml-64">
	<div class="p-4 border-2 border-gray-200 border-dashed rounded-md dark:border-gray-700 mt-14">
		<div class="flex justify-between">
			<h1 class="text-lg font-bold text-color underline">User Customer</h1>
			<button class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline" data-bs-toggle="modal" data-bs-target="#AddModal">Add Categories</button>
		</div>
		<div class="flex justify-end mt-3">
			<form on:submit|preventDefault={searchCategories}>
				<label>
					Search:
					<input
						type="text"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md search-input focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"						placeholder="Search"
						bind:value={search}
						on:keyup={handleSearchSubmitEnter}
					/>
				</label>
			</form>
		</div>
		<table id="example" class="table table-auto border border-1 mt-4 w-100 rounded-sm">
			<thead class="border border-1 rounded-md">
				<tr>
					<th>No</th>
					<th>Image</th>
					<th>Name</th>
					<th>Email</th>
					<th>Address</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<!-- {#if categories}
					{#each categories as post, i}
						<tr>
							<td>{++i}</td>
							<td><img
								src= '/product-default.png'
								style="width: 50px; height: 50px;"
								alt=""
							/></td>
							<td>{post?.cate_name}</td>
							<td>
								<div class="dropdown">
									
									<img src="/more.png" style="width: 20px; cursor: pointer;"id="dropdownMenuButton1"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									/>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
										<li>
											<a class="dropdown-item hover:bg-gray-300" href="#!" data-bs-toggle="modal" data-bs-target="#EditModal"
												data-prod-id={post?.prod_id}
												on:click={handleUpdateData}
												><h1 class="text-black text-md font-medium">
													Edit
												</h1></a
											>
										</li>
										<li><a class="dropdown-item hover:bg-gray-300" href="#!">Delete</a></li>
										
									</ul>
								</div>
							</td>
							
						</tr>
					{/each}
					{:else}
						<tr>
							<td colspan="12">
								<div
									class="loader-container m-0 h-100 gap-3 d-flex align-items-center justify-content-center"
								>
									<div class="custom-loader" />
									<h4 class="text-black load-title">Loading....</h4>
								</div>
							</td>
						</tr>
				{/if} -->
			</tbody>
		</table>
		<div class="div">
			<Pagination
				currentPage={page}
				totalPages={total}
				on:currentPageChange={handlePageChange}
			/>
		</div>
	</div>	
	</div>
<div class="modal fade" id="AddModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Add Users</h5>
		<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
			<span class="sr-only">Close menu</span>
				<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
      </div>
	  <form on:submit={handleSubmit}>
      <div class="modal-body">
			<div class="grid grid-cols-1 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categories Name</label>
					<input type="text" id="product-input" placeholder="Please input your categories name" bind:value={cate_name} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Save Categories</button>
		</div>
	</form>
    </div>
  </div>
</div>

<style>
	th {
		background-color: rgb(209 213 219);
	}
</style>