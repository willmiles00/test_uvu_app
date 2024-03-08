<script lang="ts">
	import {dataStore} from './mongodbData.js'
	import { file } from './modals/messageModal.js'
	// gets the data objects from the database and reassigns them to listData
	export let data: any

    $: if (data) {
        dataStore.set(data?.body?.events);
		if (data?.body?.name === null) {
			file.set({fileName: 'No File'})
		} else {
			file.set(data?.body?.name)
		}
    }

	// $: {
	// 	console.log(data?.body?.name)
	// 	console.log(data?.body?.events)
	// }
	


	// $: console.log(data?.body)

	import Calendar from './calendar/+page.svelte'
	import AddClass from './addClass/+page.svelte'
	import ImportCSV from './importCSV/+page.svelte'
	import ProgressModal from './modals/progressModal.svelte'

	// function handleMessage(event) {
	// 	alert(event.detail.text)
	// }

	let addClassModal = false
	let importCSVModal = false

	function toggleModal() {
		addClassModal = !addClassModal
	}

	function toggleImportModal() {
		importCSVModal = !importCSVModal
	}

	async function test() {
		const response = await fetch ('./grabServer')
        let message = await response.json()
        console.log(message)
	}

</script>

<div class="">
	<ProgressModal on:closeCSV={toggleImportModal}/>
</div>

<div class="bg-gray-100 static">
	{#if addClassModal}
		<div class="z-10 absolute right-4 left-4">
			<AddClass on:closeModal={toggleModal}/>
		</div>
	{/if}

	{#if importCSVModal}
		<div class="z-10 absolute h-screen w-full">
			<ImportCSV on:closeCSVModal={toggleImportModal} />
		</div>
	{/if}

	<div class="">
		<div class="flex justify-center md:justify-between gap-8 bg-primary py-2 px-4">
			<div class="flex gap-8 items-center">
				<img src="uvu_logo.svg" alt="" class="bg-white px-2 rounded-md">
				<h1 class="font-bold text-xl text-white text-center hidden md:block">Academic Scheduling Aid</h1>
			</div>
			
			<!-- <div class="hidden md:block"> -->
				<div class="">
				<div class="flex gap-8">
					<!-- <div class="">
						<button class="fa-solid fa-flask text-white text-2xl pl-2 hover:translate-y-[-4px] transition-all duration-200" on:click={test}></button>
						<p class="text-center text-white">Test</p>
					</div> -->

					<div class="">
						<button class="fa-solid fa-file-import text-white text-2xl pl-2 hover:translate-y-[-4px] transition-all duration-200" on:click={toggleImportModal}></button>
						<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10"> -->
						<p class="text-center text-white">Import</p>
					</div>
		
					<div class="">
						<button class="fa-solid fa-circle-plus text-white text-2xl hover:translate-y-[-4px] hover:shadow-gray-400 transition-all duration-200 pl-1" on:click={toggleModal}></button>
						<!-- <img src="add.svg" alt="Plus button called add" class="w-10 h-10"> -->
						<p class="text-center text-white">Add</p>
					</div>
					
					<div class="">
						<button class="fa-solid fa-print text-white text-2xl pl-1 hover:translate-y-[-4px] hover:shadow-gray-400 transition-all duration-200 pl-1"></button>
						<p class="text-center text-white">Print</p>
					</div>
					
					<div class="">
						<button class="fa-solid fa-file-export text-white text-2xl pl-2 hover:translate-y-[-4px] hover:shadow-gray-400 transition-all duration-200"></button>
						<!-- <img src="export.svg" alt="export icon" class="w-10 h-10"> -->
						<p class="text-center text-white">Export</p>
					</div>
				</div>
			</div>
			
		</div>
		
		<div class="calendar">
			<!-- listData from the database gets passed down as a prop to the scheduler -->
			<Calendar />
		</div>
	</div>
</div>