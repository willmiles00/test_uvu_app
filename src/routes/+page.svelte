<script lang="ts">
	import {dataStore, yearAndSeason, courses, rooms} from './mongodbData.js'
	import { file } from './modals/messageModal.js'
	// gets the data objects from the database and reassigns them to listData
	export let data: any
	import Calendar from '$lib/components/Calendar.svelte'
	import AddClass from './addClass/+page.svelte'
	import ImportCSV from './importCSV/+page.svelte'
	import Edit from './edit/+page.svelte'
	import ProgressModal from './modals/progressModal.svelte'


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
</script>
<Calendar />

<div class="">
	<ProgressModal />
</div>

<div class="bg-gray-50 static text-black ">
	{#if addClassModal}
		<div class="z-20 absolute h-screen w-full">
			<AddClass />
		</div>
	{/if}

	{#if importCSVModal}
		<div class="z-20 absolute h-screen w-full">
			<ImportCSV  />
		</div>
	{/if}

	{#if editClassModal}
		<div class="z-20 absolute h-screen w-full">
			<Edit />
		</div>
	{/if}

	<!-- Logo and Header -->
	<div class="bg-white">
		<div class="flex items-center justify-between gap-4 bg-white p-4 no-print {hiddenHeader}">
			<div class="flex gap-8 items-center ">
				<img src="uvu_logo2.png" alt="" class="">
				<h1 class="text-lg lg:text-xl text-primary text-center hidden md:block font-raj transition-all duration-300">Academic Scheduling Aid</h1>
			</div>
			
			<div class="">
				<div class="flex justify-end gap-4 items-center">

					<!-- print button -->
					<div class="">
						<button  class="px-6 py-1 rounded-full shadow-sm"  >
							<div class="{hoverPrint ? "text-white" : "text-primary"} flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300" >
								<i class="fa-solid fa-print py-0.5 md:pr-2 md:py-0"></i>
								<p class="hidden md:block">Print Schedule</p>
							</div>
						</button>
					</div>
					
					<!-- export button -->
					<div class="">
						<button>
							<div class="{hoverExport ? "text-white" : "text-primary"} flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300">
								<i class="fa-solid fa-file-export text-md py-0.5 md:pr-2 md:py-0"></i>
								<p class="hidden md:block">Export Schedule</p>
							</div>
						</button>
					</div>
					<!-- end export button -->

				</div>
			</div>
			
		</div>

		<div class="py-2 w-full border-t border-b bg-gray-100 flex gap-4 justify-end pr-4 no-print shadow-sm {hiddenHeader}"> <!-- start -->

			<!-- filter button  -->
			<div class="">
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full transition-all duration-300 shadow-sm" >
					<div class="text-white flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300" >
						<i class="fa-solid fa-filter py-0.5 md:pr-2 md:py-0"></i>
						<p class="hidden md:block">Filter</p>
					</div>
				</button>
				<div class="flex justify-center {filterSelected} transition-all duration-300 translate-y-[6px]">
					<div class="basis-6/12  bg-primary h-[2px] rounded-full"></div>
				</div>
			</div>
				<!-- end filter button -->

			<!-- Import CSV button -->
			<div class="">
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full shadow-sm transition-all duration-300">
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
			<!-- end Import CSV button -->

			<!-- add button  -->
			<div>
				<button class="px-6 py-1 bg-primary hover:bg-primaryDark rounded-full shadow-sm transition-all duration-300">
					<div class="text-white flex items-center font-medium font-raj uppercase text-md md:text-sm transition-all duration-300">
						<i class="fa-solid fa-circle-plus py-0.5 md:pr-2 md:py-0"></i>
						<p class="hidden md:block">Add Schedules</p>
					</div>
				</button>
				<div class="flex justify-center {addSelected} transition-all duration-300  translate-y-[6px]">
					<div class="basis-6/12  bg-primary h-[2px] rounded-full"></div>
				</div>
			</div>
			<!-- end add button -->

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

		</div>
		<!-- end edit button -->
		

		<!-- Calendar section -->
		<div class="">
			<!-- listData from the database gets passed down as a prop to the scheduler -->
			<Calendar />
		</div>
	</div>
</div>

