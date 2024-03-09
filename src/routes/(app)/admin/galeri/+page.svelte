
<script>
	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';

	const url_API = import.meta.env.VITE_API_SOCK;

	let page = parseInt(1);
	let total;
	async function fetchGaleries() {
		try {
			const res = await dataAPI.get(`/galleries/admin/all`);
			galleries = res.data.data;
			// total = res.data.pagination.totalPage;
			// console.log(galleries);
		} catch (error) {
			console.log(error);
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
		}
	}

	let galleries = null;
	let search = [];

	async function searchGaleries() {
		galleries = null;

		try { 
			const res = await fetch(
				`${url_API}/galleries/admin/searchGaleries/?page=${page}&record=10`,
				{
					method: 'POST',
					body: JSON.stringify({
						search: `%${search}%`
					}),

					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			).then((res) => res.json());
			galleries = res.data;
			// console.log(galleries);
			total = res.pagination.totalPage;
		} catch (error) {
			console.log(error);
		}
	}

	function handleSearchSubmitEnter(event) {
		if (event.key === 'Enter') {
			searchGaleries();
		}
	}

	const handlePageChange = (e) => {
		page = e.detail;
		fetchFolder();
	};

	const handleFileChange = (event) => {
		gall_image = event.target.files[0];
	};


	let gall_name = '';
	let cate_id = '';
	let gall_image = [];

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formDataUpload = new FormData();
		formDataUpload.append('gall_name', gall_name);
		formDataUpload.append('gall_image', gall_image.files[0]);

		console.log(formDataUpload);
		try {
			
			const response = await dataAPI.post(
				`/galleries/store`,
				formDataUpload
			);
			if (response.status === 200) {
				await Swal.fire({
					icon: 'success',
					title: 'Your galleries has been saved',
					showConfirmButton: false,
					timer: 1500
				});
				location.reload();
			}
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
			console.log(error);
		}
	};

	let updData = {};

	async function handleUpdateData(e) {
		const { galId } = e.currentTarget.dataset;
		try {
			const response = await dataAPI.get(`/galleries/admin/${galId}`);
			updData = response.data.data[0];
			gall_id = updData.gall_id;
			gall_name = updData.gall_name;
			gall_image = updData.gall_image;
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
			console.log(error);
		}
	}

	let cate_image_update = [];

	const updateData = async (event) => {
		event.preventDefault();

		if (cate_image_update.files[0]) {
			const formDataWithFile = new FormData();
			formDataWithFile.append('gall_name', gall_name);
			formDataWithFile.append('gall_image', cate_image_update.files[0]);

			const { cateId } = event.currentTarget.dataset;

			try {
				const response = await dataAPI.post(
					`/galleries/edit/${cateId}`,
					formDataWithFile
				);

				if (response.status === 200) {
					await Swal.fire({
					icon: 'success',
					title: 'Your galleries has been saved',
					showConfirmButton: false,
					timer: 1500
				});
				location.reload();
				} else {
					await Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
					console.log(error);
				}
			} catch (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Something went wrong!',
				});
				console.log(error);
				}
		} else {
			const { cateId } = event.currentTarget.dataset;

			fetch(`${url_API}/galleries/admin/editNoImage/${cateId}`, {
				method: 'POST',
				body: JSON.stringify({
					gall_name: gall_name
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
							title: 'Your galleries has been saved',
							showConfirmButton: false,
							timer: 1500
						});
					location.reload();
					} else {
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
		}
	};

	const handleDelete = async (event) => {
		event.preventDefault();
		const { cateId } = event.currentTarget.dataset;

		fetch(`${url_API}/galleries/admin/${cateId}`, {
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
							fetch(`${url_API}/galleries/delete/${cateId}`, {
								method: 'DELETE',

								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${localStorage.getItem('token')}`
								}
							});
						Swal.fire({
							icon: 'success',
							title: 'Your galleries has been saved',
							showConfirmButton: false,
							timer: 1500
						});
						}
					});
					// location.reload();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	
	onMount(async () => {
		await fetchGaleries();
		// await fetchGalerry();
		// await addValue();
		// new DataTable('#categorieslist', {
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
			<h1 class="text-lg font-bold text-color underline">Galleries</h1>
			<button class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline" data-bs-toggle="modal" data-bs-target="#AddModal">Add Galleries</button>
		</div>
		<div class="flex justify-end mt-3">
			<form on:submit|preventDefault={searchGaleries}>
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
		
		<table id="categorieslist" class="table table-auto border border-1 mt-4 w-100 rounded-sm">
			<thead class="border border-1 rounded-md">
				<tr>
					<th class="">No</th>
					<th class="">Image</th>
					<th class="">Galleries Name</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#if galleries}
					{#each galleries as post, i}
						<tr>
							<td>{++i}</td>
							<td><img
								src={post.gall_image
								? `${url_API}/products/image/${post?.gall_image}`
								: '/product-default.png'}
								class="w-28 h-28"
								alt=""
							/></td>
							<td>{post?.gall_name}</td>
							<td>
								<div class="dropdown">
									<!-- svelte-ignore a11y-missing-attribute -->
									<!-- svelte-ignore a11y-role-supports-aria-props -->
									<img src="/more.png" style="width: 20px; cursor: pointer;"id="dropdownMenuButton1"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									/>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
										<li>
											<a class="dropdown-item hover:bg-gray-300" href="#!" data-bs-toggle="modal" data-bs-target="#EditModal"
												data-cate-id={post?.gall_id}
												on:click={handleUpdateData}
												><h1 class="text-black text-md font-medium">
													Edit
												</h1></a
											>
										</li>
										<!-- <li><a class="dropdown-item hover:bg-gray-300" href="#!" data-cate-id={post?.cate_id} on:click={handleDelete}>Delete</a></li> -->
										
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
				{/if}
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
        <h5 class="modal-title font-bold" id="exampleModalLabel">Add Galleries</h5>
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
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Galleries Name</label>
					<input type="text" id="product-input" placeholder="Please input your galleries name" bind:value={gall_name} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>
				<div class="grid grid-cols-1">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Upload Image Galleries</label>
					<input bind:this={gall_image} class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file">
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Save Galleries</button>
		</div>
	</form>
    </div>
  </div>
</div>

<div class="modal fade" id="EditModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Edit Galleries</h5>
		<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
			<span class="sr-only">Close menu</span>
				<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
      </div>
	<form>
      <div class="modal-body">
			<div class="grid grid-cols-1 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Galleries Name</label>
					<input type="text" id="product-input" placeholder="Please input your galleries name" bind:value={gall_name} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>
				<div class="grid grid-cols-1">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Upload Image Galleries</label>
					<input bind:this={cate_image_update} class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file">
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" data-cate-id={cate_id} on:click={updateData} class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Update Galleries</button>
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