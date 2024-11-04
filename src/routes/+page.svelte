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
	import {filteredModal, filteredModalS, closeFilterSelectors, filteredModalPrint} from './modals/messageModal.js'
	import Message from './modals/modal.svelte'
	import DeleteProgressModal from './modals/deleteprogressModal.svelte'
	import html2canvas from 'html2canvas'

	console.log('this will only show on the main site')

	let addClassModal = false
	let importCSVModal = false
	let editClassModal = false

	let filterSelected = "w-0"
	// let filterSelected = "w-0"
	let importSelected = "w-0"
	// let importSelectedS = "text-white"
	let addSelected = "w-0"
	// let addSelectedS = "text-white"
	let editSelected = "w-0"
	// let editSelectedS = "text-white"
	let hiddenHeader = ""
	let hoverPrint = false
	let hoverExport = false

	// $: console.log(data?.body?.theYearAndSeason)

	// if there is any changes to the data in our database it will update the file, yearAndSeason, courses, and rooms stores
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

	// This opens and closes the "add schedules" modal
	function toggleModal() {
		addClassModal = !addClassModal
		// checks if add button is selected and highlights the text to secondary color
		if (addClassModal) {
			addSelected = "w-full"
			filteredModal.set(false)
			filteredModalS.set(false)
			closeFilterSelectors.set(false)
			filterSelected = "w-0"
			// addSelectedS = "text-secondary md:text-primary"
		} else if (!addClassModal) {
			addSelected = "w-0"
			// addSelectedS = "text-primary"
		}
	}

	// This opens and closes the "import csv" modal
	function toggleImportModal() {
		importCSVModal = !importCSVModal
		// checks if import button is selected and highlights the text to secondary color
		if (importCSVModal) {
			importSelected = "w-full"
			filteredModal.set(false)
			filteredModalS.set(false)
			closeFilterSelectors.set(false)
			filterSelected = "w-0"
			// importSelectedS = "text-secondary md:text-primary"
		} else if (!importCSVModal) {
			importSelected = "w-0"
			// importSelectedS = "text-primary"
		}
	}

	// This opens and closes the "edit schedules" modal
	function toggleEditModal() {
		editClassModal = !editClassModal
		if (editClassModal) {
			editSelected = "w-full"
			filteredModal.set(false)
			filteredModalS.set(false)
			closeFilterSelectors.set(false)
			filterSelected = "w-0"
			// editSelectedS = "text-secondary md:text-primary"
		} else if (!editClassModal) {
			editSelected = "w-0"
			// editSelectedS = "text-primary"
		}
	}

	// This opens and closes the "filter" modal
	function openFilterModal() {
		if (!$filteredModal) {
			filteredModal.set(true)
			filteredModalS.set(true)
			closeFilterSelectors.set(true)
			filterSelected = "w-full"
		} else if ($filteredModal) {
			filteredModal.set(false)
			filteredModalS.set(false)
			closeFilterSelectors.set(false)
			filterSelected = "w-0"
		}
	}

	// if the filterModal store is true it will slide open the filter modal
	$: if ($filteredModal) {
		filterSelected = "w-full"
	} else if (!$filteredModal) {
		filterSelected = "w-0"
	}

	// checks if the filter button is selected on mobile so it will open the modal on large as well and vice versa
	// function openFilterModalS() {
	// 	if (!$filteredModal) {
	// 		filteredModal.set(true)
	// 		filteredModalS.set(true)
	// 		closeFilterSelectors.set(true)
	// 	} else if ($filteredModal) {
	// 		filteredModal.set(false)
	// 		filteredModalS.set(false)
	// 		closeFilterSelectors.set(false)
	// 	}
	// }



	// sleep, exportScreenshot, initiateScreenshot, and addHeaderBack are used to take a screenshot of the schedule and download it as a jpg
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
	
	// This also closes the edit modal
	function closeEditModal() {
		editClassModal = false
		editSelected = "w-0"
		// editSelectedS = "text-primary"
	}

	// allows you to print the schedule and hides the filter modal
	async function printScreen() {
		// hides the filter modal
		filteredModalPrint.set(true)
		await sleep(50)
		// we then open the print dialog
		window.print()

		// then after a few seconds we put the modal back
		await sleep(50)
		putModalBack()
	}

	function putModalBack() {
		filteredModalPrint.set(false)
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

	<div class="bg-white">
		<div class="flex items-center justify-between gap-4 bg-white p-4 no-print {hiddenHeader}">
			<div class="flex gap-8 items-center ">
				<img src="uvu_logo2.png" alt="" class="">
				<h1 class="text-lg lg:text-xl text-primary text-center hidden md:block font-raj transition-all duration-300">Academic Scheduling Aid</h1>
			</div>
			
			<div class="">
				<!-- <div class=""> -->
				<div class="flex justify-end gap-4 items-center">
					<!-- <div class="">
						<button class="fa-solid fa-flask text-white text-2xl pl-2 hover:translate-y-[-4px] transition-all duration-200" on:click={test}></button>
						<p class="text-center text-white">Test</p>
					</div> -->
					
					<!-- print button -->
					<div class="">
						<button on:mouseover={() => hoverPrint = true} on:mouseleave={() => hoverPrint = false} class="px-6 py-1 rounded-full {hoverPrint ? "bg-primary" : "bg-third"} shadow-sm" 
							on:click={printScreen} >
							<div class="{hoverPrint ? "text-white" : "text-primary"} flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300" >
								<i class="fa-solid fa-print py-0.5 md:pr-2 md:py-0"></i>
								<p class="hidden md:block">Print Schedule</p>
							</div>
						</button>
					</div>
					
					<!-- export button -->
					<div class="">
						<button on:mouseover={() => hoverExport = true} on:mouseleave={() => hoverExport = false} class="px-6 py-1 {hoverExport ? "bg-primary" : "bg-third"} rounded-full shadow-sm" on:click={exportScreenshot}>
							<div class="{hoverExport ? "text-white" : "text-primary"} flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300">
								<i class="fa-solid fa-file-export text-md py-0.5 md:pr-2 md:py-0"></i>
								<p class="hidden md:block">Export Schedule</p>
							</div>
						</button>
						<!-- <img src="export.svg" alt="export icon" class="w-10 h-10"> -->
					</div>
				</div>
			</div>
			
		</div>

		<div class="py-2 w-full border-t border-b bg-gray-100 flex gap-4 justify-end pr-4 no-print shadow-sm {hiddenHeader}"> <!-- start -->

			<!-- filter button  -->
			<div class="">
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full transition-all duration-300 shadow-sm" on:click={openFilterModal}>
					<div class="text-white flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300" >
						<i class="fa-solid fa-filter py-0.5 md:pr-2 md:py-0"></i>
						<p class="hidden md:block">Filter</p>
					</div>
				</button>

				<div class="flex justify-center {filterSelected} transition-all duration-300 translate-y-[6px]">
					<div class="basis-6/12  bg-primary h-[2px] rounded-full"></div>
				</div>
				
				<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10">  -->
			</div>

			<!-- Import CSV button -->
			<div class="">
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full shadow-sm transition-all duration-300" on:click={toggleImportModal}>
					<div class="text-white flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300">
						<i class="fa-solid fa-file-import py-0.5 md:pr-2 md:py-0"></i>
						<p class="hidden md:block">Import CSV</p>
					</div>
				</button>
				
				<div class="flex justify-center {importSelected} transition-all duration-300 translate-y-[6px]">
					<div class="basis-6/12  bg-primary h-[2px] rounded-full"></div>
				</div>
				<!-- <img src="upload.svg" alt="upload icon" class="w-10 h-10"> --> 
			</div>

			<!-- add button  -->
			<div>
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full shadow-sm transition-all duration-300" on:click={toggleModal}>
					<div class="text-white flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300">
						<i class="fa-solid fa-circle-plus py-0.5 md:pr-2 md:py-0"></i>
						<p class="hidden md:block">Add Schedules</p>
					</div>
				</button>
				<div class="flex justify-center {addSelected} transition-all duration-300  translate-y-[6px]">
					<div class="basis-6/12  bg-primary h-[2px] rounded-full"></div>
				</div>
				<!-- <img src="add.svg" alt="Plus button called add" class="w-10 h-10">  -->
			</div>

			<!-- edit button  -->
			<div class="">
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full shadow-sm transition-all duration-300" on:click={toggleEditModal}>
					<div class="text-white flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300">
						<i class="fa-solid fa-pen-to-square py-0.5 md:pr-2 md:py-0"></i>
						<p class="hidden md:block">Edit Schedules</p>
					</div>
				</button>
				<div class="flex justify-center {editSelected} transition-all duration-300 translate-y-[6px]">
					<div class="basis-6/12  bg-primary h-[2px] rounded-full"></div>
				</div>
				
			</div>

		</div><!-- end -->
		

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