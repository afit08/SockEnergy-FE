<script></script>

<div class="container lg mx-auto">
	<h1 class="text-xl font-belanosima d-flex justify-center mt-4">CART</h1>

	<div class="row mt-5">
		<div class="col-md-8">
			<div class="rounded shadow-md sm:rounded-lg">
				<table class="w-full rounded text-sm text-left text-gray-500 mt-2">
					<thead class="text-base text-black uppercase border-dark border-bottom">
						<tr>
							<th scope="col" class="px-6 py-3"> Product name </th>
							<th scope="col" class="px-8 py-3"> Price </th>
							<th scope="col" class="px-8 py-3"> Quantity </th>
							<th scope="col" class="px-8 py-1"> Total </th>
							<th scope="col" class="px-3 py-3"> Action </th>
						</tr>
					</thead>
					<tbody>
						<tr class="bg-white border-bottom">
							<td class="px-3 py-2">
								<div class="d-flex justify-items-center">
									<img src="/triball.jpg" class="w-36 px-3 py-1" alt="" />
									<p class="text-base font-medium text-gray-900  whitespace-normal flex items-center">
										Kaos Kaki Sock Energy Classic Sock Stick Game Black
									</p>
								</div>
							</td>

							<td class="px-3 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							<td class="px-3 py-2">
								<div class="flex justify-center gap-1">
									<img src="/add.svg" alt="" class="w-4" />
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										2
									</p>
									<img src="/remove.svg" alt="" class="w-4" />
								</div>
							</td>
							<td class="px-3 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							<td class="px-3 py-2">
								<a href="#" class="text-base font-medium text-red-400 dark:text-red-300 hover:underline"
									>Remove</a
								>
							</td>
						</tr>
						<tr class="bg-white border-bottom">
							<td class="px-3 py-2">
								<div class="d-flex justify-items-center">
									<img src="/triball.jpg" class="w-36 px-3 py-1" alt="" />
									<p class="text-base font-medium text-gray-900  whitespace-normal flex items-center">
										Kaos Kaki Sock Energy Classic Sock Stick Game Black
									</p>
								</div>
							</td>

							<td class="px-3 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							<td class="px-3 py-2">
								<div class="flex justify-center gap-1">
									<img src="/add.svg" alt="" class="w-4" />
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										1
									</p>
									<img src="/remove.svg" alt="" class="w-4" />
								</div>
							</td>
							<td class="px-3 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							<td class="px-3 py-2">
								<a href="#" class="text-base font-medium text-red-400 dark:text-red-300 hover:underline"
									>Remove</a
								>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="col-md-4">
			<div class="card bg-gray-200 mt-2">
				<h1 class="px-6 py-3 text-base text-black uppercase font-bold">Total 2 Product</h1>
				<hr />

				<h1 class=" px-6 py-3 text-xl font-semibold text-gray-900  whitespace-normal">
					Rp. 34.999
				</h1>
				<div class="container">
					<button
						data-bs-toggle="modal"
						data-bs-target="#exampleModal"
						class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3"
						>CHECKOUT</button
					>
				</div>
			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="exampleModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-dialog-scrollable modal-lg">
		<div class="modal-content">
			<div class="modal-body">
				<table class="w-full rounded  text-left mt-3">
					<thead class="text-base text-black border-dark border-bottom" >
						<tr>
							<th scope="col" class="w-64 px-2 py-2 bg-white"> Shipping Address </th>
							<th scope="col" class="w-96 bg-white" />
							<th scope="col" class="w-30 bg-white" />
						</tr>
					</thead>
					<tbody>
						<tr class="bg-white border-bottom">
							<td class="px-2 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Syafitriawan Akbar Rabbani
								</p>
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									(+62) 895346747092
								</p>
							</td>
							<td class="px-1 py-2">
								<div class="flex justify-center gap-1">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										Jl. Nurul Hidayah Gg Kunta RT/RW 004/003 No.56,KOTA JAKARTA TIMUR - KRAMAT JATI,
										DKI JAKARTA, ID 13540
									</p>
								</div>
							</td>
							<td class="px-3 py-2">
								<a href="#" class="text-base font-medium whitespace-nowrap text-red-400 dark:text-red-300 hover:underline"
									>Change Address</a
								>
							</td>
						</tr>
					</tbody>
				</table>
				<h1 class="font-bold text-base mt-3">Ordered Product</h1>
				<table class="w-full rounded text-sm text-left border-dark border-bottom mt-1">
					<thead class="text-base text-black border-dark border-bottom">
						<tr>
							<th scope="col" class=" px-2 py-2 font-semibold"> Product name </th>
							<th scope="col" class=" px-2 py-2 font-semibold w-36"> Price </th>
							<th scope="col" class=" px-2 py-2 font-semibold"> Quantity </th>
							<th scope="col" class=" px-2 py-2 font-semibold w-36"> Total </th>
						</tr>
					</thead>
					<tbody>
						<tr class="bg-white border-bottom">
							<td class="px-2 py-2">
								<div class="d-flex justify-items-center">
									<img src="/triball.jpg" class="w-36 px-3 py-1" alt="" />
									<p class="text-base font-medium text-gray-900  whitespace-normal flex items-center">
										Kaos Kaki Sock Energy Classic Sock Stick Game Black
									</p>
								</div>
							</td>

							<td class="px-2 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							<td class="px-2 py-2">
								<div class="flex justify-center gap-1">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										2x
									</p>
								</div>
							</td>
							<td class="px-2 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>

						</tr>
						<tr class="bg-white border-bottom">
							<td class="px-2 py-2">
								<div class="d-flex justify-items-center">
									<img src="/triball.jpg" class="w-36 px-3 py-1" alt="" />
									<p class="text-base font-medium text-gray-900  whitespace-normal flex items-center">
										Kaos Kaki Sock Energy Classic Sock Stick Game Black
									</p>
								</div>
							</td>

							<td class="px-2 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							<td class="px-2 py-2">
								<div class="flex justify-center gap-1">
									<p class="text-base font-medium text-gray-900  whitespace-normal">
										2x
									</p>
								</div>
							</td>
							<td class="px-2 py-2">
								<p class="text-base font-medium text-gray-900  whitespace-normal">
									Rp. 34.999
								</p>
							</td>
							
						</tr>
					</tbody>
				</table>

				<div class="grid grid-cols-3 gap-0 mt-4">
					<div class="">
						<h1 class="font-semibold">Payment Method</h1>
					</div>
					<div class="col-span-2 flex justify-start gap-2">
						<!-- <button class=" flex justify-start items-center gap-1 border-solid border-2 border-black rounded py-1 px-1">
							<h1 class="text-sm font-semibold whitespace-normal hover:underline">Case On Develivery (COD)</h1>
						</button>
						<button class=" flex justify-start items-center gap-1 border-solid border-2 border-black rounded py-1 px-1">
							<h1 class="text-sm font-semibold whitespace-normal hover:underline">Transfer BCA</h1>
						</button> -->
						<button type="button" class="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
						
							<img src="/bca.svg" class="h-4 mr-2 -ml-1 w-12" alt="">
							Pay with BCA
						</button>
						<button type="button" class="text-white bg-[#ff541c] hover:bg-[#da4210]/80 focus:ring-4 focus:outline-none focus:ring-[#b73105]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
							<img src="/cod.png" class="h-6 mr-2 -ml-1 w-12" alt="">							
							Pay COD
						</button>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-5">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5">
						<h3 class="font-semibold text-base whitespace-nowrap">Subtotals for Products</h3>
						<h3 class="font-semibold text-base whitespace-normal flex justify-end">Rp 24.999</h3>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-1">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5 border-b border-black">
						<h3 class="font-semibold text-base whitespace-normal">Shipping Cost</h3>
						<h3 class="font-semibold text-base whitespace-normal flex justify-end">Rp 9.000</h3>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-0 mt-1">
					<div class="col-span-2 w-40"></div>
					<div class="grid grid-cols-2 gap-5">
						<h3 class="font-semibold text-base whitespace-nowrap">Total</h3>
						<h3 class="font-semibold text-xl text-red-400 whitespace-normal flex justify-end">Rp 33.999</h3>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-0 mt-4">
					<div class="col-span-2 w-40"></div>
					<button
						data-bs-toggle="modal"
						data-bs-target="#exampleModal"
						class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3"
						>MAKE AN ORDER</button
					>
				</div>


			</div>
		</div>
	</div>
</div>

<style>
	
</style>
