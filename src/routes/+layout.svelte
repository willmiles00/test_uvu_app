<script lang="ts">
	import '../app.postcss';
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';

initializeStores();
</script>

<header class="flex flex-wrap justify-between items-center w-full h-[60px] border-2">
	<div class="flex flex-wrap">
	<a href="/"><img src="/utah-valley-university-logo.svg" alt="uvu logo" class="h-[20px] mx-3 "></a> <h1 class="text-xl font-bold leading-none">Academic Scheduling App</h1>
</div>
	<nav>
		<ul>
			<li><a href="/">Home</a></li>

		</ul>
	</nav>
</header>
<Modal />
<slot />
