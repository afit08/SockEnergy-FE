<script>
  //   import "../../app.css";
  import Navbar from "$components//Navbar.svelte";
  import Footer from "$components//Footer.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  //   export let data;
  const url_API = import.meta.env.VITE_API_SOCK;
  let token,
    user_id = "",
    usernname = "",
    userRoles = "",
    exp = "",
    user_photo = "";

  //   $: console.log(convertEpochToDatetime(exp));

  function convertEpochToDatetime(epochTimestamp) {
    const date = new Date(epochTimestamp * 1000); // multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleString(); // or use other date formatting methods if needed
  }

  onMount(async () => {
    // function to get user data profile when page loaded
    // await fetchUserData();
    token = localStorage.getItem("token");

    user_id = $page.data.user.user_id;
    exp = $page.data.user.exp;
    usernname = $page.data.user.username;
    userRoles = $page.data.user.roleType;
    user_photo = $page.data.user.user_photo;

    if (!token) {
      Swal.fire({
        title: "Inactive Alert",
        text: "Illegal access detected, you will logout in 2 seconds",
        icon: "warning",
        timer: 2000,
        background: "#fff",
        color: "#000",
        timerProgressBar: true,
      }).then(() => {
        logout();
      });
    } else if (isTokenExpired(exp)) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired, you will be logged out",
        icon: "warning",
        timer: 2000,
        background: "#fff",
        color: "#000",
        timerProgressBar: true,
      }).then(() => {
        logout();
      });
    }
  });

  function isTokenExpired(expirationTime) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return expirationTime < currentTimestamp;
  }

  function logout() {
    localStorage.clear();
    goto("/login");
  }

  // Check Token still active or expired
  //   function checkToken() {
  //     fetch(`${url_API}/backend/api/auth/valid_token`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           localStorage.clear();
  //           goto("/");
  //           location.reload();
  //         }
  //         refreshToken();
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // refreshToken Function when token still active
  //   function refreshToken() {
  //     fetch(`${url_API}/backend/api/auth/refresh`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Authorization: `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: JSON.stringify({
  //         refreshToken: localStorage.getItem("token"),
  //       }),
  //     })
  //       .then(async (response) => {
  //         const res = await response.json();
  //         localStorage.setItem("token", res.accessToken);
  //       })
  //       .catch((error) => console.log(error));
  //   }

  // logout
  //   function logout() {
  //     Swal.fire({
  //       title: "Inactive Alert",
  //       text: "You are inactive in 5 minutes, You will be logout in 5 second",
  //       icon: "warning",
  //       timer: 5000,
  //       background: "#fff",
  //       color: "#000",
  //       timerProgressBar: true,
  //       willClose: () => {
  //         clearInterval(timerInterval);
  //       },
  //     }).then((result) => {
  //       localStorage.clear();
  //       sessionStorage.clear();
  //       goto("/");
  //       location.reload();
  //     });
  //   }

  // logout when idle more than 5 minutes
  //   let inactivityTime = function () {
  //     console.log("reset");
  //     isLogin = false;
  //     clearTimeout(time);
  //     time = setTimeout(
  //       () => {
  //         logout();
  //       },
  //       1000 * 60 * 5
  //     );
  //   };

  //   $: if (role && token) setInterval(checkToken, 1000 * 60 * 2.5);
  //   $: if (role && token && isLogin) inactivityTime();
</script>

<svelte:head>
  <link rel="icon" type="image/x-icon" />
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>

<body class="texture">
  <div class="bgbinda">
    <Navbar />

    <slot />

    <Footer />
  </div>
</body>

<style>
</style>
