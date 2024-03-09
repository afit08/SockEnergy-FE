<script>

	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;

	let carts = [];
	let user_id = '';
	let isLoading = false;
	let qty = ''
	let total = '';
	let carts_qty = [];
	let formData = {
		value: 0,
    	etd: null,
		description : null
	};


	async function countCartPage() {
		// isLoading = true;
		// setTimeout(() => {
		// 	isLoading = false;
		// }, 1000);
		try {
			const res = await dataAPI.get(`carts/showCarts`);
			carts = res.data.data.result;
			total = res.data.data.sum;

			const cartsWithTotalCost = carts.map((item) => {
			const cartQty = parseFloat(item.cart_qty);
			const prodPrice = parseFloat(item.cart_prod.prod_price);
			const totalCost = cartQty * prodPrice;

				return {
					...item,
					totalCost: totalCost,
					cartQty: cartQty
				};
			});

			const totalAllCost = cartsWithTotalCost.reduce((total, item) => total + item.totalCost, 0);
			return totalAllCost

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
	
	function calculateTotalCost(cart) {
		const cartQty = parseFloat(cart.cart_qty);
		const prodPrice = parseFloat(cart.cart_prod.prod_price);
		return cartQty * prodPrice;
	}



	const TotalQty = async (isIncrement, cart) => {
		const newCartQty = isIncrement
			? parseFloat(cart.cart_qty) + 1
			: Math.max(parseFloat(cart.cart_qty) - 1, 0);
		if (newCartQty === 0) {
			// Call handleDelete function when quantity becomes zero
       		await handleDelete(event, cart?.cart_id);
		} else {
			cart.cart_qty = newCartQty;

			// console.log(newCartQty);

			try {
				const res = await fetch(
					`${url_API}/carts/updateCart/${cart.cart_id}`,
					{
						method: 'POST',
						body: JSON.stringify({
							cart_qty: newCartQty
						}),
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				).then((res) => res.json());

				await countCartPage();
			} catch (error) {
				console.log(error);
			}
		}
	};



	let data_address = [];
	let data_ongkirs = [];
	let data_payment = [];
	let payment_id = '';
	let sub_total_prod = parseInt(0);
	let totalAllCost = '';
	let data_cart1 = [];
	let selectedValue = '';

	async function handleCheckout(event) {
		
		const user_id = localStorage.getItem('user_id');
		const selectedValue = event.target.value.split(',');
		// console.log(selectedValue[1]);
			formData.value = parseInt(selectedValue);
			

			const selectedOption = data_ongkirs.find(option => option.value === Number(selectedValue[0]));
			if (selectedOption) {
				formData.etd = selectedOption.etd;
				formData.description = selectedOption.description;
				// console.log(formData.description);
			}
		try {
			const response = await dataAPI.get(`/carts/checkout/${user_id}`);
			data_address = response.data.data[0].data_address;
			data_ongkirs = response.data.data[0].data_ongkirs;
			data_payment = response.data.data[0].data_payment;
			data_cart1 = response.data.data[0].data_cart;
			sub_total_prod = response.data.data[0].subtotal;

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

	function calculateTotalCostCheckout(data) {
		const cartQty = parseFloat(data.qty);
		const prodPrice = parseFloat(data.price);
		return cartQty * prodPrice;
	}

	let fopa_ongkir = '';
 	let fopa_payment = null; // Initial value for fopa_payment

	const handlePayment = async () => {
		fetch(`${url_API}/carts/createPayment/${user_id}`, {
			method: 'POST',
			body: JSON.stringify({
				fopa_ongkir: formData.value,
				fopa_payment: fopa_payment,
				fopa_etd_ongkir: formData.etd,
				fopa_desc_ongkir: formData.description,
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(async (response) => {
				// console.log(response);
				
			})
			.catch((error) => {
				console.log(error);
			});
		await getRekening();	
	};

	function handleClick(paymentName) {
		// console.log('Button clicked with payment name:', paymentName);
		fopa_payment = paymentName; // Update fopa_payment with the selected payment
	}

	let rekening = '';

	async function getRekening() {
		try {
			const res = await dataAPI.get(`/carts/formPayment/${user_id}`);
			rekening = res.data.data.no_rek;

			// console.log(rekening);
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

	let NoRekening = "7030248095";
	let isCopy = false;

	function copyToClipboard() {
		const textarea = document.createElement('textarea');
		textarea.value = NoRekening;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		isCopy = true;
		setTimeout(() => {
			isCopy = false;
		}, 1000);
	}

	 function reloadPage() {
		location.reload();
	}

	// const handleDelete = async (event) => {
	// 	event.preventDefault();
	// 	const { cartId } = event.currentTarget.dataset;

	// 	fetch(`${url_API}/carts/deleteCart/${cartId}`, {
	// 		method: 'DELETE',

	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: `Bearer ${localStorage.getItem('token')}`
	// 		}
	// 	})
	// 		.then(async (response) => {
	// 			console.log(response);
	// 			await countCartPage()
	// 			// console.log(user_status_id);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// };

	const handleDelete = async (event, cartId) => {
		event.preventDefault();

		try {
			const response = await fetch(`${url_API}/carts/deleteCart/${cartId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			await countCartPage();
		} catch (error) {
			console.log(error);
		}
	};




	onMount(async () => {
		await countCartPage();
 	 	user_id = localStorage.getItem('user_id');

		
	});
</script>

<div class="container lg mx-auto">
	<h1 class="text-xl font-belanosima d-flex justify-center mt-4">CART</h1>
	<div class="flex justify-center ">
		<div class="border-b border-black border-1  w-16"></div>
	</div>

	<div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-3 mt-3">
		<div class="lg:col-span-2 sm:col-span-1">
			<div class="rounded shadow-md sm:rounded-lg">
				<table class="w-full text-base text-left text-gray-600 mt-2">
					<thead class="text-sm text-gray-800 uppercase font-bold bg-gray-100 ">
						<tr>
							<th scope="col" class="px-6 py-3"><span class="sr-only">Image</span></th>
							<th scope="col" class=" lg:px-6 lg:py-3 sm:px-5 sm:py-2"> Product  </th>
							<th scope="col" class=" lg:px-8 lg:py-3 sm:px-7 sm:py-2"> Price </th>
							<th scope="col" class=" px-8 py-3"> Quantity </th>
							<th scope="col" class=" lg:px-8 lg:py-1 sm:px-7 sm:py-2"> Total </th>
							<th scope="col" class=" px-3 py-3"> Action </th>
						</tr>
					</thead>
					<tbody>
						{#if carts.length > 0}
							{#each carts as cart }
								<tr class="bg-white border-bottom">
									<td class="">
										<img
											src={cart?.cart_prod.prod_image
											? `${url_API}/products/image/${cart?.cart_prod.prod_image}`
											: '/product-default.png'}
											class="lg:w-52 lg:h-40 sm:w-24 sm:h-20 px-3 py-1"
											alt=""
										/>
									</td>
									<td class="px-3 py-2">
										<p class="lg:text-base sm:text-sm font-medium text-gray-900  whitespace-normal flex items-center">
											{cart?.cart_prod.prod_name}
										</p>
									</td>
									<td class="px-3 py-2">
										<p class="lg:text-base sm:text-sm font-medium text-gray-900  whitespace-normal">
											{`Rp ${Number(cart?.cart_prod.prod_price).toLocaleString('id-ID')}`}
										</p>
									</td>
									<td class="px-3 py-2">
										<div class="flex justify-center gap-2">
											<button on:click={() => TotalQty(false, cart)}>
												<img src="/remove.svg" alt="" class="w-4 cursor-pointer" />
											</button>
											<p class="text-base font-xl text-gray-900 whitespace-normal">
												{cart.cart_qty}
											</p>
											<button on:click={() => TotalQty(true, cart)}>
												<img src="/add.svg" alt="" class="w-4 cursor-pointer" />
											</button>
										</div>
									</td>
									<td class="px-3 py-2">
										<p class="lg:text-base sm:text-sm  text-gray-900  whitespace-normal font-semibold">
											{`Rp ${Number(calculateTotalCost(cart)).toLocaleString('id-ID')}`}
										</p>
									</td>
									<td class="px-3 py-2">
										<a href="#!" 
											on:click={(event) => handleDelete(event, cart?.cart_id)} 
											class="lg:text-base sm:text-sm font-medium text-red-400 dark:text-red-300 hover:underline"
										>
											Remove
										</a>
									</td>
								</tr>	
							{/each}
						{:else}
							<tr>
								<td colspan="12">
									<div class="flex justify-center items-center">
										<img class="w-48 px-3 py-3" src="/empty-logo.png" alt="">
									</div>
									<div class="flex justify-center items-center">
										<h4 class="text-black text-center text-base font-medium">Data cart is Empty</h4>
									</div>
									<div class="flex justify-center items-center mb-3">
										<p class="text-gray-700 text-sm">Please add product to cart</p>
									</div>
									
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
		<div class=" rounded-lg bg-gray-100 mb-2 max-h-44 mt-2">
			<h1 class="font-semibold px-6 py-3 text-base text-black uppercase">Total {carts.length} Product</h1>
			<hr />
				<h1 class=" font-semibold px-6 py-3 text-2xl text-gray-900  whitespace-normal">
					{`Rp ${Number(total).toLocaleString('id-ID')}`}
				</h1>
			<div class="container flex items-end">
				<button
					on:click={handleCheckout}
					data-bs-toggle="modal"
					data-bs-target="#checkoutModal"
					class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-10 mt-2"
					>CHECKOUT</button
				>
			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="checkoutModal"
	data-bs-backdrop="static" 
	data-bs-keyboard="false" 
	tabindex="-1" 
	aria-labelledby="staticBackdropLabel" 
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-scrollable modal-xl">
		<div class="modal-content">
			
			<div class="modal-body">
				<table class="w-full rounded  text-left mt-3">
					<thead class="text-base text-black border-dark border-bottom" >
						<tr>
							<th scope="col" class="font-semibold w-60 px-2 py-2 text-base bg-white"> SHIPPING ADDRESS </th>
							<th scope="col" class="w-auto bg-white" />
							<th scope="col" class="w-30 bg-white flex justify-end" >
								<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
									<span class="sr-only">Close menu</span>
										<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each data_address as data }							
							<tr class="bg-white border-bottom">
								<td class="px-2 py-2">
									<p class="text-base font-semibold text-gray-900  whitespace-normal">
										{data?.personal_name}
									</p>
									<p class="text-base font-semibold text-gray-900  whitespace-normal">
										{data?.phone_number}
									</p>
								</td>
								<td class="px-3 py-2">
									<div class="flex justify-center gap-1">
										<p class="text-base font-medium text-gray-900 break-all">
											{data?.address}, {data?.area}
										</p>
										
									</div>
								</td>
								<td class="px-3 py-2">
									<a href="#" class="text-base font-medium whitespace-nowrap text-red-400 dark:text-red-300 hover:underline"
										>Change Address</a
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				
					<!-- <h1 class="font-bold text-base mt-3">ORDERED PRO</h1> -->
				<table class="w-full text-base text-left text-gray-600 mt-3">
					<thead class="text-sm text-gray-800 uppercase font-bold bg-gray-100 ">
						<tr>
							<th scope="col" class="px-3 py-2"><span class="sr-only">Image</span></th>
							<th scope="col" class=" lg:px-3 lg:py-2 sm:px-5 sm:py-2"> Product  </th>
							<th scope="col" class=" lg:px-3 lg:py-2 sm:px-7 sm:py-2"> Price </th>
							<th scope="col" class=" px-3 py-2"> Quantity </th>
							<th scope="col" class=" lg:px-3 lg:py-2 sm:px-7 sm:py-2"> Total </th>
						</tr>
					</thead>
					<tbody>
						{#each data_cart1 as data }
							<tr class="bg-white border-bottom">
								<td class="">
									<img
										src={data.image
										? `${url_API}/products/image/${data.image}`
										: '/product-default.png'}
										class="lg:w-52 lg:h-40 sm:w-24 sm:h-20 px-3 py-1"
										alt=""
									/>
								</td>
								<td class="px-3 py-2">
									<p class="text-base font-semibold text-gray-900  whitespace-normal flex items-center">
										{data.name}
									</p>										
									
								</td>

								<td class="px-3 py-2">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										{`Rp ${Number(data.price).toLocaleString('id-ID')}`}
									</p>
								</td>
								<td class="px-3 py-2">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										{data.qty} x
									</p>
									
								</td>
								<td class="px-3 py-2">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										{`Rp ${Number(calculateTotalCostCheckout(data)).toLocaleString('id-ID')}`}
										<!-- {data.total} -->
									</p>
								</td>

							</tr>
							
						{/each}
					</tbody>
				</table>


				<div class="grid grid-cols-3 gap-0 mt-3">
					<div class="">
						<h1 class="font-semibold text-base">SHIPPING SERVICE</h1>
					</div>
					<div>
					<select id="countries" on:change={handleCheckout} bind:value={selectedValue} class="bg-gray-50 border-2 border-gray-200 text-black text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 block w-80 p-2.5 ">
						<option selected>Choose a service</option>
						{#each data_ongkirs as data}
							<option value={`${data.value},${data.description},${data.etd}`}>{data?.description}
							 - <span>{data?.etd} days</span>
							</option>
						{/each}
					</select>

					</div>
					<div>
						<label for="countries" class="block mb-0 text-lg ml-4 font-semibold text-black ">  {`Rp ${isNaN(formData?.value) ? '0' : Number(formData?.value).toLocaleString('id-ID')}`}</label>
						{#if formData.etd}
							<label for="countries" class="block mb-0 text-sm ml-4 font-medium text-black ">Estimasi Pengiriman: {formData.etd} Hari</label>
						{/if}
					</div>				
				</div>

				<div class="grid grid-cols-3 gap-0 mt-3">
					<div class="">
						<h1 class="font-semibold text-base">PAYMENT METHOD</h1>
					</div>
					<div class="col-span-2 flex justify-start gap-2">
						{#each data_payment as data }
							{#if data?.payment_name === 'Transfer Bank'}
								<button type="button" class="text-white bg-[#0060af] hover:bg-[#0060af]/90 focus:ring-4 focus:ring-[#0060af]/50 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center" on:click={() => {
								handleClick(data.payment_name);}}>
								<img src='/bcapay.png' class="w-14 " alt="">
									Pay with BCA
								</button>
							{:else}
								<button type="button" class="text-white bg-[#ff541c] hover:bg-[#ff541c]/80 focus:ring-4 focus:outline-none focus:ring-[#ff541c]/50 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"  on:click={() => {
								handleClick(data.payment_name);}}>
								<img src='/codpay.png' class="w-14 " alt="">
									Pay with COD
								</button>

							{/if}
						{/each}
						<!-- <button type="button" class="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
						
							<img src="/bca.svg" class="h-4 mr-2 -ml-1 w-12" alt="">
							Pay with BCA
						</button>
						<button type="button" class="text-white bg-[#ff541c] hover:bg-[#da4210]/80 focus:ring-4 focus:outline-none focus:ring-[#b73105]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
							<img src="/cod.png" class="h-6 mr-2 -ml-1 w-12" alt="">							
							Pay COD
						</button> -->
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-5">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5">
						<h3 class="font-semibold text-base whitespace-nowrap">Subtotals for Products</h3>
						<h3 class="font-semibold text-base whitespace-normal flex justify-end">{`Rp ${Number(sub_total_prod).toLocaleString('id-ID')}`}</h3>
				
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-1">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5 border-b border-black">
						<h3 class="font-semibold text-base whitespace-normal">Shipping Cost</h3>
						<h3 class="font-semibold text-base whitespace-normal flex justify-end">  {`Rp ${isNaN(formData?.value) ? '0' : Number(formData?.value).toLocaleString('id-ID')}`}</h3>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-1">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-3">
						<h3 class="font-semibold text-base whitespace-nowrap">Total</h3>
						<h3 class="font-semibold text-2xl text-red-400 whitespace-normal flex justify-end">  {`Rp ${isNaN(sub_total_prod + formData.value) ? '0' : Number(sub_total_prod + formData.value).toLocaleString('id-ID')}`}</h3>					
					</div>
				</div>

				<div class="grid grid-cols-3 gap-0 mt-4">
					<div class="col-span-2 w-40"></div>
					<button
						data-bs-toggle="modal"
						data-bs-target="#paymentModal"
						on:click={handlePayment}
						class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3 disabled:opacity-70"
						>MAKE AN ORDER</button>
				</div>


			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="paymentModal"
	data-bs-backdrop="static" 
	data-bs-keyboard="false" 
	tabindex="-1" 
	aria-labelledby="staticBackdropLabel" 
	aria-hidden="true"
	
>
	<div class="modal-dialog modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-body">
				<div class="grid grid-cols-2 gap-2">
					<div><h3  class="font-semibold text-lg whitespace-normal">Total Pembayaran</h3></div>
					<div><h3  class="font-bold text-xl whitespace-normal flex justify-end">{`Rp ${Number(sub_total_prod + formData?.value).toLocaleString('id-ID')}`}</h3></div>
				</div>
				<hr class="mt-2" />
				{#if fopa_payment === 'Transfer Bank'}	
					<div class="grid grid-cols-2 gap-2">
							<div class="mt-4">
								<img src="/bca.png" class="w-44" alt="">
							</div>
							<div>
								<p class="font-medium text-sm whitespace-normal mt-4">No. Rekening</p>
								<div class="flex justify-start gap-2">
									
									<h3 class="font-semibold text-2xl mt-0 text-red-400 whitespace-normal">{rekening}</h3>
									<!-- <h3 class="font-medium text-base mt-1 text-gray-600 whitespace-normal cursor-pointer" on:click={copyToClipboard}>SALIN</h3> -->
									<br>
								</div>
								{#if isCopy}
									<p class="text-xs">Teks berhasil disalin</p>
								{/if}
								<p class="text-sm font-bold mt-0">A.n Yusfa Muhammad Bakran</p>
							</div>
					</div>	
				{:else}
					<div class="flex justify-center">
						<img src="/cod.png" class="w-40 mt-3" alt="">
					</div>
					<div class="flex justify-center">
						<h3 class="font-medium text-sm mt-0 text-black whitespace-normal break-all">Your order has been processed, please prepare cash for COD payment</h3>
					</div>
				{/if}
				<div class="flex justify-center">
					<button on:click={() => reloadPage()}
						data-bs-dismiss="modal"
						class=" w-72 rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3 "
						>OK
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	
</style>
