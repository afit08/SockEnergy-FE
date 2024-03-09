<script>
	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;

	let page = parseInt(1),
		total,
		orders = null,
		province = '';

	async function getProduct() {
		try {
			const res = await dataAPI.get(`/orders/admin/allOrders?page=${page}&record=10`);
			orders = res.data.data;
			total = res.data.pagination.totalPage;

			
		} catch (error) {
			console.log(error);
			await Swal.fire({
				icon: 'error',
				title: 'Oops!',
				confirmButtonColor: '#596066',
				customClass: 'swal-height',
				text: 'An error occurred while fetching data'
			});
		}
	}

	const handlePageChange = (e) => {
		page = e.detail;
		getProduct();
	};
	
	// send request
	

	let search = null;

	async function searchProducts() {
		orders = null;

		try {
			const res = await fetch(
				`${url_API}/orders/search/orders?page=${page}&record=10`,
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
			orders = res.data;
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

	let openAccordion = null;

	// function toggleAccordion(id) {
	// }

	let detailProduct = [];
	let detailOrders = {};
	let alamat = '',
		ongkir = '',
		payment = '',
		evidence = '',
		start_date = '',
		end_date =  '',
		status = '',
		personal_name = '',
		qty = '',
		prod_name = '',
		prod_image = '',
		total_price = '',
		prod_price = '';

	async function toggleAccordion(id) {
		openAccordion = openAccordion === id ? null : id;

		try {
			const response = await dataAPI.get(`/orders/admin/detailOrders/${id}`);
			detailProduct = response.data.data.products;
			detailOrders = response.data.data;
			order_id = detailOrders.id; 
			qty = detailProduct.cart_qty;
			prod_name = detailProduct.prod_name;
			prod_image = detailProduct.prod_image;
			prod_price = detailProduct.prod_price;
			alamat = detailOrders.add_village;
			ongkir = detailOrders.fopa_ongkir;
			payment = detailOrders.fopa_payment;
			evidence = detailOrders.fopa_image_transaction;
			start_date = detailOrders.fopa_start_date;
			end_date = detailOrders.fopa_end_date;
			status = detailOrders.fopa_status;
			personal_name = detailOrders.add_personal_name;
			total_price = detailOrders.totalAll;

			// console.log(detailOrders);

		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
			console.log(error);
		}
	}

	let fopa_number_resi = '';
	let order_id = '';

	const addReceiptNumber = async (event) => {
		event.preventDefault();
		const { orderId } = event.currentTarget.dataset;
		console.log(event.currentTarget);

		fetch(`${url_API}/orders/admin/updateOrders/${orderId}`, {
			method: 'POST',
			body: JSON.stringify({
				fopa_number_resi: fopa_number_resi
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				console.log(response);
				if (response.status === 200) {
					bootstrap.Modal.getInstance(document.getElementById('receiptNumber')).hide();
					await Swal.fire({
						icon: 'success',
						title: 'Your product has been updated',
						showConfirmButton: false,
						timer: 1500
					});

					await getProduct();
				} else {
					bootstrap.Modal.getInstance(document.getElementById('receiptNumber')).hide();
					await Swal.fire({
						icon: 'error',
						title: 'Oops!',
						confirmButtonColor: '#596066',
						customClass: 'swal-height',
						text: 'An error occurred while fetching data'
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	onMount(async () => {
		await getProduct();
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
		<table class="table table-auto border border-1 mt-4 w-100 rounded-sm">
			<thead class="border border-1 rounded-md">
				<tr>
				<th>No Order</th>
				<th>Date Order</th>
				<th>Payment</th>
				<th class="flex justify-center">Action</th>
				</tr>
			</thead>
			<tbody>
				{#if orders}
					{#each orders as post (post.id)}
						<tr>
							<td>{post.no_order}</td>
							<td>{post.date}</td>
							<td>{post.payment}</td>
							<td class="flex justify-center content-center">
							<div class="dropdown flex justify-center">
								<!-- Your dropdown content here -->
							</div>
							<div id={`accordion-collapse-body-${post.id}`} aria-labelledby={`accordion-collapse-heading-${post.id}`}>
								<button type="button" on:click={() => toggleAccordion(post.id)}>
									<svg class="w-3 h-3 rotate-180 shrink-0" aria-hidden="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
									</svg>
								</button>
							</div>
							</td>
						</tr>
						<tr>
							<td colspan="12">
								{#if openAccordion === post.id}
									<div class="p-3 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
										<div class="grid grid-cols-9 mt-3">
											<div class="col-span-8 border-b border-gray-300">
												<div class="flex items-center">
													<div class="flex-none w-32">
														<div class=" w-full flex items-center">
															<p class="text-base font-semibold">Name</p>
														</div>
													</div>
													<div class="flex-initial w-5">
														<div class=" mt-1">                        
															<p class="text-sm font-semibold">: </p>
														</div>
													</div>
													<div class="flex-initial w-64">
														<div class=" w-full ml-5 flex items-center gap-1">
															{personal_name}
														</div>
													</div>
												</div>												
												<div class="flex items-center">
													<div class="flex-none w-32">
														<div class=" w-full flex items-center">
															<p class="text-base font-semibold">Address</p>
														</div>
													</div>
													<div class="flex-initial w-5">
														<div class=" mt-1">                        
															<p class="text-sm font-semibold">: </p>
														</div>
													</div>
													<div class="flex-initial w-80">
														<div class="py-2 w-full ml-5 flex items-center gap-1">
															{alamat}
														</div>
													</div>
												</div>
											</div>
											<div class="border-b border-gray-300">
												<h5 class="font-semibold text-medium  uppercase text-red-500 flex justify-end">{status}</h5>
												<!-- <span class="bg-green-100 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Sending</span> -->
											</div>
										</div>
										<div class="grid grid-cols-9 mt-3">
											{#each detailProduct as detail }
												
											<div class="col-span-8 border-b border-gray-300 cursor-pointer">
												<div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
													<div class=" py-2 w-full ml-5 flex items-start">
														<img
															src={detail.image
															? `${url_API}/products/image/${detail.image}`
															: '/product-default.png'}
															class="w-36"
															alt=""
														/>
														<div>
															<p class="text-medium font-semibold text-black">{detail.name} <br><span class="font-medium text-base">x {detail.qty}</span></p>
														</div>
													</div>
												</div>
											</div>
											<div class="border-b border-gray-300">
												<h5 class="font-semibold text-xl text-red-500 flex justify-end">{`Rp ${Number(detail.price).toLocaleString('id-ID')}`}</h5>
											</div>
											{/each}
										</div>
										<div class="grid grid-cols-9 mt-3">
											<div class="col-span-6">
												<div class="flex items-center">
													<div class="flex-none w-32">
														<div class="py-2 w-full flex items-center">
															<p class="text-base font-medium">Payment Method</p>
														</div>
													</div>
													<div class="flex-initial w-5">
														<div class="py-2 mt-1">                        
															<p class="text-sm font-semibold">: </p>
														</div>
													</div>
													<div class="flex-initial w-64">
														<div class="py-2 w-full ml-5 flex items-center gap-1">
															<img src={payment === 'Transfer Bank'
																? '/bca.png'
																: '/cod.png'} class="w-16 " alt="">
															<p class="text-base font-semibold"> {payment}</p>
														</div>
													</div>
												</div>
												{#if payment === 'Transfer Bank'}
													<div class="flex">
														<div class="flex-none w-32">
															<div class="py-2 w-full flex items-start">
																<p class="text-base font-medium">Evidence</p>
															</div>
														</div>
														<div class="flex-initial w-5">
															<div class="py-2 mt-1">                        
																<p class="text-sm font-semibold">: </p>
															</div>
														</div>
														<div class="flex-initial w-80">
															<div class="py-2 w-full ml-5 flex items-start">
																<img
																	src={evidence
																	? `${url_API}/products/image/${evidence}`
																	: '/product-default.png'}
																	class="w-24"
																	alt=""
																/>
																<!-- <p class="text-base font-semibold text-red-500">{item?.payment_method === 'Transfer Bank' ? item?.no_rek : ''}  <span class="text-black">{item.payment_method === 'Transfer Bank' ? 'A/n Yusfa Muhammad Bakran': '' } </span></p> -->
															</div>
														</div>
													</div>
												{/if}
											</div>
											<div class="col-span-3">
												<div class="flex">
													<div class="flex-none w-32">
														<div class="py-2 w-full flex items-start">
															<p class="text-base font-medium">Shipping Cost</p>
														</div>
													</div>
													<div class="flex-initial w-5">
														<div class="py-2 mt-1">                        
															<p class="text-sm font-semibold">: </p>
														</div>
													</div>
													<div class="flex-initial w-32">
														<div class="py-2 w-full ml-5 flex items-start">
															<p class="text-base font-semibold">{`Rp ${Number(ongkir).toLocaleString('id-ID')}`}</p>
														</div>
													</div>
												</div>
												<div class="flex">
													<div class="flex-none w-32">
														<div class="py-2 w-full flex items-start">
															<p class="text-base font-medium">Total</p>
														</div>
													</div>
													<div class="flex-initial w-5">
														<div class="py-2 mt-1">                        
															<p class="text-sm font-semibold">: </p>
														</div>
													</div>
													<div class="flex-initial w-32">
														<div class="py-2 w-full ml-5 flex items-start">
															<p class="text-xl font-semibold text-red-500">{`Rp ${Number(parseFloat(total_price + ongkir)).toLocaleString('id-ID')}`}</p>
														</div>
													</div>
												</div>
												<div class="flex">
													<button
														data-bs-toggle="modal"
														data-bs-target="#receiptNumber"
														on:click={() => toggleAccordion(post.id)}
														class="w-40 rounded-md bg-red-500 text-white font-semibold text-sm p-2 mt-2 mb-3"
													>
														Add Receipt Number
													</button>
												</div>
											</div>
										</div>
									</div>
								{/if}
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

<div class="modal fade" id="receiptNumber" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Add Receipt Number</h5>
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
					<label for="product-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Receipt Number</label>
					<input type="text" id="product-input" placeholder="Please input receipt number" bind:value={fopa_number_resi} 												
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				</div>				
			</div>
		<div class="modal-footer">
			<button data-bs-dismiss="modal" aria-label="Close" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" >Cancel</button>
			<button type="submit" data-order-id={order_id} on:click={addReceiptNumber}  class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900" >Update Product</button>
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
