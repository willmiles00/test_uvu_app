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

<div class="bg-gray-100 static text-black ">
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
		<div class="relative flex justify-center md:justify-between gap-8 bg-white border-gray-300 border-b border-l-0 border-r-0 border-t-0 py-2 px-4 shadow-md">
			<div class="flex gap-8 items-center">
				<img src="uvu_logo.svg" alt="" class="">
				<h1 class="font-bold text-xl text-primary text-center hidden md:block">Academic Scheduling Aid</h1>
			</div>
			
			<div class="w-full fixed bottom-0 bg-white py-1 z-10 flex border-gray-300 border-b-0 border-l-0 border-r-0 border-t shadow-[50px_50px_50px_35px_rgba(0,0,0,0.3)] md:w-auto md:relative md:bg-transparent md:py-0 md:z-auto md:flex-none md:border-transparent md:shadow-none">
				<!-- <div class=""> -->
				<div class="w-full flex justify-around md:gap-8">
					<!-- <div class="">
						<button class="fa-solid fa-flask text-white text-2xl pl-2 hover:translate-y-[-4px] transition-all duration-200" on:click={test}></button>
						<p class="text-center text-white">Test</p>
					</div> -->

					<div class="">
						<button class="text-primary hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={toggleImportModal}>
							<i class="fa-solid fa-file-import text-xl md:text-2xl block"></i>
							Import
						</button>
						<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10"> -->
					</div>
		
					<div class="">
						<button class="text-primary  hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={toggleModal}>
							<i class="fa-solid fa-circle-plus text-xl block md:text-2xl "></i>
							Add
						</button>
						<!-- <img src="add.svg" alt="Plus button called add" class="w-10 h-10"> -->
					</div>
					
					<div class="">
						<button class="text-primary hover:opacity-80 font-bold transition-all duration-200 hover:text-primary">
							<i class="fa-solid fa-print text-xl block md:text-2xl "></i>
							Print
						</button>
					</div>
					
					<div class="">
						<button class="text-primary hover:opacity-80 font-bold transition-all duration-200 hover:text-primary">
							<i class="fa-solid fa-file-export text-xl block md:text-2xl "></i>
							Export
						</button>
						<!-- <img src="export.svg" alt="export icon" class="w-10 h-10"> -->
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