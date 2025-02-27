<script lang="ts">

	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { events } from '$lib/stores/events';
	import { parseCSVFile } from '$lib/functions/parseCSVUtil.ts';
	export const courses: any = [];
	let uploadedCourses: any[] = [];
	import AddCustomSchedule from '$lib/components/modals/AddEvent.svelte';



	let csvFinal: any[] = [];
	// modal setters
	let isUploadModalActive = false;
	let isEditModalActive = false;
	function handleEditModal() {
		isEditModalActive = !isEditModalActive;
	}
	function handleUploadModal() {
		isUploadModalActive = !isUploadModalActive;
	}
	function handleUploadCustomSuhedules() {
    isUploadModalActive = !isUploadModalActive;
  }

  let isAddCustomModalActive = false;
	
	function handleCustomModal() {
		isAddCustomModalActive = !isAddCustomModalActive;
	}


	// CSV file handling
	let file: any;
	let fileName = 'No file chosen';

	function handleFileChange(event: any) {
		file = event.target.files[0];
		if (file) {
			fileName = file.name;
		} else {
			fileName = 'No file chosen';
		}
	}


// this function will parse the CSV file, see the parseCSVUtil.ts file for more details
	async function parseCSV() {
    if (file) {
      const processedCourses = await parseCSVFile(file);
      
      // Update the uploadedCourses with the processed data
      uploadedCourses = processedCourses;
      
      // Update the global store with the new courses
      events.update((value: any) => {
        return [...value, ...processedCourses];
      });
      
      // Reset UI state
      fileName = 'No file chosen';
      handleUploadModal();
    } else {
      console.log('No file chosen');
    }
  }	//   end CSV file handling





</script>

<main class="h-full w-full">
	<!-- main functionality buttons -->
	<div class="w-full flex justify-between bg-gray-100 h-[44px]">
		<div class="flex flex-wrap flex-col mx-3 items-center justify-center">
			<p class="uppercase text-[18px]">Title:</p>
			<input
				class="input !bg-white placeholder-[#757677] !rounded-[3px] mx-2"
				type="text"
				name=""
				id=""
				placeholder="Default Schedule Title"
			/>
		</div>

		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary rounded-md text-sm mx-2 font-primary uppercase"
			on:click={handleUploadModal}>Add Timeblock</button
		>
	</div>


	<body class="flex flex-wrap w-full h-full flex-row">
		<!-- sidebar -->
		<div id="sidebar" class="w-auto h-auto border border-[#DCDCDD] border-y-2">

			<!-- import sidebar -->
			<div id="import" class="border m-4 p-2 w-[269px] rounded-lg">
				<p class="text-[15px] text-uvu-green">Current file:</p>
				<p>{fileName}</p>
				<button
					type="button"
					class="btn bg-[#DDDDDD] uppercase rounded-2xl text-sm font-primary w-full"
					on:click={handleUploadModal}>Import New .CSV</button
				>
			</div>

			<!-- filter sidebar -->
			<div id="filterSection" class="flex flex-wrap flex-col m-4">
				<p class="uppercase font-primary-bold text-[18px]">Select schedule</p>
				<button class="uppercase underline text-[14px] text-[#A7A8AA] text-left">reset filters</button>
				<select class="filterSelect" name="" id="">Professors <option value="">Professors</option></select>
				<select class="filterSelect" name="" id="">Rooms <option value="">Rooms</option></select>
				<select class="filterSelect" name="" id="">Courses <option value="">Courses</option></select>
			</div>

			<!-- add and edit schedules sidebar -->
			<div class="flex flex-wrap flex-col justify-center items-center">
				<button
				type="button"
				class="addAndEditBtn"
				on:click={handleEditModal}>Edit Schedules</button
			>
				<button
					type="button"
					class="addAndEditBtn"
					on:click={handleCustomModal}>Add Schedules</button
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
	{#if isUploadModalActive}
		<div
			class="bg-black bg-opacity-50 w-full h-fit fixed top-0 left-0 min-h-full flex justify-center z-40"
		>
			<div class="relative">
				<div
					class="flex flex-wrap bg-white m-10 rounded-[8px] w-fit md:min-w-[620px] max-w-[620px] h-fit max-h-[600px] overflow-auto shadow-xl custom-scrollbar upload-modal min-h-[226px] "
				>
			
						<p
							class="w-full text-white uppercase bg-[#00843D] text-[31px] flex items-center px-[24px] py-[12px] font-primary-semibold"
						>
							Import .CSV
						</p>
						<form class="w-full" on:submit|preventDefault={parseCSV}>
							<div class="flex flex-wrap justify-center items-center">
								<label
									for="file-upload"
									class="custom-file-upload flex flex-wrap justify-start items-center mt-2 w-[438px] rounded-[8px]"
								>
									<p
										class="flex flex-wrap justify-center items-center btn bg-uvu-green text-white p-2 uppercase font-[16px] font-bold rounded-[8px]"
									>
										Choose File
									</p>
									{#if fileName === 'No file chosen'}
										<p
											class="text-[#DDDDDD] border-[#DDDDDD] border-2 rounded-[8px] p-[6px] border-l-0"
										>
											{fileName}
										</p>
									{:else}
										<p class="border-[#DDDDDD] border-2 rounded-[8px] h-full p-[6px] border-l-0">
											{fileName}
										</p>
									{/if}
								</label>
							</div>

							<input
								class="my-3 input text-black max-w-[620px] rounded-none bg-white border-2 !border-black"
								type="file"
								accept=".csv"
								name="fileUpload"
								id="file-upload"
								on:change={handleFileChange}
							/>
							<div class=" flex m-2 justify-end">
								<button
									class=" bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green mr-2 uppercase text-sm"
									on:click={handleUploadModal}>Cancel</button
								>
								<button
									class=" bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green uppercase text-sm"
									type="submit">Upload</button
								>
							</div>
						</form>
				
				</div>
			</div>
		</div>
	{/if}

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
	}

	
</style>
