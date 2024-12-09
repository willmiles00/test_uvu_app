<script lang="ts">
	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';
	import Papa from 'papaparse';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	export const courses: any = [];

	// modal setters
	let isUploadModalActive = true;
	function handleUploadModal() {
		isUploadModalActive = !isUploadModalActive;
	}




	// temp events store for testing DELETE LATER
	let tempEvents = [];

	// CSV file handling
	let csvData: any[] = [];
	let file: any;
	let loadingPromise: Promise<number>;
		let fileName = "No file chosen";

	// this function handles the file change event, so that parsing can be done
  function handleFileChange(event: any) {
    file = event.target.files[0];
    if (file) {
      fileName = file.name;
    } else {
      fileName = "No file chosen";
    }
  }


	// this takes the uploaded file and parses it into a usable format
	function parseCSV() {
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				// this is the data that was uploaded
				let uploadedData = reader.result as string;
				// CourseLeaf has two lines of metadata at the beginning of the file, so we need to remove them

				//In order to remove the first two lines, we need to split the string into lines, remove the first two lines, and then join the remaining lines back into a string.:
				const lines = uploadedData.split('\n'); // Split the string into lines

				// Remove the first two lines
				const removeHeaders = lines.slice(2);

				// Join the remaining lines back into a string
				const uploadedDataHeadersRemoved = removeHeaders.join('\n');

				// csvData is the data that we will be using
				csvData = Papa.parse(uploadedDataHeadersRemoved, { header: true }).data;

				

				// a promise to simulate loading time
				loadingPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(1);
                    }, 2000);
                });
				
				csvData.forEach((row) => {
					if (row.CRN && row['Meeting Pattern'] !== 'Does Not Meet') {
					// console.log('Meeting Pattern:', row['Meeting Pattern']);

					const [meetingDays, meetingTime] = row['Meeting Pattern'].split(' ', 2);
            		row.meetingDays = meetingDays;
           			row.meetingTime = meetingTime;
					console.log('Rows with this specfic pattern:', row);
					}
				});
				console.log('raw csv data:', csvData);
			};
			reader.readAsText(file);
		}
	}
	//   end CSV file handling

	// this will take the user confirmed courses and add them to a courses array, to add them to the calendar
	function confirmImportedCourses(event: any){
	event.preventDefault();
    const form = event.target;
    csvData.forEach((row, index) => {
      if (row.CRN) {
        const course = {
          title: form[`name-${index}`].value,
          crn: form[`crn-${index}`].value,
          meetingTime: form[`meeting-time-${index}`].value,
          instructor: form[`instructor-${index}`].value,
          buildingRoom: form[`building-room-${index}`].value,
		//   these values are for testing
		  start: '2024-07-01T12:00:00',
		  end: '2024-07-01T13:00:00',
        };
        courses.push(course);
		events.update((value: any) => {
			return [...value, course];
		});
      }

    });

    console.log('here is the pushed courses,', courses);
	isUploadModalActive = !isUploadModalActive;
	}

  

	
</script>

<main class="h-full">
	<!-- main functionality buttons -->
	<div class="flex">
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleUploadModal}>Filter</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleUploadModal}>Upload</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleUploadModal}>Add Schedules</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleUploadModal}>Edit Schedules</button
		>
	</div>

	<!-- calendar view -->
	<button class="btn variant-filled" >Add event</button>
	<CalendarView />

	<!-- modals -->

	<!-- upload modal -->
	{#if isUploadModalActive}

		<div
			class="bg-black bg-opacity-50 w-full h-fit fixed top-0 left-0 min-h-full  flex justify-center"
		>
	
		<div class="relative">
			<!-- this is the submit button that I couldn't quite figure out where the right place to put it -->
			{#if csvData.length > 0}
			<!-- svelte-ignore empty-block -->
			{#await loadingPromise}
			{:then}
			<button type="submit" form="confirmedClasses" class="confirm-schedule btn variant-filled rounded-xl p-2 text-lg">Confirm Schedule</button>
			{/await}
			{/if}
			<!-- end submit block, start rest of content -->
			<div class="flex flex-wrap bg-white m-10 p-10 rounded-xl w-fit md:min-w-[620px] max-w-[620px] h-fit max-h-[600px] overflow-auto shadow-xl custom-scrollbar upload-modal">
				<button class="absolute top-8 right-[4.5%]  font-bold h-[30px] w-[30px] bg-red-500 p-2 rounded-full flex flex-col justify-center items-center shadow-2xl" on:click={handleUploadModal}><img src="/xmark-solid.svg" alt="close div"></button>
				{#if csvData.length < 1}
				<p class="w-full text-2xl text-uvu-green font-bold text-center m-5">Upload a Schedule</p>
				<form class="w-full" on:submit|preventDefault={parseCSV}>
					<button type="button" class=" w-full flex flex-wrap justify-center items-center">
					<label for="file-upload" class="custom-file-upload flex flex-col justify-center items-center">
						<img src="/arrow-up-solid.svg" alt="upload arrow" class="h-[80px] w-[80px] p-2 bg-uvu-green rounded-full cursor-pointer underline mb-6 hover:bg-[#00834d]">
						{#if fileName === "No file chosen"}
					<p>{fileName}</p>
					{:else}
					<p>Uploaded file: {fileName}</p>
					{/if}
					</label>
				</button>
					<input class="my-3 input text-black max-w-[620px] rounded-none bg-white border-2 !border-black" type="file" accept=".csv" name="fileUpload" id="file-upload" on:change={handleFileChange}/>
					<div class=" flex justify-center m-2">
					<button class="btn bg-gradient-to-br variant-gradient-primary-secondary" type="submit"
						>Upload</button>
					</div>
				</form>
				{/if}
				<!-- this is temporarily where the uploaded data is going -->
				{#if csvData.length > 0}
				{#await loadingPromise}
				<ProgressRadial />
				{:then}
	
			
				 <p class="w-full text-2xl text-uvu-green font-bold text-center mb-2">Confirm Imported Data</p>
				<form id="confirmedClasses" class="min-w-[400px] w-full" on:submit|preventDefault={confirmImportedCourses}>
					{#each csvData as row, index}
						{#if row.CRN}
							<div id="course-{index}" class="flex flex-wrap flex-col border border-[#275D38] mb-2 p-2 rounded-lg">
								<label for="name-{index}"><b>Course Catalog Name:</b></label>
								<input class="editable-input" type="text" id="name-{index}" name="name-{index}" required value={row.Course} />
								<label for="crn-{index}"><b>CRN:</b></label>
								<input class="editable-input" type="text" id="crn-{index}" name="crn-{index}" required value={row.CRN} />
								<label for="meeting-time-{index}"><b>Meeting Time:</b></label>
								<input class="editable-input" type="text" id="meeting-time-{index}" name="meeting-time-{index}" value={row['Meeting Pattern']} />
								<label class="font-bold" for="instructor-{index}">Instructor(s):</label>
								<textarea class="editable-input" rows="2" id="instructor-{index}" name="instructor-{index}">{row.Instructor}</textarea>
								<label class="font-bold" for="building-room-{index}">Building and Room:</label>
								<input class="editable-input" type="text" id="building-room-{index}" name="building-room-{index}" value={row['Building and Room']} />
							</div>

						{/if}
					{/each}
						</form>
				{/await}
				{/if}
			
			
			</div>
		</div>
		</div>
	{/if}
</main>

<style lang='postcss'>
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

	input[type="file"] {
  display: none;
}

.editable-input {
 @apply input border-none shadow-inner p-2 !border-black rounded-lg !bg-yellow-100;
}

.upload-modal {
	overflow: scroll !important;
	overflow-y:scroll;

}

</style>