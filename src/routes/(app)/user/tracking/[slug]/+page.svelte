<script>
    import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;
    import { page } from '$app/stores';
    let slug = $page.params.slug;
    

    let activeTabIndex = 0;

	const tabs = [
		{ icon: `<img src="/all.svg" class="w-6 h-6 mr-3" alt="">`, 
		title: 'Order All', content: [
          
		]},
        { icon: `<img src="/unpaid.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Unpayment', content: [
           
		]},
		{ icon: `<img src="/rupiah.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Payment', content: [
           
		]},
		{ icon: `<img src="/fast-delivery.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Delivery', content: [
            
		]},
		{ icon: `<img src="/cancelled.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Cancelled', content: [
           
		]}
	];
    
    let order_number = '';
    let name_product = '';
    let qty_product = '';
    let img_product = '';
    let price_product = '';
    let subtotal_product = '';
    let shipping_cost = '';
    let status_payment = '';
    let payment_method = '';
    let total_all = '';
    let tracking = [];
    async function detailOrder() {

		try {
			const res = await dataAPI.get(`carts/detailPayment/${slug}`);
			name_product = res.data.data.data_product.name;
			qty_product = res.data.data.data_product.qty;
			img_product = res.data.data.data_product.image;
			price_product = res.data.data.data_product.price;
			subtotal_product = res.data.data.data_product.total;

			shipping_cost = res.data.data.data_payment.ongkir;
			status_payment = res.data.data.data_payment.status;
			order_number = res.data.data.data_payment.order_number;
			total_all = res.data.data.data_payment.totalAll;
			payment_method = res.data.data.data_payment.payment_method;

			tracking = res.data.data.data_shipment.data_waybill.tracking;
            
            const compareDatetime = (a, b) => {
            const datetimeA = new Date(a.datetime);
            const datetimeB = new Date(b.datetime);

            // Urutkan dari yang terbaru ke yang terlama
            return datetimeB - datetimeA;
            };

            // Menggunakan metode sort untuk mengurutkan array
            tracking.sort(compareDatetime);

            // Sekarang, array tracking sudah diurutkan berdasarkan datetime terbaru ke terlama
            console.log(tracking);
            
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

	function switchTab(index) {
		activeTabIndex = index;
	}

    onMount(async () => {
        await detailOrder()

	});


</script>
<div class="container">
    <div class="flex justify-between mt-3">
        <a href="/user/tracking"  class="text-white bg-black hover:bg-black focus:ring-3 focus:outline-none focus:ring-black font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2">
            <img src="/backarrow.png" class="w-4 h-3" alt="">
            <span class="sr-only">Icon description</span>
        </a>
        <div>
            <h1 class="text-xl font-belanosima flex justify-center">ORDERS DETAIL</h1>
            <div class="border-b border-black border-1  w-40"></div>
        </div>
            <div class="flex justify-center ">
            </div>
    </div>
    
    <div class="grid lg:grid-cols-3 gap-4 sm:grid-cols-1">
        <div class="lg:col-span-2 sm:col-span-1">
            <div class="flex items-stretch mt-4 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Order ID </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">SE00122393</div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Product Name </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5 flex items-start">
                    <!-- <img src="/active.jpg" class="w-20 h-20" alt=""> -->
                    <img src="{img_product
                        ? `${url_API}/products/image/${img_product}`
                        : '/product-default.png'}" class="w-32" alt="">
                    <p class="text-base font-semibold">{name_product} <br> <span class="font-medium">{qty_product} x</span> </p>
                    
                </div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Categories </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">Old School</div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Price </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">{`Rp ${Number(price_product).toLocaleString('id-ID')}`}</div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Subtotal Product </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">{`Rp ${Number(subtotal_product).toLocaleString('id-ID')}`}</div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Shipping Cost </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">{`Rp ${Number(shipping_cost).toLocaleString('id-ID')}`}</div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Total </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5 font-semibold text-red-500 text-xl">{`Rp ${Number(total_all).toLocaleString('id-ID')}`}</div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Payment Method </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">
                    <div class="w-full flex items-center">
                        <img src={payment_method === 'Transfer Bank'
                            ? '/bca.png'
                            : '/cod.png'} class="w-24 " alt="">
                        <p class="text-base font-medium">{payment_method}</p>
                    </div>    
                </div>
            </div>
            <div class="flex items-stretch mt-2 px-4">
                <div class="border-b border-gray-300 py-2 w-50">                        
                    <p class="text-base font-semibold">Status </p>
                </div>
                <div class="ml-24 py-2">                        
                    <p class="text-sm font-semibold">: </p>
                </div>
                <div class="border-b border-gray-300 py-2 w-full ml-5">
                        <p class="font-semibold uppercase text-red-500">{status_payment}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-slate-50 rounded-lg">
            <div class="text-base font-semibold d-flex justify-start mt2 px-3 py-2">TRACKING POINT</div>
            <div class="relative">

                <div class="overflow-y-auto h-[500px]">
                    <div class="px-4 py-3 mt-0">
                        {#each tracking as track, index}
                            
                            <div class="flex justify-start gap-5 relative">
                                {#if track?.name === 'Pesanan Dibuat' }
                                    <div class="w-7 h-7 border-solid border-2 border-gray-400 rounded-full flex justify-center items-center absolute">
                                        <img src="/order.svg" class="w-5 h-5" alt="">
                                    </div>
                                {:else if track?.name === 'Pesanan Dikemas'}
                                    <div class="w-7 h-7 border-solid border-2 border-gray-400 rounded-full flex justify-center items-center absolute">
                                        <img src="/shipp.svg" class="w-5 h-5" alt="">
                                    </div>
                                {:else if track?.name === 'Pesanan telah diserahkan ke kurir'}
                                    <div class="w-7 h-7 border-solid border-2 border-gray-400 rounded-full flex justify-center items-center absolute">
                                        <img src="/shipp.svg" class="w-5 h-5" alt="">
                                    </div>
                                {:else}
                                    <div class="w-7 h-7 bg-gray-400 rounded-full flex justify-center items-center absolute">
                                    </div>
                                {/if}
                                <div class="ml-9">
                                    <h1 class="text-red-400 font-semibold">{track?.name}</h1>
                                    <p class="font-normal">{track?.desc}</p>
                                    <p class="text-xs">{track?.datetime}</p>
                                </div>
                            </div>
                            {#if index !== tracking.length - 1}
                                <div class="inline-block h-[60px] ml-3 min-h-[1em] w-0.5 self-stretch border-dashed border-2 border-red-400 opacity-100 dark:opacity-50"></div>
                            {/if}                    
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</div>