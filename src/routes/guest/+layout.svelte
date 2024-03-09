<script>
	import Navbar from '$components//Navbar.svelte';
	import Footer from '$components//Footer.svelte';
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" />
	<link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
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
