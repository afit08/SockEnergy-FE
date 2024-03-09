<script>
    import Navbar from '$components/Navbar.svelte';
    import Footer from '$components/Footer.svelte';
</script>

<Navbar/>
<div class="banner">
	<img class="block w-100 mt-2" src="/banner.png" alt="Sock Energy" />
</div>
<div class="container lg mx-auto">
	<h1 class="text-xl font-belanosima d-flex justify-center mt-4">BEST SELLER</h1>
	<p class="d-flex justify-center">PRODUCTS</p>
	<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
		<div class="carousel-inner">
			<div class="carousel-item active">
				<div class="grid grid-cols-4 gap-4 mt-4">
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
				</div>
			</div>
			<div class="carousel-item">
				<div class="grid grid-cols-4 gap-4 mt-4">
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
				</div>
			</div>
			<div class="carousel-item">
				<div class="grid grid-cols-4 gap-4 mt-4">
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
					<div class="card border-none">
						<img src="/product.png" class="card-img-top" alt="..." />
						<div class="card-body">
							<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
								Kaos Kaki Sock Energy Ancient Stripe-Black
							</h1>
							<p class="card-text text-center">Rp 34.999</p>
						</div>
					</div>
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
	</div>

	<h1 class="text-xl font-belanosima d-flex justify-center mt-3 mb-3">OUR GALLERY</h1>

	<div class="row">
		<div class="col-md-8">
			<img src="/gallery2.png" class=" w-100 h-30 mb-2 mb-md-4 shadow-1-strong" alt="" />
		</div>
		<div class="col-md-4">
			<img src="/gallery4.jpg" class=" w-30 h-100 mb-2 mb-md-4 shadow-1-strong" alt="" />
		</div>
	</div>

	<div class="row mb-5">
		<div class="col-md-4">
			<img src="/gallery5.jpg" class=" w-100 h-30 mb-2 mb-md-4 shadow-1-strong" alt="" />
		</div>
		<div class="col-md-8">
			<img src="/gallery3.png" class=" w-30 h-100 mb-2 mb-md-4 shadow-1-strong" alt="" />
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
<Footer/>

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
