<script>
	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	// import Ckeditor from '$components/Ckeditor.svelte';
	import SvelteQuill from 'svelte-quill';
	import 'quill/dist/quill.snow.css'; // Quill CSS
	import Swal from 'sweetalert2';
  	import Ckeditor from '$components/Ckeditor.svelte';
	const url_API = import.meta.env.VITE_API_SOCK;

	let page = parseInt(1),
		total,
		products = null,
		province = '';

	async function getProduct() {
		try {
			const res = await dataAPI.get(`/products?page=${page}&record=10`);
			products = res.data.data;;
			total = res.data.pagination.totalPage;

			// console.log(products);
		} catch (error) {
			console.log(error);
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
		}
	}

	const handlePageChange = (e) => {
		page = e.detail;
		getProduct();
	};
	
	// send request
	let prod_name = '',
		prod_price = '',
		prod_cate_id = '',
		prod_stock = '',
		prod_weight = '',
		prod_desc = '',
		prod_id = '',
		prod_image = '',
		fileInput = '';
	let formData = {};

	const handleFileChange = (event) => {
		prod_image = event.target.files[0];
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formDataUpload = new FormData();
		formDataUpload.append('prod_name', formData.prod_name);
		formDataUpload.append('prod_price',formatPrice(formData.prod_price)) ;
		formDataUpload.append('prod_desc', prod_desc);
		formDataUpload.append('prod_cate_id', formData.prod_cate_id);
		formDataUpload.append('prod_stock', formData.prod_stock);
		formDataUpload.append('prod_weight', formData.prod_weight);
		formDataUpload.append('prod_image', prod_image);

		// console.log(formDataUpload);
		try {
			
			const response = await dataAPI.post(
				`/products/store`,
				formDataUpload
			);
			if (response.status === 200) {
				await Swal.fire({
					icon: 'success',
					title: 'Your product has been saved',
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
	let fileUpdate = '';
	let editor;

	async function handleUpdateData(e) {
		const { prodId } = e.currentTarget.dataset;
		const { default: Quill } = await import('quill');

		try {
			const response = await dataAPI.get(`/products/detailProducts/${prodId}`);
			const updData = response.data.data[0];
			const prod_desc = updData.prod_desc;

			// Initialize Quill first
			const quill = new Quill(editor, {
			modules: {
				toolbar: true,
			},
			theme: 'snow',
			placeholder: 'Tulis keterangan...',
			});

			// Set the default value
			quill.root.innerHTML = prod_desc;

			// Update other variables if needed
			prod_id = updData.prod_id;
			prod_name = updData.prod_name;
			prod_price = updData.prod_price;
			prod_cate_id = updData.prod_cate.cate_id;
			prod_stock = updData.prod_stock;
			prod_weight = updData.prod_weight;
			prod_image = updData.prod_image;

			// console.log(prod_cate_id);
		} catch (error) {
			bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
				await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
				});
			console.log(error);
		}
		}


	const updateData = async (event) => {
		event.preventDefault();

		if (fileUpdate.files[0]) {
			const formData = new FormData();
			formData.append('prod_name', prod_name);
			formData.append('prod_price', formatPrice(prod_price)) ;
			formData.append('prod_desc', prod_desc);
			formData.append('prod_cate_id', prod_cate_id);
			formData.append('prod_stock', prod_stock);
			formData.append('prod_weight', prod_weight);
			formData.append('prod_image', fileUpdate.files[0]);

			// console.log(formData);

			const { prodId } = event.currentTarget.dataset;

			try {
				const response = await dataAPI.post(
					`/products/update/${prodId}`,
					formData
				);

				if (response.status === 200) {
					bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
					await Swal.fire({
						icon: 'success',
						title: 'Your product has been updated',
						showConfirmButton: false,
						timer: 1500
					});
					location.reload();

					// await getProduct();
					// console.log(response);
				} else {
					bootstrap.Modal.getInstance(document.getElementById('EditModal')).hide();
					await Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
					console.log(error);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			const { prodId } = event.currentTarget.dataset;

			fetch(`${url_API}/products/updateNoImage/${prodId}`, {
				method: 'POST',
				body: JSON.stringify({
					prod_id: prod_id,
					prod_name: prod_name,
					prod_price: prod_price,
					prod_desc: prod_desc,
					prod_cate_id: prod_cate_id,
					prod_stock: prod_stock,
					prod_weight: prod_weight
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
							icon: 'success',
							title: 'Your product has been updated',
							showConfirmButton: false,
							timer: 1500
						});
						location.reload();
					} else {
						bootstrap.Modal.getInstance(document.getElementById('FormModalEdit')).hide();
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
		const { prodId } = event.currentTarget.dataset;

		fetch(`${url_API}/products/detailProducts/${prodId}`, {
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
						text: 'You want to delete this product?',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, delete it!'
					}).then((result) => {
						if (result.isConfirmed) {
							fetch(`${url_API}/products/delete/${prodId}`, {
								method: 'DELETE',

								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${localStorage.getItem('token')}`
								}
							});
						Swal.fire({
							icon: 'success',
							title: 'Your product has been saved',
							showConfirmButton: false,
							timer: 1500
						});
						// location.reload();
						getProduct();
						}
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	function formatPrice(price) {
		const cleanedPrice = price.replace(/[^\d]/g, '');
		const parsedPrice = parseInt(cleanedPrice, 10);
		if (isNaN(parsedPrice)) {
			return ''; // Invalid input, return empty string
		}
		return parsedPrice.toString();
	}

	let search = null;

	async function searchProducts() {
		products = null;

		try {
			const res = await fetch(
				`${url_API}/products/search/products?page=${page}&record=10`,
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
			products = res.data;
			total = res.pagination.totalPage;
		} catch (error) {
			console.log(error);
		}
	}

	function handleSearchSubmitEnter(event) {
		if (event.key === 'Enter') {
			searchProducts();
		}
	}

	function formatRupiah(angka, prefix) {
		var number_string = angka.replace(/[^,\d]/g, '').toString(),
			split = number_string.split(','),
			sisa = split[0].length % 3,
			rupiah = split[0].substr(0, sisa),
			ribuan = split[0].substr(sisa).match(/\d{3}/gi),
			separator = sisa ? '.' : ''; // Declare separator here

		if (ribuan) {
			rupiah += separator + ribuan.join('.');
		}

		rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
		return prefix === undefined ? rupiah : (rupiah ? ' ' + rupiah : '');
	}

	function handleKeyUpWithRupiah(dengan_rupiah) {
		dengan_rupiah.value = formatRupiah(dengan_rupiah.value, '');
	}
		
	let categories = [];
	async function fetchCategories() {
		try {
			const res = await dataAPI.get(`/categories/admin/all?page=${page}&record=10`);
			categories = res.data.data;
			// console.log(categories);
		} catch (error) {
			return error;
		}
	}

	onMount(async () => {

		const { default: Quill } = await import('quill');

		await getProduct();
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
			<h1 class="text-lg font-bold text-color underline">Products</h1>
			<button class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline" data-bs-toggle="modal" data-bs-target="#AddModal">Add Product</button>
		</div>
		<div class="flex justify-end mt-3">
			<form on:submit|preventDefault={searchProducts}>
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
					<th>Image</th>
					<th class="px-2 py-2 w-52 break-all whitespace-normal">Product Name</th>
					<th>Categories</th>
					<th class="px-2 py-2 w-52 break-all whitespace-normal">Description</th>
					<th>Price</th>
					<th>Weight</th>
					<th>Qty</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#if products}
					{#each products as post}
						<tr>
							<td><img
								src={post.prod_image
								? `${url_API}/products/image/${post?.prod_image}`
								: '/product-default.png'}
								class="w-32 h-32"
								alt=""
							/></td>
							<td>{post?.prod_name}</td>
							<td>{post?.cate_name}</td>
							<td data-toggle="tooltip" data-placement="top">
							{@html post.prod_desc}</td>
							<td>{`Rp ${Number(post.prod_price).toLocaleString('id-ID')}`}</td>
							<td>{post?.prod_weight}</td>
							<td>{post?.prod_stock}</td>
							<td>
								<div class="dropdown flex justify-center">
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
										<li><a class="dropdown-item hover:bg-gray-300" href="#!" data-prod-id={post?.prod_id} on:click={handleDelete}>Delete</a></li>
										
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
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Add Product</h5>
		<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
			<span class="sr-only">Close menu</span>
				<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
      </div>
	  <form on:submit={handleSubmit}>
		<div class="modal-body">
				<div class="grid grid-cols-2 gap-4">
					<div class="mb-6">
						<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
						<input type="text" id="product-input" placeholder="Please input your product name" bind:value={formData.prod_name} 												
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					</div>

					<div class="mb-6">
						<label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Product</label>
						<select on:change={fetchCategories}
							bind:value={formData.prod_cate_id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
							{#each categories as cate}
								<option value={cate.cate_id}>{cate.cate_name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="mb-6">
						<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
						<div class="flex">
							<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
								<h5 class="text-black font-bold">RP</h5>
							</span>
							<input type="text" id="dengan-rupiah"
								on:keyup={(e) => handleKeyUpWithRupiah(e.target)}  bind:value={formData.prod_price}
								class="rounded-none rounded-r-md bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input your price">
						</div>
					</div>

					<div class="mb-6">
						<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity </label>
						<input type="number" id="quantiy-input" placeholder="Please input your product name" bind:value={formData.prod_stock}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="mb-6">
						<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight</label>
						<div class="flex">
							
							<input type="number"
								bind:value={formData.prod_weight}
								class="rounded-none rounded-l-md bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input weight product">
								<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
								<h5 class="text-black font-bold">Gram (G)</h5>
							</span>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 ">
					<div class="mb-6">
						<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description </label>
						<!-- <textarea id="descripstion" rows="4" bind:value={formData.prod_desc} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please describe your product here..."></textarea>				 -->
						<Ckeditor bind:notes={prod_desc}/>
					</div>	
				</div>

				<div class="grid grid-cols-1">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Upload Image Product</label>
					<input on:change={handleFileChange} class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file">
				</div>
				
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Save Product</button>
		</div>
	</form>
    </div>
  </div>
</div>

<div class="modal fade" id="EditModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Edit Product</h5>
		<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
			<span class="sr-only">Close menu</span>
				<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>     
	</div>
	<form>
      	<div class="modal-body">
			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
					<input type="text" id="product-input" placeholder="Please input your product name" bind:value={prod_name} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>

				<div class="mb-6">
					<label for="categories" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Product</label>
					<select on:change={fetchCategories}
						bind:value={prod_cate_id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						{#each categories as cate}
							<option value={cate.cate_id}>{cate.cate_name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
					<div class="flex">
						<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
							<h5 class="text-black font-bold">RP</h5>
						</span>
						<input type="text" id="dengan-rupiah"
							on:keyup={(e) => handleKeyUpWithRupiah(e.target)}  bind:value={prod_price}
							class="rounded-none rounded-r-md bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input your price">
					</div>
				</div>

				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity </label>
					<input type="number" id="quantiy-input" placeholder="Please input your product name" bind:value={prod_stock}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weight</label>
					<div class="flex">
						
						<input type="number"
							bind:value={prod_weight}
							class="rounded-none rounded-l-md bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input weight product">
							<span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
							<h5 class="text-black font-bold">Gram (G)</h5>
						</span>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 ">
				<div class="mb-6">
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description </label>
					<!-- <textarea id="descripstion" rows="4" bind:value={prod_desc} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please describe your product here..."></textarea>				 -->
					<!-- <Ckeditor bind:notes={prod_desc}/> -->
					  <!-- <SvelteQuill bind:this={quill} /> -->
					  <div
						bind:this={editor}
						id="editor"
						class="text-black"
						on:input={(e) => {
							prod_desc = e.target.innerHTML;
						}}
					/>
				</div>	
			</div>

			<div class="grid grid-cols-1">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="default_size">Upload Image Product</label>
				<input bind:this={fileUpdate} class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="default_size" type="file">
			</div>
			
		</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" data-prod-id={prod_id} on:click={updateData} class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Update Product</button>
		</div>
	</form>
    </div>
  </div>
</div>

<style>
	th {
		background-color: rgb(209 213 219);
	}

	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

    #editor {
        height: 200px;
    }
</style>
