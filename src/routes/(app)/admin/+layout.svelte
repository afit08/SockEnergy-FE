<script>
	import HeaderAdmin from '$components/HeaderAdmin.svelte';
	import SidebarAdmin from '$components/SidebarAdmin.svelte';
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" />
	<link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
</svelte:head>

<body>
	<SidebarAdmin />

	<slot />
</body>

<style>
	/* .col-md-3 {
		flex: 0 0 auto;
		width: 21%;
	} */
</style>
