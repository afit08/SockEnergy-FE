<script>
	import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;
		import { goto } from '$app/navigation';


	let page = parseInt(1),
		total,
		products = [],
		products1 = [],
		products2 = [],
		qty = 0,
		province = '';

	async function getProduct() {
		try {
			const res = await dataAPI.get(`/products/customer/all?page=${page}&record=8`);
			products1 = res.data.data.slice(0,4);
			products2 = res.data.data.slice(5,8);
			total = res.data.pagination.totalPage;

			// console.log(products1);
			// console.log(products2);
		} catch (error) {
			console.log(error);
			// await Swal.fire({
			// 	icon: 'error',
			// 	title: 'Oops!',
			// 	confirmButtonColor: '#596066',
			// 	customClass: 'swal-height',
			// 	text: 'An error occurred while fetching data'
			// });
		}
	}

	let detailproduct = [];
	async function fetchDetailProduct(e) {
		const { prodId } = e.currentTarget.dataset;
		try {
			const response = await dataAPI.get(`/products/customer/detailProducts/${prodId}`);
			detailproduct = response.data.data;
			// console.log(detailproduct);
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Oops!',
				confirmButtonColor: '#596066',
				customClass: 'swal-height',
				text: 'An error occurred while fetching data'
			});
		}
	}

	function handleproduct() {
        goto(`/user/product`);
    }

	onMount(async () => {
		await getProduct();
		
	});
</script>
<div class="banner">
	<img class="block w-100 mt-2" src="/banner.png" alt="Sock Energy" />
</div>
<div class="container lg mx-auto">
	<h1 class="text-xl font-belanosima d-flex justify-center mt-4">NEW PRODUCT</h1>
	<div class="flex justify-center ">
		<div class="border-b border-black border-1 w-36 "></div>
	</div>
	<!-- <div class="flex justify-center ">
		<div class="border-b border-black border-1  w-32 "></div>
	</div>
	<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
		<div class="carousel-inner">
			<div class="carousel-item active">
				<div class="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 mt-4">
						{#each products as post }
							<div class="card border-none cursor-pointer" data-bs-toggle="modal"
								data-bs-target="#exampleModal">
								<img
									src={post.prod_image
									? `${url_API}/products/image/${post?.prod_image}`
									: '/product-default.png'}
									class="w-80 h-72 "
									alt=""
								/>	
								<div class="card-body">
									<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
										{post.prod_name}
									</h1>
									<p class="card-text text-center">{`Rp ${Number(post.prod_price).toLocaleString('id-ID')}`}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
		</div>
		<button
			class="carousel-control-prev h-24 mt-32"
			type="button"
			data-bs-target="#carouselExampleControls"
			data-bs-slide="prev"
		>
			<span class="carousel-control-prev-icon" aria-hidden="true" />
			<span class="visually-hidden">Previous</span>
		</button>
		<button
			class="carousel-control-next h-24 mt-32"
			type="button"
			data-bs-target="#carouselExampleControls"
			data-bs-slide="next"
		>
			<span class="carousel-control-next-icon" aria-hidden="true" />
			<span class="visually-hidden">Next</span>
		</button>
	</div> -->

	<div id="carouselExampleIndicators" class="carousel slide">
		<div class="carousel-indicators">
			<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
			<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
			<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
		</div>
		<div class="carousel-inner">
			<div class="carousel-item active">
				<div class="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 mt-4">
					{#if products1.length > 0}
					{#each products1 as post }
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="card border-none cursor-pointer" data-bs-toggle="modal"
							data-bs-target="#DetailProduct" data-prod-id={post?.prod_id}
							on:click={fetchDetailProduct} >
							<img
								src={post.prod_image
								? `${url_API}/products/image/${post?.prod_image}`
								: '/product-default.png'}
								class="w-80 h-72 "
								alt=""
							/>	
							<div class="card-body">
								<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
									{post.prod_name}
								</h1>
								<p class="card-text text-center">{`Rp ${Number(post.prod_price).toLocaleString('id-ID')}`}</p>
							</div>
						</div>
					{/each}
					{/if}
				</div>
			</div>
			<div class="carousel-item">
				<div class="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 mt-4">
					{#if products2.length > 0}
					{#each products2 as post }
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="card border-none cursor-pointer" data-bs-toggle="modal"
							data-bs-target="#DetailProduct" data-prod-id={post?.prod_id}
							on:click={fetchDetailProduct} >>
							<img
								src={post.prod_image
								? `${url_API}/products/image/${post?.prod_image}`
								: '/product-default.png'}
								class="w-80 h-72 "
								alt=""
							/>	
							<div class="card-body">
								<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
									{post.prod_name}
								</h1>
								<p class="card-text text-center">{`Rp ${Number(post.prod_price).toLocaleString('id-ID')}`}</p>
							</div>
						</div>
					{/each}
					{/if}
				</div>
			</div>
			<div class="carousel-item">
				<div class="grid lg:grid-cols-4 gap-4 sm:grid-cols-2 mt-4">
					{#each products as post }
						<div class="card border-none cursor-pointer" data-bs-toggle="modal"
							data-bs-target="#exampleModal">
							<img
								src={post.prod_image
								? `${url_API}/products/image/${post?.prod_image}`
								: '/product-default.png'}
								class="w-80 h-72 "
								alt=""
							/>	
							<div class="card-body">
								<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
									{post.prod_name}
								</h1>
								<p class="card-text text-center">{`Rp ${Number(post.prod_price).toLocaleString('id-ID')}`}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
		</div>
		<div class="flex justify-center">
			
			<button
				on:click={handleproduct}
				
				class="w-36  font-base  h-9 mt-2 mb-3 rounded-full border-2 text-black font-base text-sm hover:underline  hover:bg-slate-50"

			>
				VIEW ALL
			</button>		
		</div>
	
	
	<div class="container lg mx-auto">
		<h1 class="text-xl font-belanosima d-flex justify-center mt-4">CATEGORIES</h1>
		<div class="flex justify-center ">
			<div class="border-b border-black border-1  w-32 "></div>
		</div>

		<div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 mt-4">
			<div class="card border-none">
				<img src="/active.jpg" class="card-img-top lg: w-100 lg:h-auto sm:: w-20 sm:h-auto" alt="..." />
				<div class=" bg-black h-35">
					<h1 class="text-2xl font-nats font-black leading-6 text-center text-white px-2 py-2">
						Active Sock
					</h1>
				</div>
			</div>
			<div class="card border-none">
				<img src="/triball.jpg" class="card-img-top" alt="..." />
				<div class=" bg-black h-35">
					<h1 class="text-2xl font-nats font-black leading-6 text-center text-white px-2 py-2">
						Tribal Sock
					</h1>
				</div>
			</div>
			<div class="card border-none">
				<img src="/classic.jpg" class="card-img-top" alt="..." />
				<div class=" bg-black h-35">
					<h1 class="text-2xl font-nats font-black leading-6 text-center text-white px-2 py-2">
						Classic Sock
					</h1>
				</div>
			</div>
		</div>
	</div>

	<h1 class="text-xl font-belanosima d-flex justify-center mt-5">OUR GALLERY</h1>
	<div class="flex justify-center ">
		<div class="border-b border-black border-1 w-32 "></div>
	</div>
	
	<div class="row mt-3">
		<div class="col-md-8">
			<img src="/gallery2.png" class=" w-100 h-30 mb-2 mb-md-4 shadow-1-strong cursor-zoom-in" data-bs-toggle="modal" data-bs-target="#galleryModal" alt="" />
		</div>
		<div class="col-md-4">
			<img src="/gallery4.jpg" class=" w-30 h-100 mb-2 mb-md-4 shadow-1-strong cursor-zoom-in" data-bs-toggle="modal" data-bs-target="#galleryModal" alt="" />
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-md-4">
			<img src="/gallery5.jpg" class=" w-100 h-30 mb-2 mb-md-4 shadow-1-strong cursor-zoom-in" data-bs-toggle="modal" data-bs-target="#galleryModal" alt="" />
		</div>
		<div class="col-md-8">
			<img src="/gallery3.png" class=" w-30 h-100 mb-2 mb-md-4 shadow-1-strong cursor-zoom-in" data-bs-toggle="modal" data-bs-target="#galleryModal" alt="" />
		</div>
	</div>

<div
	class="modal fade"
	id="DetailProduct"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
		<div class="modal-content">
			<div class="modal-header">
			<h3 class="modal-title font-bold text-xl" id="exampleModalLabel">Detail Product</h3>
			<button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
				<span class="sr-only">Close menu</span>
					<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			</div>
			<div class="modal-body">
				<div class="grid grid-cols-2 gap-2">
					{#each detailproduct as post }
						<div class="flex justify-center items-center">
							<img
								src={post.prod_image
								? `${url_API}/products/image/${post?.prod_image}`
								: '/product-default.png'}
								class="w-96"
								alt=""
							/>
						</div>
						<div class="content-between">
							<div class="">
								<h1 class="text-xl font-bold">{post?.prod_name}</h1>
								<h1 class="font-semibold text-2xl text-red-400 whitespace-normal mt-3 ">{`Rp ${Number(post.prod_price).toLocaleString('id-ID')}`}</h1>
								<div class="flex justify-start items-center gap-5 mt-3">
									<h1 class="font-semibold text-xl ">Quantity</h1>
									<div class="flex justify-center gap-1">
										<img on:click={increment} src="/add.svg" alt="" class="w-4 cursor-pointer" />
										<p  class="text-base font-xl text-gray-900  whitespace-normal" >
											{qty}
										</p>
										<img on:click={decrement} src="/remove.svg" alt="" class="w-4 cursor-pointer" />
									</div>
									<h1 class="font-medium text-base text-gray-500 ">30 stock</h1>
									<input type="text" bind:value={qty} class="invisible"  />										
								</div>
								<div class="mt-3">
									<h1 class="font-semibold text-xl ">Description </h1>
									<div class="border-b border-1 border-black mt-1"></div>
									<p class="text-sm font-medium whitespace-normal break-all mt-2">{@html post?.prod_desc}</p>
								</div>
							</div>
							<div class="mt-5">
								<button type="submit" on:click={AddToCart} data-prod-id={post?.prod_id}
									class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-5 "
									>ADD TO CART</button
								>
							</div>
						</div>
					{/each}
				</div>
				
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="galleryModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content bg-black">
		
    	<!-- <div id="carouselExample" class="carousel slide">
			<div class="carousel-inner">
				<button type="button" data-bs-dismiss="modal" aria-label="Close" class="rounded-md p-2 inline-flex items-center justify-center text-gray-400 ">
					<span class="sr-only">Close menu</span>
						<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<div class="carousel-item active">
					<img src="/gallery2.png"  class="d-block w-100" alt="...">
				</div>
				<div class="carousel-item">
					<img src="/gallery3.png"   class="d-block w-100" alt="...">
				</div>
				<div class="carousel-item">
					<img src="/gallery4.jpg"   class="d-block w-100" alt="...">
				</div>
			</div>
			
			<button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>
		</div> -->

		<div id="gallery" class="relative w-full" data-carousel="slide">
			<!-- Carousel wrapper -->
			<div class="relative h-96 overflow-hidden rounded-lg md:h-96">
				<!-- Item 1 -->
				<div class="hidden duration-700 ease-in-out" data-carousel-item>
					<img src="/gallery2.png" class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="">
				</div>
				<!-- Item 2 -->
				<div class="hidden duration-700 ease-in-out" data-carousel-item="active">
					<img src="/gallery3.png" class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="">
				</div>
				<!-- Item 3 -->
				<div class="hidden duration-700 ease-in-out" data-carousel-item>
					<img src="/gallery2.png" class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="">
				</div>
				<!-- Item 4 -->
				<div class="hidden duration-700 ease-in-out" data-carousel-item>
					<img src="/gallery3.png" class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="">
				</div>
				<!-- Item 5 -->
				<div class="hidden duration-700 ease-in-out" data-carousel-item>
					<img src="/gallery3.png" class="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="">
				</div>
			</div>
			<!-- Slider controls -->
			<button type="button" class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
				<span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg class="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
					</svg>
					<span class="sr-only">Previous</span>
				</span>
			</button>
			<button type="button" class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
				<span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
					<svg class="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
					</svg>
					<span class="sr-only">Next</span>
				</span>
			</button>
		</div>

      
    </div>
  </div>
</div>


	<!-- <div class="lightbox">
		<div class="row">
			<div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
				<img
					src="/gallery1.png"
					data-mdb-img="https://mdbcdn.b-cdn.net/img/Photos/Slides/1.webp"
					alt="Table Full of Spices"
					class="w-100 mb-2 mb-md-4 shadow-1-strong"
				/>

				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain1.webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Wintry Mountain Landscape"
				/>
			</div>

			<div class="col-lg-4 mb-4 mb-lg-0">
				<img
					src="/gallery2.png"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Mountains in the Clouds"
				/>

				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Boat on Calm Water"
				/>
			</div>

			<div class="col-lg-4 mb-4 mb-lg-0">
				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(18).webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Waves at Sea"
				/>

				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain3.webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Yosemite National Park"
				/>
			</div>
		</div>
	</div> -->
</div>

<style>
	.carousel-control-prev-icon,
	.carousel-control-next-icon {
		height: 35px;
		width: 35px;
		outline: black;
		background-size: 100%, 100%;
		border-radius: 50%;
		background-image: none;
		background-color: black;
	}

	.carousel-control-next-icon:after {
		content: '>';
		font-size: 20px;
		color: white;
	}

	.carousel-control-prev-icon:after {
		content: '<';
		font-size: 20px;
		color: white;
	}
</style>
