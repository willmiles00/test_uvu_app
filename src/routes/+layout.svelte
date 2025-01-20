<script lang="ts">
	import '../app.postcss';
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';

initializeStores();
</script>

<header class="flex flex-wrap justify-between items-center w-full h-[44px] border-b-2 text-uvu-green">
	<div class="flex flex-wrap">
	<a href="/"><img src="/utah-valley-university-logo.svg" alt="uvu logo" class="h-[20px] mx-3 "></a> <h1 class="text-xl font-bold leading-none">Academic Scheduling App</h1>
</div>
<div class="mx-3">
	<button class="bg-uvu-green text-white px-3 py-1 rounded-lg font-bold">Export</button>
	<button class="bg-uvu-green text-white px-3 py-1 rounded-lg font-bold">Print</button>
</div>
</header>
<Modal />
<slot />
