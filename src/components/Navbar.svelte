<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { goto } from "$app/navigation";
  import { dataAPI } from "../routes/utils/axios";
  import { countCartBadge } from "$components/countCartBadge";
  import { updateCartCountUI } from "$components/countCartBadge";
  import moment from "moment";

  const url_API = import.meta.env.VITE_API_SOCK;
  let user_id = "",
    usernname = "",
    userRoles = "",
    user_photo = "";
  // token = '';

  // $: console.log(user_photo);

  let cartCount = 0;

  function logoutHandler() {
    localStorage.clear();
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Sign out successfully",
    });
    goto("/login");
  }

  let pages = parseInt(1),
    total,
    address = [];

  async function getAddress() {
    try {
      const res = await dataAPI.get(`/address?page=${pages}&record=10`);
      address = res.data.data;
      total = res.data.pagination.totalPage;
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (e) => {
    pages = e.detail;
    getProduct();
  };

  let formData = {};
  let province = [];

  async function fetchProvince(event) {
    try {
      const res = await dataAPI.get(`/address/province`);
      province = res.data.data;

      const provinceId = event.target.value;

      // console.log(provinceId);

      fetchCity(provinceId);
    } catch (error) {
      return error;
    }
  }

  let city = [];

  async function fetchCity(provinceId, event) {
    try {
      const res = await dataAPI.get(`/address/city/${provinceId}`);
      city = res.data.data;

      const cityId = event.target.value;

      // console.log(cityId);

      fetchDistrict(cityId);
    } catch (error) {
      return error;
    }
  }

  let district = [];

  async function fetchDistrict(cityId, event) {
    try {
      const res = await dataAPI.get(`/address/district/${cityId}`);
      district = res.data.data;

      // Log the district data
      const districtId = event.target.value;

      // console.log(districtId);

      fetchVillage(districtId);
    } catch (error) {
      return error;
    }
  }

  let village = [];

  async function fetchVillage(districtId, event) {
    try {
      const res = await dataAPI.get(`/address/village/${districtId}`);
      village = res.data.data;

      // Log the district data
      const villageId = event.target.value;

      // console.log(villageId);

      // fetchVillage();
    } catch (error) {
      return error;
    }
  }

  let checkboxValue = "";
  const handleCheckboxChange = async (event, addressId) => {
    checkboxValue = formData.default === "default" ? "undefault" : "default";
    console.log(checkboxValue);

    event.preventDefault();

    try {
      const response = await fetch(
        `${url_API}/address/editAddress/${addressId}`,
        {
          method: "POST",
          body: JSON.stringify({
            add_mark_default: checkboxValue,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await getAddress();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${url_API}/address/createAddress`, {
        method: "POST",
        body: JSON.stringify({
          add_personal_name: formData.add_personal_name,
          add_phone_number: formData.add_phone_number,
          add_province: formData.provinceId,
          add_city: formData.cityId,
          add_district: formData.districtId,
          add_village: formData.villageId,
          add_address: formData.add_address,
          add_detail_address: formData.add_detail_address,
          add_mark: formData.add_mark,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Your address has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        await getAddress();
        formData = {};
      } else {
        const errorData = await response.json(); // Assuming the error response is in JSON format
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong! ${errorData.message}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  let updData = {};
  let add_province_id = "";
  let add_city_id = "";
  let add_district_id = "";
  let add_village_id = "";

  async function handleDetail(event, addressId) {
    event.preventDefault();

    try {
      const response = await dataAPI.get(
        `/address/detailAdddress/${addressId}`
      );
      updData = response.data.data;
      // console.log(updData);
      formData.id = updData.id;
      formData.add_personal_name = updData.personal_name;
      formData.add_phone_number = updData.phone_number;
      formData.add_province = updData.province;
      add_province_id = updData.id_province;
      formData.add_city = updData.city;
      add_city_id = updData.id_city;
      formData.add_district = updData.district;
      add_district_id = updData.id_district;
      formData.add_village = updData.village;
      add_village_id = updData.id_village;
      formData.add_address = updData.address;
      formData.add_detail_address = updData.detail_address;
      formData.add_mark = updData.mark;
      formData.add_default = updData.default;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(error);
    }
  }

  const handleUpdateData = async (addressId) => {
    // const { addressId } = e.currentTarget.dataset;
    try {
      const response = await fetch(
        `${url_API}/address/editAddress/${addressId}`,
        {
          method: "POST",
          body: JSON.stringify({
            add_personal_name: formData.add_personal_name,
            add_phone_number: formData.add_phone_number,
            add_province: formData.provinceId || add_province_id,
            add_city: formData.cityId || add_city_id,
            add_district: formData.districtId || add_district_id,
            add_village: formData.villageId || add_village_id,
            add_address: formData.add_address,
            add_detail_address: formData.add_detail_address,
            add_mark: formData.add_mark,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Your address has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        await getAddress();
        formData = {};
      } else {
        const errorData = await response.json(); // Assuming the error response is in JSON format
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong! ${errorData.message}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (event, addressId) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${url_API}/address/deleteAddress/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await getAddress();
    } catch (error) {
      console.log(error);
    }
  };

  onMount(async () => {
    await countCartBadge();
    await getAddress();
    await fetchProvince();
    user_id = $page.data.user.user_id;
    usernname = $page.data.user.username;
    userRoles = $page.data.user.roleType;
    user_photo = $page.data.user.user_photo;
    if (localStorage.getItem("token")) {
      cartCount = await countCartBadge();

      updateCartCountUI();
    }

    // console.log(cartCount);
    // if (!localStorage.getItem('token')) goto('/');

    // console.log(cartCount, 'Cart Update');
  });
</script>

<nav class="bg-slate-50 sticky-top">
  <div class="flex flex-shrink-0 justify-center">
    <img
      class="block h-8 w-auto mt-2 lg:hidden"
      src="/logo3.png"
      alt="Sock Energy"
    />
    <img
      class="hidden mt-2 h-30 w-40 lg:block"
      src="/logo3.png"
      alt="Your Company"
    />
  </div>
  <div class="flex flex-shrink-0 justify-center">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>

            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>

            <svg
              class="hidden h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-5">
              {#if $page.url.pathname.includes("/user")}
                <a
                  href="/user/dashboard"
                  class=" text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/user/dashboard")}
                  aria-current="page">Home</a
                >
                <a
                  href="/user/product"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/user/product")}
                  >All Product</a
                >
                <a
                  href="/user/categories"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/user/categories")}
                  >Categories</a
                >
                <a
                  href="/user/cart"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/user/cart")}
                  >Cart
                  <div
                    id="cart-count"
                    class="absolute inline-flex items-center justify-center w-8 h-6 text-xs font-semibold text-white bg-red-500 border-2 border-gray-300 rounded-full top-2"
                  >
                    0
                  </div>
                </a>
                <a
                  href="/user/about"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/user/about")}
                  >About</a
                >
                <a
                  href="/user/tracking"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/user/tracking")}
                  >Orders</a
                >

                <div class="dropdown flex justify-center items-center gap-2">
                  <img
                    class="w-7 h-7 rounded-full"
                    src={user_photo
                      ? `${url_API}/auth/image/${user_photo}`
                      : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                    alt=""
                  />
                  <!-- <img
										class="w-7 h-7 rounded-full "
										src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
										alt="user photo"
									/> -->
                  <button
                    type="button"
                    class="flex text-sm"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <p class="text-black text-base break-all whitespace-normal">
                      {usernname}
                    </p>
                  </button>
                  <ul
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <button
                        class="dropdown-item focus:text-black focus:bg-transparent"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdropProfile"
                        >Update Profile</button
                      >
                    </li>
                    <li>
                      <button
                        class="dropdown-item focus:text-black focus:bg-transparent"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdropAddress"
                        >Address Book</button
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item focus:text-black focus:bg-transparent"
                        href="/login"
                        on:click={logoutHandler}>Logout</a
                      >
                    </li>
                  </ul>
                </div>
                <!-- <a
									href="#!" on:click={logoutHandler}
									class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
									>Sign Out</a
								> -->
                <!-- {#if (localStorage.getItem('token'))}
								{:else}
									<a
										href="/login" 
										class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
										>Sign In</a
									>
								{/if} -->
              {:else}
                <a
                  href="/guest/dashboard"
                  class=" text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/guest/dashboard")}
                  aria-current="page">Home</a
                >
                <a
                  href="/guest/product"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/guest/product")}
                  >All Product</a
                >
                <a
                  href="/guest/categories"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes(
                    "/guest/categories"
                  )}>Categories</a
                >
                <a
                  href="/login"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/login")}
                  id="dropdownHoverButton1"
                  data-dropdown-toggle="dropdownHover1"
                  data-dropdown-trigger="hover">Cart</a
                >
                <div
                  id="dropdownHover1"
                  class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                  <ul
                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownHoverButton1"
                  >
                    <li>
                      <a href="#" class="block px-4 py-2">
                        <div class="flex justify-center items-center">
                          <img
                            class="w-48 px-3 py-3"
                            src="/empty-logo.png"
                            alt=""
                          />
                        </div>
                        <div class="flex justify-center items-center">
                          <p
                            class=" text-center text-sm font-semibold uppercase text-gray-800"
                          >
                            No product yet
                          </p>
                        </div>
                        <div class="flex justify-center items-center">
                          <p
                            class=" text-center text-sm font-medium text-gray-800"
                          >
                            Please Sign in
                          </p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <a
                  href="/guest/about"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/guest/about")}
                  >About</a
                >
                <a
                  href="/login"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  class:active={$page.url.pathname.includes("/login")}
                  id="dropdownHoverButton"
                  data-dropdown-toggle="dropdownHover"
                  data-dropdown-trigger="hover">Orders</a
                >
                <div
                  id="dropdownHover"
                  class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                  <ul
                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownHoverButton"
                  >
                    <li>
                      <a href="#" class="block px-4 py-2">
                        <div class="flex justify-center items-center">
                          <img
                            class="w-48 px-3 py-3"
                            src="/empty-logo.png"
                            alt=""
                          />
                        </div>
                        <div class="flex justify-center items-center">
                          <p
                            class=" text-center text-sm font-semibold uppercase text-gray-800"
                          >
                            No orders yet
                          </p>
                        </div>
                        <div class="flex justify-center items-center">
                          <p
                            class=" text-center text-sm font-medium text-gray-800"
                          >
                            Please Sign in
                          </p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <a
                  href="/login"
                  class="text-black rounded-md px-3 py-2 font-medium hover:bg-gray-200"
                  >Sign In</a
                >
              {/if}

              <!-- Current: "bg-gray-900 text-black", Default: "text-black hover:bg-gray-200 hover:text-black" -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <div class="sm:hidden" id="mobile-menu">
    <div class="space-y-1 px-2 pb-3 pt-2">
      <!-- Current: "bg-gray-900 text-black", Default: "text-black hover:bg-gray-200 hover:text-black" -->
      <a
        href="#"
        class="bg-gray-900 text-black block rounded-md px-3 py-2 text-base font-medium"
        aria-current="page">Dashboard</a
      >
      <a
        href="#"
        class="text-black hover:bg-gray-200 hover:text-black block rounded-md px-3 py-2 text-base font-medium"
        >Team</a
      >
      <a
        href="#"
        class="text-black hover:bg-gray-200 hover:text-black block rounded-md px-3 py-2 text-base font-medium"
        >Projects</a
      >
      <a
        href="#"
        class="text-black hover:bg-gray-200 hover:text-black block rounded-md px-3 py-2 text-base font-medium"
        >Calendar</a
      >
    </div>
  </div>
</nav>

<div
  class="modal fade"
  id="staticBackdropAddress"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title font-bold text-xl" id="staticBackdropLabel">
          Address Book
        </h1>
        <button
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
          class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span class="sr-only">Close menu</span>
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-base font-semibold text-gray-900">My Address</h3>
          <button
            class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline"
            data-bs-toggle="modal"
            data-bs-target="#AddModal">Add Address</button
          >
        </div>
        {#each address as post}
          <div class="border-2 border-gray-200 rounded-lg px-3 py-2 mb-2">
            <div class="flex items-center">
              {#if post?.default === "default"}
                <input
                  id="default-radio-1"
                  type="radio"
                  value=""
                  name="default-radio"
                  class="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-red-500"
                  checked
                  disabled
                />
              {:else}
                <input
                  id="default-radio-1"
                  type="radio"
                  value=""
                  name="default-radio"
                  class="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-red-500"
                  disabled
                />
              {/if}
              <label
                for="default-radio-1"
                class="ms-2 text-base font-semibold text-gray-900"
                >{post?.personal_name} - {post?.mark}</label
              >
            </div>
            <div class="px-4 flex justify-between">
              <h4 class="font-medium text-sm text-gray-900">
                {post?.address} ({post?.detail_address})
              </h4>
              <h4 class="font-semibold text-sm text-gray-900">
                {moment(post?.created_at).format("MMMM Do YYYY, h:mm:ss a")}
              </h4>
            </div>
            <div class="px-4">
              <h4 class="font-semibold text-sm mt-1 text-gray-900">
                Mobile - <span class="text-red-500">{post?.phone_number}</span>
              </h4>
            </div>
            <div class="flex items-center gap-2 mt-2 px-4">
              <button
                id="handleDelete"
                class="w-28 font-base h-9 mt-2 mb-3 rounded-md border text-black font-base text-sm hover:underline hover:bg-slate-50"
                on:click={(event) => handleDelete(event, post?.id)}
              >
                Remove
              </button>
              <button
                on:click={(event) => handleDetail(event, post?.id)}
                data-bs-toggle="modal"
                data-bs-target="#UpdateModal"
                class="w-28 font-base h-9 mt-2 mb-3 rounded-md border text-black font-base text-sm hover:underline hover:bg-slate-50"
              >
                Update
              </button>
              {#if post.default != "default"}
                <button
                  on:click={(event) => handleCheckboxChange(event, post?.id)}
                  class="w-32 font-base h-9 mt-2 mb-3 rounded-md border text-black font-base text-sm hover:underline hover:bg-slate-50"
                >
                  Change to default
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="AddModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">
          Add Address
        </h5>
        <button
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
          class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span class="sr-only">Close menu</span>
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form on:submit={handleSubmit}>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Personal Name</label
              >
              <input
                type="text"
                id="product-input"
                placeholder="Please input your personal name"
                bind:value={formData.add_personal_name}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div class="mb-3">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Phone Number
              </label>
              <input
                type="number"
                id="quantiy-input"
                placeholder="Please input your mobile number"
                bind:value={formData.add_phone_number}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your Province</label
              >
              <select
                on:change={fetchProvince}
                bind:value={formData.provinceId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select Province</option>
                {#each province as prov}
                  <option value={prov.id}>{prov.name}</option>
                {/each}
              </select>
            </div>
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your City</label
              >
              <select
                on:change={(event) => fetchCity(formData.provinceId, event)}
                bind:value={formData.cityId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select City</option>
                {#each city as cit}
                  <option value={cit.id}>{cit.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your District</label
              >
              <select
                on:change={(event) => fetchDistrict(formData.cityId, event)}
                bind:value={formData.districtId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select District</option>
                {#each district as dis}
                  <option value={dis.id}>{dis.name}</option>
                {/each}
              </select>
            </div>
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your Village</label
              >
              <select
                on:change={(event) => fetchVillage(formData.districtId, event)}
                bind:value={formData.villageId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select Village</option>
                {#each village as vill}
                  <option value={vill.id}>{vill.name}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Address</label
              >
              <textarea
                id="message"
                rows="4"
                bind:value={formData.add_address}
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
            <div class="mb-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Detail Address</label
              >
              <textarea
                id="message"
                rows="4"
                bind:value={formData.add_detail_address}
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="website-admin"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Mark</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="website-admin"
                  bind:value={formData.add_mark}
                  class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Please add your mark address"
                />
              </div>
              <!-- <div class="flex items-center mt-3">
  							<input bind:value={checkboxValue} id="default-checkbox" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500" checked={checkboxValue === 'default'} on:change={handleCheckboxChange}>
      						<label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Make it the main address</label>
						</div> -->
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            data-bs-dismiss="modal"
            aria-label="Close"
            class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >Cancel</button
          >
          <button
            type="submit"
            class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900"
            >Save Address</button
          >
        </div>
      </form>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="UpdateModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">
          Update Address
        </h5>
        <button
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
          class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span class="sr-only">Close menu</span>
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form>
        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Personal Name</label
              >
              <input
                type="text"
                id="product-input"
                placeholder="Please input your personal name"
                bind:value={formData.add_personal_name}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div class="mb-3">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Phone Number
              </label>
              <input
                type="number"
                id="quantiy-input"
                placeholder="Please input your mobile number"
                bind:value={formData.add_phone_number}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your Province</label
              >
              <select
                on:change={fetchProvince}
                bind:value={formData.provinceId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">{updData.province}</option>
                {#each province as prov}
                  <option value={prov.id}>{prov.name}</option>
                {/each}
              </select>
            </div>
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your City</label
              >
              <select
                on:change={(event) => fetchCity(formData.provinceId, event)}
                bind:value={formData.cityId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">{formData.add_city}</option>
                {#each city as cit}
                  <option value={cit.id}>{cit.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your District</label
              >
              <select
                on:change={(event) => fetchDistrict(formData.cityId, event)}
                bind:value={formData.districtId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">{formData.add_district}</option>
                {#each district as dis}
                  <option value={dis.id}>{dis.name}</option>
                {/each}
              </select>
            </div>
            <div class="mb-3">
              <label
                for="countries"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Select your Village</label
              >
              <select
                on:change={(event) => fetchVillage(formData.districtId, event)}
                bind:value={formData.villageId}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">{formData.add_village}</option>
                {#each village as vill}
                  <option value={vill.id}>{vill.name}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Address</label
              >
              <textarea
                id="message"
                rows="4"
                bind:value={formData.add_address}
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
            <div class="mb-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Detail Address</label
              >
              <textarea
                id="message"
                rows="4"
                bind:value={formData.add_detail_address}
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="mb-3">
              <label
                for="website-admin"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Mark</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="website-admin"
                  bind:value={formData.add_mark}
                  class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Please add your mark address"
                />
              </div>
              <!-- <div class="flex items-center mt-3">
  							<input bind:value={checkboxValue} id="default-checkbox" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500" checked={checkboxValue === 'default'} on:change={handleCheckboxChange}>
      						<label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Make it the main address</label>
						</div> -->
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            data-bs-dismiss="modal"
            aria-label="Close"
            class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >Cancel</button
          >
          <button
            type="submit"
            data-adress-id={formData.id}
            on:click={(event) => handleUpdateData(formData.id, event)}
            class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900"
            >Update Address</button
          >
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  .active {
    background-color: rgb(209 213 219);
  }
</style>
