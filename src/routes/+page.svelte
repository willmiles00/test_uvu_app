<script lang="ts">
// will branch tasks. if you see this in prod I'm sorry
// Styling Sidebar
//Styling import .csv
//Finalize import .csv functionality
	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { events } from '$lib/stores/events';
	import Papa from 'papaparse';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	export const courses: any = [];

	// modal setters
	let isUploadModalActive = false;
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

				const dayMapping = {
    m: 'Monday',
    t: 'Tuesday',
    w: 'Wednesday',
    r: 'Thursday',
    f: 'Friday'
};

function convertTo24Hour(time: any) {
    const [timePart, modifier] = time.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    if (modifier.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
  }

				
				csvData.forEach((row) => {
					if (row.CRN && row['Meeting Pattern'] !== 'Does Not Meet') {
					// console.log('Meeting Pattern:', row['Meeting Pattern']);

					const [meetingDays, meetingTime] = row['Meeting Pattern'].split(' ', 2);
					row.meetingDays = meetingDays.split('').map((day: string) => dayMapping[day.toLowerCase() as keyof typeof dayMapping]);
					row.meetingTime = meetingTime.split('-').map(convertTo24Hour);
					// console.log('Rows with this specfic pattern:', row.meetingDays, row.meetingTime);
					// console.log('meeting times:', row.meetingTime);
					}
				
					else if (row.CRN && row['Meeting Pattern'] === 'Does Not Meet') {
						row.meetingDays = 'Online';
						row.meetingTime = 'Does Not Meet';
					}
				});
				// console.log('raw csv data:', csvData);
			};
			reader.readAsText(file);
		}
	}
	//   end CSV file handling





	// this will take the user confirmed courses and add them to a courses array, to add them to the calendar
	function confirmImportedCourses(event: any){
	
		event.preventDefault();

		//due to the way the calendar works, we need to map the days to specific dates
		const dayToDateMap = {
  'Monday': '2024-07-01 T',
  'Tuesday': '2024-07-02 T',
  'Wednesday': '2024-07-03 T',
  'Thursday': '2024-07-04 T',
  'Friday': '2024-07-05 T'
};

function mapMeetingDays(days) {
  let newMap = days.map(day => dayToDateMap[day]);
  console.log('new map:', newMap);
  return newMap;
}



    const form = event.target;
    csvData.forEach((row, index) => {


      if (row.CRN && row['Meeting Pattern'] !== 'Does Not Meet') {
		// since our calendar doesn't allow repeating events, we need to map the days to specific dates
		let calendarFriendlyDays = mapMeetingDays(row.meetingDays);
		calendarFriendlyDays.forEach((day: any) => {
        const course = {
        //   title: form[`name-${index}`].value + form[`crn-${index}`].value,
		title:	{html: form[`name-${index}`].value + "<br> CRN: " + form[`crn-${index}`].value + "<br> Instructor: " + form[`instructor-${index}`].value + "<br> Building and Room: " + form[`building-room-${index}`].value},
          crn: form[`crn-${index}`].value,
          instructor: form[`instructor-${index}`].value,
          buildingRoom: form[`building-room-${index}`].value,

			meetingDays: mapMeetingDays(row.meetingDays),
		  start: day + form[`start-time-${index}`].value,
		  end: day + form[`end-time-${index}`].value,
		  backgroundColor: `#${form[`crn-${index}`].value}e`
        };
        courses.push(course);
		events.update((value: any) => {
			return [...value, course];
		});
	})
		// console.log('here is the pushed courses,', courses);


      }



    });

    // console.log('here is the pushed courses,', courses);
	isUploadModalActive = !isUploadModalActive;
	}

  

	function handleMeetingChange(event: Event, row: any) {
		const input = event.target as HTMLInputElement;
        row.meetingTime = input.checked ? 'Does Not Meet' : '';
		// console.log('meeting time:', row.meetingTime);
	}


    // afterUpdate(() => {
    //     events.subscribe(value => {
    //         value.forEach((event) => {
	// 			console.log('event:', event);
    //         });
    //         console.log('total events store', value);
    // });
    // });
</script>

<main class="h-full">
	<!-- main functionality buttons -->
	 <div class="w-full flex justify-end bg-gray-100">
	<div class="flex my-2 ">
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary uppercase rounded-md text-sm mx-2 font-primary"
			on:click={handleUploadModal}>Filter</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary uppercase rounded-md text-sm mx-2 font-primary"
			on:click={handleUploadModal}>Import CSV</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary uppercase rounded-md text-sm mx-2 font-primary"
			on:click={handleUploadModal}>Add Schedules</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary uppercase rounded-md text-sm mx-2 font-primary mr-3"
			on:click={handleUploadModal}>Edit Schedules</button
		>
	</div>
</div>

<body class="flex flex-wrap w-full h-full flex-row">
	 <!-- sidebar -->
	<div id="sidebar" class="w-auto h-auto">
	<div id="import" class="border m-2 p-2 w-[269px]">
<p>current file:</p>
<p>{fileName}</p>
<button>import .csv file</button>
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
			class="bg-black bg-opacity-50 w-full h-fit fixed top-0 left-0 min-h-full  flex justify-center"
		>
	
		<div class="relative">
			<!-- this is the submit button that I couldn't quite figure out where the right place to put it -->
			{#if csvData.length > 0}
			<!-- svelte-ignore empty-block -->
			{#await loadingPromise}
			{:then}
			<!-- this is the button that shows up when a user confirms their details, it is away from everything else for stylistic purposes -->
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
				<div class="w-full h-full bg-uvu-green rounded-lg flex flex-col justify-center items-center p-4">
				<h2 class="text-white text-2xl font-bold my-5">Loading...</h2>
				<ProgressRadial class='mb-5'/>
			</div>
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
								<!-- <label for="meeting-time-{index}"><b>Meeting Time:</b></label>
								<input class="editable-input" type="text" id="meeting-time-{index}" name="meeting-time-{index}" value={row['Meeting Pattern']} /> -->

								<!-- meeting day logic -->
								<fieldset>
									<legend class="font-bold">Meeting Days:</legend>
									{#each ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Online'] as day}
									<label>
									  <input type="checkbox" name="days[]" value={day}   checked={row.meetingDays.includes(day)}> 
									  {day}
									</label>
								  {/each}
									</fieldset>
								  <!-- end meeting day logic -->

								  <!-- meeting time logic -->
								<label class="font-bold" for="meeting-time-{index}">Meeting Time:</label>
								{#if row.meetingTime !== 'Does Not Meet'}
								<label class="w-full">
									<input type="checkbox" name="days[]" value='Does Not Meet' on:change={(event) => handleMeetingChange(event, row)}/>
									Does Not Meet
								</label>
								<div class="flex flex-wrap">
									<div class="flex flex-col mr-2">
										<label for="start-time-{index}"><b>Start Time:</b></label>
										<input class="editable-input" type="time" id="start-time-{index}" name="start-time-{index}"  value="{row.meetingTime[0]}"/>
									</div>
									<div class="flex flex-col">
										<label for="end-time-{index}"><b>End Time:</b></label>
										<input class="editable-input" type="time" id="end-time-{index}" name="end-time-{index}" value="{row.meetingTime[1]}" />
									</div>
								</div>
								{:else}
								<label class="w-full">
									<input type="checkbox" name="does-not-meet" value='Does Not Meet' on:change={(event) => handleMeetingChange(event, row)} checked/>
									Does Not Meet
								</label>
								{/if}
								<!-- end meeting time logic -->


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

.ec-day {
  min-width: fit-content !important;
  min-height: fit-content !important;
}


</style>