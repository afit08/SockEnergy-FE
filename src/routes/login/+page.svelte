<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { decodeJwt } from "$utils/jwt";
  import AES256 from "aes-everywhere";

  const url_API = import.meta.env.VITE_API_SOCK;
  const url_AES = import.meta.env.VITE_PW_AES;

  let username = "";
  let password = "";
  let isUsername = false;
  let isWarning = false;
  let inputPasswordRef;
  const handleLogin = () => {
    var encryptedUsername = AES256.encrypt(username, url_AES);
    var encryptedPassword = AES256.encrypt(password, url_AES);

    const user = localStorage.getItem("user");
    fetch(`${url_API}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({
        username: encryptedUsername,
        password: encryptedPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.statusText === "OK") {
          const result = await response.json();
          localStorage.setItem("token", result.token);

          const decodedUser = decodeJwt(result.token);

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
            title: "Signed in successfully",
          });

          switch (decodedUser.roleType) {
            case "admin":
              goto("/admin/dashboard");
              break;

            default:
              goto("/user/dashboard");
              break;
          }
        } else {
          isWarning = true;
          setTimeout(() => {
            isWarning = false;
          }, 2000);
          await Swal.fire({
            icon: "error",
            title: "Password incorrect",
            confirmButtonColor: "#596066",
            customClass: "swal-height",
            confirmButtonText: "Back to Login",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onMount(() => {
    const token = localStorage.getItem("token"),
      role = localStorage.getItem("role");

    if (token && role) {
      switch (role) {
        case "admin":
          goto("/admin/dashboard");
          break;
        default:
          goto("/user/dashboard");
          break;
      }
    }
  });
</script>

<div class="grid grid-cols-2">
  <div class="bg-slate-50 h-screen">
    <div class="container">
      <div class="px-5 py-5">
        <div
          class="flex flex-shrink-0 justify-center"
          style="margin-top: 5rem;"
        >
          <img class="h-auto w-64" src="/logo3.png" alt="Sock Energy" />
        </div>

        <h6 class="text-center text-zinc-600 text-sm font-normal tracking-wide">
          Welcome back! Please enter your details.
        </h6>
        <form
          on:submit|preventDefault={handleLogin}
          class=" mt-3 px-8 pt-6 pb-8 mb-4"
        >
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Username
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              bind:value={username}
            />
          </div>
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              bind:value={password}
            />
            <p class="text-red-500 text-xs italic">Please choose a password.</p>
          </div>
          <div class="flex items-end justify-end">
            <a class="text-sm font-medium tracking-tight text-black" href="#">
              Forgot Password?
            </a>
          </div>
          <button
            class="bg-red-500 text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <div class="w-100 h-3.5 text-center d-flex gap-1">
            <span class="text-zinc-600 text-sm font-medium tracking-tight"
              >Don’t have an account?</span
            ><span class="text-black text-sm font-medium tracking-tight" /><span
              class="text-red-500 text-sm font-medium tracking-tight"
              >Sign up for free!</span
            >
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    class=" bg-no-repeat bg-center"
    style="background-image: url(/bgcoverbaru.png); background-repeat: no-repeat;"
  />
</div>
