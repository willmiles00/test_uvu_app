<script lang="ts">

	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { events } from '$lib/stores/events';
	import { parseCSVFile } from '$lib/functions/parseCSVUtil.ts';
	import AddCustomSchedule from '$lib/components/modals/AddEvent.svelte';
	import UploadModal from '$lib/components/modals/UploadModal.svelte';
	import { afterUpdate, onMount } from 'svelte';

	// initial variables
	export const courses: any = [];
	let uploadedCourses: any[] = [];



	// modal setters
	let isUploadModalActive = false;
	let isEditModalActive = false;
	let isAddCustomModalActive = false;

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


	// Handle CSV file upload, see parseCSVUtil.ts for more details
	async function handleCSVUpload(event: CustomEvent) {
    const { file } = event.detail;
    if (file) {
      const processedCourses = await parseCSVFile(file);
      
      // Update the uploadedCourses with the processed data
      uploadedCourses = processedCourses;
      
      // Update the global store with the new courses
      events.update((value: any) => {
        return [...value, ...processedCourses];
      });
      
      // Close modal
      handleUploadModal();
    }
  }
  
  // Keep track of the currently selected file name for display in the sidebar
  let fileName = 'No File Selected';




 

</script>

<main class="h-full w-full">
	<!-- main functionality buttons -->
	
	<div class="w-full flex justify-between bg-gray-100 h-[44px]">
		<div class="flex flex-wrap flex-col mx-3 items-center justify-center">
			<p class="uppercase text-[18px] font-rajdhani font-semibold text-uvu-green">Title:</p>
			<input
				class="input !bg-white placeholder-[#757677] !rounded-[3px] mx-2"
				type="text"
				name=""
				id=""
				placeholder="Default Schedule Title"
			/>
		</div>

		<div class="h-full flex items-center mr-[12px]">
		<button class="bg-[#DDDDDD] text-uvu-green uppercase h-[28px] w-[158px] font-rajdhani text-[14px] font-semibold rounded-[25px]"><i class="fa-solid fa-circle-plus pr-1" style="color: #275D38;"></i> Add Timeblock</button>
	</div>
	</div>


	<body class="flex flex-wrap w-full h-full flex-row">
		<!-- sidebar -->
		<div id="sidebar" class="w-auto h-auto border ">

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
				<button class="uppercase underline text-[14px] text-[#A7A8AA] text-left">
					<i class="fa-solid fa-rotate-right pr-2"></i>reset filters
				</button>
				<select class="filterSelect" name="" id="">Professors <option value="">Professors</option></select>
				<select class="filterSelect" name="" id="">Rooms <option value="">Rooms</option></select>
				<select class="filterSelect" name="" id="">Courses <option value="">Courses</option></select>
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

			<CalendarView />
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
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
      <div class="bg-green-700 text-white p-4 text-center text-xl font-bold rounded-t-lg">
        ADD CUSTOM SCHEDULE
      </div>
      <div class="p-6">
        <form class="grid grid-cols-2 gap-4">
          <!-- Class Name -->
          <div>
            <label class="block text-gray-700 font-medium">Class Name</label>
            <input
              type="text"
              placeholder="Type Class Name"
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>

          <!-- Professor Name -->
          <div>
            <label class="block text-gray-700 font-medium">Prof First Name</label>
            <input
              type="text"
              placeholder="Type First Name"
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium">Prof Last Name</label>
            <input
              type="text"
              placeholder="Type Last Name"
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>

          <!-- Select Days -->
          <div class="col-span-2">
            <label class="block text-gray-700 font-medium">Select Days:</label>
            <div class="flex space-x-2 mt-1">
              {#each ["MON", "TUES", "WED", "THUR", "FRI", "SAT"] as day}
                <button
                  type="button"
                  class="px-4 py-2 rounded-md border bg-gray-200 text-gray-700"
                >
                  {day}
                </button>
              {/each}
            </div>
          </div>

          <!-- Start Time -->
          <div>
            <label class="block text-gray-700 font-medium">Select Start Time</label>
            <input
              type="time"
              class="border border-gray-300 rounded-md p-2 mt-1 w-full"
            />
          </div>

          <!-- Class Length -->
          <div>
            <label class="block text-gray-700 font-medium">Class Length</label>
            <select class="w-full border border-gray-300 rounded-md p-2 mt-1">
              <option value="">Select Class Length</option>
              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              on:click={() => (isUploadModalActive = false)}
            >
              Cancel
            </button>
            <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded-md">
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

{#if isAddCustomModalActive}
		<AddCustomSchedule 
			isOpen={isAddCustomModalActive} 
			onClose={handleCustomModal} 
		/>
	{/if}

	
</main>




<style lang="postcss">
	/* .custom-scrollbar {
	  scrollbar-color: red orange !important;
	  scrollbar-width: thick !important;
	} */

	.confirm-schedule {
		position: absolute !important;
		top: 623px !important;
		left: 34% !important;
		background-color: #00834d !important;
		font-weight: bold !important;
		text-transform: uppercase !important;
		color: white !important;
		z-index: 1000 !important;
	}

	input[type='file'] {
		display: none;
	}

	.editable-input {
		@apply input border-none shadow-inner p-2 !border-black rounded-lg !bg-yellow-100;
	}

	.upload-modal {
		overflow: scroll !important;
		overflow-y: scroll;
	}

	.ec-day {
		min-width: fit-content !important;
		min-height: fit-content !important;
	}

	select.filterSelect {
		font-size: 18px;
		text-transform: uppercase;
		color: #275D38;
		border-radius: 8px;
		border: 1px solid #DCDCDD;
		padding: 8px 2px;
		margin: 5px 0;
		background-color: white;
		font-family: rajdhani;
		font-weight: 600;
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


</style>
