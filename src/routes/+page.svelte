<script lang="ts">
	import {dataStore, yearAndSeason, courses, rooms} from './mongodbData.js'
	import { file } from './modals/messageModal.js'
	// gets the data objects from the database and reassigns them to listData
	export let data: any
	import Calendar from './calendar/+page.svelte'
	import AddClass from './addClass/+page.svelte'
	import ImportCSV from './importCSV/+page.svelte'
	import Edit from './edit/+page.svelte'
	import ProgressModal from './modals/progressModal.svelte'
	import {filteredModal, filteredModalS, closeFilterSelectors} from './modals/messageModal.js'
	import Message from './modals/modal.svelte'
	import DeleteProgressModal from './modals/deleteprogressModal.svelte'
	import html2canvas from 'html2canvas'

	let addClassModal = false
	let importCSVModal = false
	let editClassModal = false

	let filterSelected = ""
	let filterSelectedS = " text-primary"
	let importSelected = ""
	let importSelectedS = "text-primary"
	let addSelected = ""
	let addSelectedS = "text-primary"
	let editSelected = ""
	let editSelectedS = "text-primary"
	let hiddenHeader = ""

	// $: console.log(data?.body?.theYearAndSeason)

    $: if (data) {
        dataStore.set(data?.body?.events);
		if (data?.body?.name === null) {
			file.set({fileName: 'No File'})
		} else {
			file.set(data?.body?.name)
		}
		if (data?.body?.theYearAndSeason === null) {
			yearAndSeason.set({year: 'default', season: 'default'})
		} else {
			yearAndSeason.set(data?.body?.theYearAndSeason)
		}
		courses.set(data?.body?.courses)
		rooms.set(data?.body?.roomsList)
    }

	function toggleModal() {
		addClassModal = !addClassModal
		// checks if add button is selected and highlights the text to secondary color
		if (addClassModal) {
			addSelected = "md:border-b-4 md:border-secondary"
			addSelectedS = "text-secondary md:text-primary"
		} else if (!addClassModal) {
			addSelected = ""
			addSelectedS = "text-primary"
		}
	}

	function toggleImportModal() {
		importCSVModal = !importCSVModal
		// checks if import button is selected and highlights the text to secondary color
		if (importCSVModal) {
			importSelected = "md:border-b-4 md:border-secondary"
			importSelectedS = "text-secondary md:text-primary"
		} else if (!importCSVModal) {
			importSelected = ""
			importSelectedS = "text-primary"
		}
	}

	function toggleEditModal() {
		editClassModal = !editClassModal
		if (editClassModal) {
			editSelected = "md:border-b-4 md:border-secondary"
			editSelectedS = "text-secondary md:text-primary"
		} else if (!editClassModal) {
			editSelected = ""
			editSelectedS = "text-primary"
		}
	}

	async function test() {
		const response = await fetch ('./grabServer')
        let message = await response.json()
        console.log(message)
	}

	function openFilterModal() {
		if (!$filteredModal) {
			filteredModal.set(true)
			filteredModalS.set(true)
			closeFilterSelectors.set(true)
		} else if ($filteredModal) {
			filteredModal.set(false)
			filteredModalS.set(false)
			closeFilterSelectors.set(false)
		}
	}

	function openFilterModalS() {
		if (!$filteredModal) {
			filteredModal.set(true)
			filteredModalS.set(true)
			closeFilterSelectors.set(true)
		} else if ($filteredModal) {
			filteredModal.set(false)
			filteredModalS.set(false)
			closeFilterSelectors.set(false)
		}
	}

	// checks if filter button is selected and highlights the text to secondary color
	$: if ($filteredModal) {
		filterSelected = "md:border-b-4 md:border-secondary"
		filterSelectedS = "text-secondary md:text-primary"
	} else if (!$filteredModal) {
		filterSelected = ""
		filterSelectedS = "text-primary"
	}

	function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function exportScreenshot() {
		hiddenHeader = "hidden"
		await sleep(50)
		initiateScreenshot()
	}
	async function initiateScreenshot() {
		const canvas = await html2canvas(document.body);
		const imgData = canvas.toDataURL("image/jpeg");
		const link = document.createElement('a');
		link.download = 'schedule.jpg';
		link.href = imgData;
		link.click();
		await sleep(50)
		addHeaderBack()
	}
	function addHeaderBack() {
		hiddenHeader = ""
	}
	
	function closeEditModal() {
		editClassModal = false
		editSelected = ""
		editSelectedS = "text-primary"
	}
</script>

<!-- <div class="fixed bottom-0 z-0 h-full w-full flex justify-center items-center">
	<img src="uvu_logo2.png" alt="" class="w-[200px] h-[200px] opacity-5">
</div> -->

<!-- <div class="fixed z-30 w-full h-full flex justify-center items-center"> -->
	<Message />
<!-- </div> -->

<!-- <div class="fixed z-30 w-full h-full flex justify-center items-center"> -->
	<DeleteProgressModal />
<!-- </div> -->


<div class="">
	<ProgressModal on:closeCSV={toggleImportModal}/>
</div>

<div class="bg-gray-50 static text-black ">
	{#if addClassModal}
		<div class="z-20 absolute h-screen w-full">
			<AddClass on:closeModal={toggleModal}/>
		</div>
	{/if}

	{#if importCSVModal}
		<div class="z-20 absolute h-screen w-full">
			<ImportCSV on:closeCSVModal={toggleImportModal} />
		</div>
	{/if}

	{#if editClassModal}
		<div class="z-20 absolute h-screen w-full">
			<Edit on:closeEditModal={closeEditModal}/>
		</div>
	{/if}

	<div class="">
		<div class="relative flex justify-center md:justify-between gap-8 bg-white border-primary border-opacity-40 border-b py-2 px-4 shadow-md no-print {hiddenHeader}">
			<div class="flex gap-8 items-center py-2">
				<img src="uvu_logo.svg" alt="" class="">
				<h1 class="font-bold text-lg lg:text-xl text-primary text-center hidden md:block">Academic Scheduling Aid</h1>
			</div>
			
			<div class="w-full fixed bottom-0 bg-white py-1 z-20 flex border-gray-300 border-b-0 border-l-0 border-r-0 border-t shadow-[50px_50px_50px_35px_rgba(0,0,0,0.3)] md:w-auto md:relative md:bg-transparent md:py-0 md:z-auto md:flex-none md:border-transparent md:shadow-none border-primary border-opacity-40">
				<!-- <div class=""> -->
				<div class="w-full flex justify-around md:gap-8">
					<!-- <div class="">
						<button class="fa-solid fa-flask text-white text-2xl pl-2 hover:translate-y-[-4px] transition-all duration-200" on:click={test}></button>
						<p class="text-center text-white">Test</p>
					</div> -->

					<div class="hidden md:block {filterSelected} p-1 no-print">
						<button class="{filterSelectedS} hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={openFilterModal}>
							<i class="fa-solid fa-file-import text-xl block pr-2"></i>
							Filter
						</button>
						<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10"> -->
					</div>

					<div class="md:hidden {filterSelected} p-1 no-print">
						<button class="{filterSelectedS} hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={openFilterModalS}>
							<i class="fa-solid fa-file-import text-xl block"></i>
							Filter
						</button>
						<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10"> -->
					</div>

					<div class="{importSelected}  p-1">
						<button class="{importSelectedS} hover:opacity-80 font-bold transition-all duration-200 hover:text-primary " on:click={toggleImportModal}>
							<i class="fa-solid fa-file-import text-xl block"></i>
							Import
						</button>
						<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10"> -->
					</div>
		
					<div class="{addSelected}  p-1">
						<button class="{addSelectedS}  hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={toggleModal}>
							<i class="fa-solid fa-circle-plus text-xl block "></i>
							Add
						</button>
						<!-- <img src="add.svg" alt="Plus button called add" class="w-10 h-10"> -->
					</div>

					<div class="{editSelected}  p-1">
						<button class="{editSelectedS}  hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={toggleEditModal}>
							<i class="fa-solid fa-pen-to-square text-xl block "></i>
							Edit
						</button>
					</div>
					
					<div class=" p-1">
						<button class="text-primary hover:opacity-80 font-bold transition-all duration-200 hover:text-primary" on:click={() => window.print()}>
							<i class="fa-solid fa-print text-xl block"></i>
							Print
						</button>
					</div>
					
					<div class=" p-1">
						<button on:click={exportScreenshot} class="text-primary hover:opacity-80 font-bold transition-all duration-200 hover:text-primary">
							<i class="fa-solid fa-file-export text-xl block"></i>
							Export
						</button>
						<!-- <img src="export.svg" alt="export icon" class="w-10 h-10"> -->
					</div>
				</div>
			</div>
			
		</div>
		
		<!-- <div class="border-2 border-primary m-4 rounded-lg"> -->
		<div class="">
			<!-- listData from the database gets passed down as a prop to the scheduler -->
			<Calendar />
		</div>
	</div>
</div>

<style>
	@media print {
		.no-print {
			display: none;
		}
	}
</style>