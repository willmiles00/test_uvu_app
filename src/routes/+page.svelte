<script lang="ts" >


	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { events } from '$lib/stores/events';
	import { filteredevents, selectedInstructors, selectedRooms, selectedCourses } from '$lib/stores/filteredevents';
	import { eventstobedeleted } from '$lib/stores/eventstobedeleted';
	import { parseCSVFile } from '$lib/functions/parseCSVUtil.ts';
	import { exportPageToPDF } from '$lib/functions/ExportToPDF.ts';
	import AddCustomSchedule from '$lib/components/modals/AddEvent.svelte';
	import UploadModal from '$lib/components/modals/UploadModal.svelte';
	import AddTimeblock from '$lib/components/modals/AddTimeblock.svelte';
	import EditSchedule from '$lib/components/modals/EditSchedule.svelte';
	import { afterUpdate, onMount } from 'svelte';

	let showProfessors = false;
	let showRooms = false;
	let showCourses = false;

	function toggleFilter(filterName: string) {
  // Check if the clicked filter is already open
  const isAlreadyOpen = 
    (filterName === 'professors' && showProfessors) ||
    (filterName === 'rooms' && showRooms) ||
    (filterName === 'courses' && showCourses);
  
  // Close all filters first
  showProfessors = false;
  showRooms = false;
  showCourses = false;
  
  // If the filter wasn't already open, then open it
  if (!isAlreadyOpen) {
    if (filterName === 'professors') {
      showProfessors = true;
    } else if (filterName === 'rooms') {
      showRooms = true;
    } else if (filterName === 'courses') {
      showCourses = true;
    }
  }
  // If it was already open, it will remain closed because we set all to false above
}


	// initial variables
	export const courses: any = [];
	let uploadedCourses: any[] = [];

	async function handleExport() {
    await exportPageToPDF();
  }





	// modal setters
	let isUploadModalActive = false;
	let isEditModalActive = false;
	let isAddCustomModalActive = false;
	let isAddTimeblockModalActive = false;

	function handleEditModal() {
		isEditModalActive = !isEditModalActive;
	}
	function handleUploadModal() {
		isUploadModalActive = !isUploadModalActive;
	}
	function handleUploadCustomSuhedules() {
    isUploadModalActive = !isUploadModalActive;
  }
	function handleCustomModal() {
		isAddCustomModalActive = !isAddCustomModalActive;
	}
	function handleAddTimeblock() {
		isAddTimeblockModalActive = !isAddTimeblockModalActive;
	}


	// Handle CSV file upload, see parseCSVUtil.ts for more details
	async function handleCSVUpload(event: CustomEvent) {
  const { file } = event.detail;
  if (file) {
    // Update the fileName variable with the name of the uploaded file
    fileName = file.name;
    
    const processedCourses = await parseCSVFile(file);
    
    // Update the uploadedCourses with the processed data
    uploadedCourses = processedCourses;
    
    // Update the global store with the new courses
    events.update((value: any) => {
      return [...value, ...processedCourses];
    });	

    // Close modal
    handleUploadModal();

	// Update Calendar Events Style to override
  }
}
  
  // Keep track of the currently selected file name for display in the sidebar
  let fileName = 'No File Selected';

function addToFiltersStore(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const filterType = checkbox.getAttribute('data-filter-type');
  const value = checkbox.value;
  
  // Update the appropriate filter store
  if (filterType === 'instructor') {
    if (checkbox.checked) {
      $selectedInstructors = [...$selectedInstructors, value];
    } else {
      $selectedInstructors = $selectedInstructors.filter(instructor => instructor !== value);
    }
  } else if (filterType === 'room') {
    if (checkbox.checked) {
      $selectedRooms = [...$selectedRooms, value];
    } else {
      $selectedRooms = $selectedRooms.filter(room => room !== value);
    }
  } else if (filterType === 'course') {
    if (checkbox.checked) {
      $selectedCourses = [...$selectedCourses, value];
    } else {
      $selectedCourses = $selectedCourses.filter(course => course !== value);
    }
  }
}
// Function to select all filter checkboxes when file is uploaded
// function selectAllFilters(){
//   // Select all checkboxes
//   const checkboxes = document.querySelectorAll('.filterCheckbox') as NodeListOf<HTMLInputElement>;
//   checkboxes.forEach((checkbox: HTMLInputElement) => {
// 	checkbox.checked = true; 
//   });
  
//   // Update the filter stores with all values
//   $selectedInstructors = [...new Set($events.map(course => course.extendedProps.Instructor))];
//   $selectedRooms = [...new Set($events.map(course => course.extendedProps.buildingAndRoom))];
//   $selectedCourses = [...new Set($events.map(course => course.extendedProps.Course))];
// }


function clearFilters() {
  $selectedInstructors = [];
  $selectedRooms = [];
  $selectedCourses = [];
  
 // Reset all checkboxes
 const checkboxes = document.querySelectorAll('.filterCheckbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false; 
    });
    
    // Clear events to be deleted (if needed)
    eventstobedeleted.set($filteredevents);
  }
  
  // New function to handle edit saved event
  function handleEditSaved() {
    clearFilters();
  }

  function handleEditEvent(event) {
  // Set the event to be edited
  const eventToEdit = event.detail.event;
  
  // Open the edit modal
  isEditModalActive = true;
  


}

let userScheduleTitle = '';
 

</script>

<main class="h-full w-full">
	<!-- main functionality buttons -->
	
	<div class="w-full flex justify-between bg-gray-100 h-[44px]">
		<div class="flex flex-wrap flex-col mx-3 items-center justify-center" >
			<p id="titleHeader" class="uppercase text-[18px] font-rajdhani font-semibold text-uvu-green">Title:</p>
			<input
				class="input !bg-white placeholder-[#757677] !rounded-[3px] mx-2"
				type="text"
				name=""
				bind:value={userScheduleTitle}
				placeholder="Default Schedule Title"
			/>
		</div>

		<div id="scheduleTitle" class="hidden">
			<p>{userScheduleTitle}</p>
		</div>

		<div class="h-full flex items-center mr-[12px]">
		<button on:click={handleAddTimeblock} id="addTimeblock" class="bg-[#DDDDDD] text-uvu-green uppercase h-[28px] w-[158px] font-rajdhani text-[14px] font-semibold rounded-[25px]"><i class="fa-solid fa-circle-plus pr-1" style="color: #275D38;"></i> Add Timeblock</button>
	</div>
	</div>


	<body class="flex flex-wrap w-full h-full flex-row">
		<!-- sidebar -->
		<div id="sidebar" class="w-auto h-auto border max-w-[303px]">

			<!-- import sidebar -->
			<div id="import" class="border m-4 p-2 w-[269px] rounded-[2px]">
				<div class="flex flex-wrap  items-center">
					<span class="bg-[#E8E8E8] rounded-full w-[28px] h-[28px] flex items-center justify-center mr-2">
					<i class="fa-solid fa-file-lines" style="color: #578164;"></i>
				</span>
				<div class="flex flex-wrap flex-col">
				<p class=" text-uvu-green text-[12px] font-rajdhani font-semibold max-h-fit">Current file:</p>
				<p class="font-lato text-[12px] max-h-fit mt-[-10px]">{fileName}</p>
				</div>
				</div>
				<button
					type="button"
					class="btn bg-uvu-green uppercase rounded-2xl text-sm font-rajdhani w-[253px] h-[28px] text-white font-semibold"
					on:click={handleUploadModal}>Import .CSV File</button
				>
			</div>

			<!-- filter sidebar -->
			<div id="filterSection" class="flex flex-wrap flex-col m-4 mt-[52px] mb-[52px]">
				<p class="uppercase font-primary-bold text-[18px] mb-2">Select schedule</p>
				<button on:click={clearFilters} class="uppercase underline text-[14px] text-[#A7A8AA] text-left">
				  <i class="fa-solid fa-rotate-right pr-2"></i>clear filters
				</button>
				
				<!-- Professors Filter -->
				<div class="filter-container mt-[16px]">
				  <p class="filter-header text-uvu-green font-rajdhani font-semibold cursor-pointer text-[18px] uppercase border-2 border-solid {showProfessors ? 'border-[#275D38]' : 'border-[#DCDCDD]'} w-[269px] h-[39px] rounded-[8px] flex items-center pl-[12px] justify-between" on:click={() => toggleFilter('professors')}>
					Professors 
					{#if showProfessors}<i class="fa-solid fa-chevron-up mr-[12px]"></i>
					{:else}<i class="fa-solid fa-chevron-down mr-[12px]"></i>
					{/if}
				  </p>
				  {#if showProfessors}
				  <div class="filter-content border-2 border-solid border-[#275D38] rounded-[8px] max-h-[200px] overflow-y-auto mt-2">
					{#each [...new Set($events.map(course => course.extendedProps.Instructor))] as instructor}
					  <label class="filter-item">
						<div class="w-full flex justify-between px-2 py-1 hover:bg-gray-100">
						  <span class="text-sm truncate max-w-[200px] {$selectedInstructors.includes(instructor) ? 'text-black font-medium' : 'text-[#757677]'}">
							{instructor}
						  </span>
						  <input
							type="checkbox"
							class="filterCheckbox"
							value={instructor}
							data-filter-type="instructor"
							checked={$selectedInstructors.includes(instructor)}
							on:change={addToFiltersStore}
						  />
						</div>
					  </label>
					{/each}
				  </div>
				  {/if}
				</div>
				
				<!-- Rooms Filter -->
				<div class="filter-container mt-[16px]">
				  <p class="filter-header text-uvu-green font-rajdhani font-semibold cursor-pointer text-[18px] uppercase border-2 border-solid {showRooms ? 'border-[#275D38]' : 'border-[#DCDCDD]'} w-[269px] h-[39px] rounded-[8px] flex items-center pl-[12px] justify-between" on:click={() => toggleFilter('rooms')}>
					Rooms {#if showRooms}<i class="fa-solid fa-chevron-up mr-[12px]"></i>{:else}<i class="fa-solid fa-chevron-down mr-[12px]"></i>{/if}
				  </p>
				  {#if showRooms}
				  <div class="filter-content border-2 border-solid border-[#275D38] rounded-[8px] max-h-[200px] overflow-y-auto mt-2">
					{#each [...new Set($events.map(course => course.extendedProps.buildingAndRoom))] as buildingAndRoom}
					  <label class="filter-item">
						<div class="w-full flex justify-between px-2 py-1 hover:bg-gray-100">
						  <span class="text-sm truncate max-w-[200px] {$selectedRooms.includes(buildingAndRoom) ? 'text-black font-medium' : 'text-[#757677]'}">
							{buildingAndRoom}
						  </span>
						  <input
							type="checkbox"
							class="filterCheckbox"
							value={buildingAndRoom}
							data-filter-type="room"
							checked={$selectedRooms.includes(buildingAndRoom)}
							on:change={addToFiltersStore}
						  />
						</div>
					  </label>
					{/each}
				  </div>
				  {/if}
				</div>
				
				<!-- Courses Filter -->
				<div class="filter-container mt-[16px]">
				  <p class="filter-header text-uvu-green font-rajdhani font-semibold cursor-pointer text-[18px] uppercase border-2 border-solid {showCourses ? 'border-[#275D38]' : 'border-[#DCDCDD]'} w-[269px] h-[39px] rounded-[8px] flex items-center pl-[12px] justify-between" on:click={() => toggleFilter('courses')}>
					Courses {#if showCourses}<i class="fa-solid fa-chevron-up mr-[12px]"></i>{:else}<i class="fa-solid fa-chevron-down mr-[12px]"></i>{/if}
				  </p>
				  {#if showCourses}
				  <div class="filter-content border-2 border-solid border-[#275D38] rounded-[8px] max-h-[200px] overflow-y-auto mt-2">
					{#each [...new Set($events.map(course => course.extendedProps.Course))] as courseName}
					  <label class="filter-item">
						<div class="w-full flex justify-between px-2 py-1 hover:bg-gray-100">
						  <span class="text-sm truncate max-w-[200px] {$selectedCourses.includes(courseName) ? 'text-black font-medium' : 'text-[#757677]'}">
							{courseName}
						  </span>
						  <input
							type="checkbox"
							class="filterCheckbox"
							value={courseName}
							data-filter-type="course"
							checked={$selectedCourses.includes(courseName)}
							on:change={addToFiltersStore}
						  />
						</div>
					  </label>
					{/each}
				  </div>
				  {/if}
				</div>
			  </div>


	

			<!-- add and edit schedules sidebar -->
			<div class="flex flex-wrap flex-col justify-center items-center">
				<button
				type="button"
				class="addAndEditBtn"
				on:click={handleEditModal}>
				<i class="fa-solid fa-pen-to-square pr-2" style="color: white;"></i>
				Edit Schedules
				</button
			>
				<button
					type="button"
					class="addAndEditBtn"
					on:click={handleCustomModal}>
					<i class="fa-solid fa-circle-plus pr-2" style="color: white;"></i>
					Add Custom Schedules</button
				>
			
			</div>
		</div>
		<!-- end sidebar -->
		<!-- calendar view -->

		<div class="grow">

			<CalendarView on:edit={handleEditEvent} />
		</div>
	</body>

	<!-- modals -->
	

	<!-- upload modal -->
	<UploadModal 
    isOpen={isUploadModalActive}
    on:close={handleUploadModal}
    on:submit={handleCSVUpload}
  />

<!-- Add Custom Schedule -->
<!-- Modal (Opens on Click) -->
{#if isEditModalActive}
  <EditSchedule 
    isOpen={isEditModalActive} 
    onClose={handleEditModal}
    on:editSaved={handleEditSaved}
  />
{/if}

{#if isAddCustomModalActive}
		<AddCustomSchedule 
			isOpen={isAddCustomModalActive} 
			onClose={handleCustomModal} 
		/>
	{/if}

	{#if isAddTimeblockModalActive}
		<AddTimeblock 
			isOpen={isAddTimeblockModalActive} 
			onClose={handleAddTimeblock} 
		/>
	{/if}

	
</main>




<style lang="postcss">
	/* .custom-scrollbar {
	  scrollbar-color: red orange !important;
	  scrollbar-width: thick !important;
	} */

	/* .confirm-schedule {
		position: absolute !important;
		top: 623px !important;
		left: 34% !important;
		background-color: #00834d !important;
		font-weight: bold !important;
		text-transform: uppercase !important;
		color: white !important;
		z-index: 1000 !important;
	} */

	/* input[type='file'] {
		display: none;
	} */

	/* .editable-input {
		@apply input border-none shadow-inner p-2 !border-black rounded-lg !bg-yellow-100;
	} */

	/* .upload-modal {
		overflow: scroll !important;
		overflow-y: scroll;
	} */

	/* .ec-day {
		min-width: fit-content !important;
		min-height: fit-content !important;
	} */

	.ec-event{
		left: not-allowed !important;
	}

	.filter-group {
		max-height: 200px;
		overflow-y: auto;
		padding-right: 8px;
	}

	.filter-group::-webkit-scrollbar {
		width: 6px;
	}

	.filter-group::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	.filter-group::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 3px;
	}

	.filter-group::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	.filterCheckbox {
		accent-color: #275D38;
	}

	.addAndEditBtn{
		background-color: #275D38;
		color: white;
		font-weight: 600;
		text-transform: uppercase;
		border: none;
		border-radius: 25px;
		padding: 8px 2px;
		margin: 5px 0;
		font-family: rajdhani;
		font-size: 14px;
		min-width: 269px;
		max-width: 269px;
		height: 28px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.font-rajdhani {
		font-family: rajdhani;
	}

	.font-lato {
		font-family: lato;
	}

	.filter-container {
    display: flex;
    flex-direction: column;
    width: 269px;
  }

  .filter-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
  }

  .filter-content {
    padding: 0;
    scrollbar-width: thin;
  }

  .filter-content::-webkit-scrollbar {
    width: 6px;
  }

  .filter-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .filter-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .filter-content::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .filter-item {
    display: block;
    border-bottom: 1px solid #f0f0f0;
    color: #757677;
    font-family: lato;
    font-size: 16px;
  }

  .filter-item:last-child {
    border-bottom: none;
  }

  .filterCheckbox {
    accent-color: #275D38;
  }

  .filter-item {
    display: block;
    border-bottom: 1px solid #f0f0f0;
    font-family: lato;
    font-size: 16px;
  }

  .filter-item:last-child {
    border-bottom: none;
  }

</style>
