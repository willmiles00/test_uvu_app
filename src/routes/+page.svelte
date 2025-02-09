<script lang="ts">
// will branch tasks. if you see this in prod I'm sorry
// Styling Sidebar
//Styling import .csv
//Finalize import .csv functionality

// comment so I can push something
	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { events } from '$lib/stores/events';
	import Papa from 'papaparse';
	import { filter, ProgressRadial } from '@skeletonlabs/skeleton';
	export const courses: any = [];
	import type { Timeblock } from '$lib/types/Timeblock.ts';
	import test from 'node:test';
	let csvFinal: any[] = [];
	// modal setters
	let isUploadModalActive = false;
	function handleUploadModal() {
		isUploadModalActive = !isUploadModalActive;
	}

	// timeblock store, see types/Timeblock.ts for more info
	let timeblocks: Timeblock[] = [];
	// console.log('timeblocks:', timeblocks);



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


  //parseCSV needs to be async so that we can wait for the file to be uploaded before we can access parts of the data
  function resolveAfter1Second() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 1000);
  });
}

	// this takes the uploaded file and parses it into a usable format
	async function parseCSV() {
		if (file) {
			const reader = new FileReader();
			const uploadedData = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
				// CourseLeaf has two lines of metadata at the beginning of the file, so we need to remove them

				//In order to remove the first two lines, we need to split the string into lines, remove the first two lines, and then join the remaining lines back into a string.:
				const lines = uploadedData.split('\n'); // Split the string into lines

				// Remove the first two lines
				const removeHeaders = lines.slice(2);

				// Join the remaining lines back into a string
				const uploadedDataHeadersRemoved = removeHeaders.join('\n');

				// csvData is the data that we will be using
				csvData = Papa.parse(uploadedDataHeadersRemoved, { header: true }).data;

				//finally, we need to filter out any rows that don't have a CRN, as they do not have a meeting pattern


}
resolveAfter1Second().then(() => {
				csvFinal = csvData.filter((row) => row.hasOwnProperty('CRN'))
				console.log('csvFinal:', csvFinal[0].meetingDays);
				
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
		
			};
			
		

	


	//   end CSV file handling





	// this will take the user confirmed courses and add them to a courses array, to add them to the calendar
// 	function confirmImportedCourses(event: any){
	
// 		event.preventDefault();

// 		//due to the way the calendar works, we need to map the days to specific dates
// 		const dayToDateMap = {
//   'Monday': '2024-07-01 T',
//   'Tuesday': '2024-07-02 T',
//   'Wednesday': '2024-07-03 T',
//   'Thursday': '2024-07-04 T',
//   'Friday': '2024-07-05 T'
// };

// function mapMeetingDays(days: Array<string>) {
//   let newMap = days.map(day => dayToDateMap[day]);
//   console.log('new map:', newMap);
//   return newMap;
// }



//     const form = event.target;
//     csvData.forEach((row, index) => {
		

//       if (row.CRN && row['Meeting Pattern'] !== 'Does Not Meet') {
// 		// since our calendar doesn't allow repeating events, we need to map the days to specific dates
// 		let calendarFriendlyDays = mapMeetingDays(row.meetingDays);
// 		calendarFriendlyDays.forEach((day: any) => {
//         const course = {
//         //   title: form[`name-${index}`].value + form[`crn-${index}`].value,
// 		title:	{html: form[`name-${index}`].value + "<br> CRN: " + form[`crn-${index}`].value + "<br> Instructor: " + form[`instructor-${index}`].value + "<br> Building and Room: " + form[`building-room-${index}`].value},
//           crn: form[`crn-${index}`].value,
//           instructor: form[`instructor-${index}`].value,
//           buildingRoom: form[`building-room-${index}`].value,

// 			meetingDays: mapMeetingDays(row.meetingDays),
// 		  start: day + form[`start-time-${index}`].value,
// 		  end: day + form[`end-time-${index}`].value,
// 		  backgroundColor: `#${form[`crn-${index}`].value}e`
//         };
//         courses.push(course);
// 		events.update((value: any) => {
// 			return [...value, course];
// 		});
// 	})
	


//       }



//     });

//     // console.log('here is the pushed courses,', courses);
// 	isUploadModalActive = !isUploadModalActive;
// 	}

  

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

	// $:
	// if (csvFinal.length > 0) {
	// 	const timeblocks = csvFinal.map((row) => ({
    //       buildingAndRoom: row['Building and Room'],
    //       CRN: row.CRN,
    //       Course: row.Course,
    //       Instructor: row.Instructor,
    //       meetingDays:  row.meetingDays ?? [],
    //       meetingTime: row.meetingTime	?? []
    //     }));

	// 			console.log('timeblocks:', timeblocks);
	// }
</script>

<main class="h-full w-full">
	<!-- main functionality buttons -->
	 <div class="w-full flex justify-between bg-gray-100 h-[44px]">

		<div class="flex flex-wrap flex-col mx-3 items-center justify-center">
<p class="uppercase text-[18px]">Title:</p>
<input class="input !bg-white placeholder-[#757677] !rounded-lg"  type="text" name="" id="" placeholder="Default Schedule Title">
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

	<div id="import" class="border m-4 p-2 w-[269px] rounded-lg">
<p class="text-[15px] text-uvu-green">Current file:</p>
<p>{fileName}</p>
<button
			type="button"
			class="btn bg-[#DDDDDD] uppercase rounded-2xl text-sm font-primary w-full"
			on:click={handleUploadModal}>Import New .CSV</button
		>
	</div>	

	<div class="flex flex-wrap flex-col">
		<p>Select schedule to view</p>
		<p>reset filters</p>
		<select name="" id="">Professors  <option value="">Professors</option></select>
		<select name="" id="">Rooms  <option value="">Rooms</option></select>
		<select name="" id="">Courses  <option value="">Courses</option></select>
	</div>

	<div class="flex flex-wrap flex-col">
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
	
			<!-- this is the button that shows up when a user confirms their details, it is away from everything else for stylistic purposes -->
			<button type="submit" form="confirmedClasses" class="confirm-schedule btn variant-filled rounded-xl p-2 text-lg">Confirm Schedule</button>
		
			{/if}
			<!-- end submit block, start rest of content -->
			<div class="flex flex-wrap bg-white m-10 rounded-[8px] w-fit md:min-w-[620px] max-w-[620px] h-fit max-h-[600px] overflow-auto shadow-xl custom-scrollbar upload-modal min-h-[226px]">
				
				{#if csvData.length < 1}
				<p class="w-full text-white uppercase bg-[#00843D] text-[31px] flex items-center px-[24px] py-[12px] font-primary-semibold">Import .CSV</p>
				<form class="w-full" on:submit|preventDefault={parseCSV}>

				<div class="flex flex-wrap justify-center items-center">
				<label for="file-upload" class="custom-file-upload flex flex-wrap justify-start items-center mt-2  w-[438px] rounded-[8px] ">
					<p class="flex flex-wrap justify-center items-center btn bg-uvu-green text-white p-2 uppercase font-[16px] font-bold rounded-[8px]">
						Choose File
					</p>
					{#if fileName === "No file chosen"}
				<p class="text-[#DDDDDD] border-[#DDDDDD] border-2 rounded-[8px] p-[6px]  border-l-0">{fileName}</p>
				{:else}
				<p class="border-[#DDDDDD] border-2 rounded-[8px] h-full p-[6px] border-l-0">{fileName}</p>
				{/if}
				</label>
			</div>

					<input class="my-3 input text-black max-w-[620px] rounded-none bg-white border-2 !border-black" type="file" accept=".csv" name="fileUpload" id="file-upload" on:change={handleFileChange}/>
					<div class=" flex m-2 justify-end">
						<button class=" bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green mr-2 uppercase text-sm" on:click={handleUploadModal}>Cancel</button>
					<button class=" bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green uppercase text-sm" type="submit"
						>Upload</button>
					</div>
				</form>
				{/if}
				<!-- this is temporarily where the uploaded data is going -->
				{#if csvData.length > 0}
				<!-- <form id="confirmedClasses" class="min-w-[400px] w-full" on:submit|preventDefault={confirmImportedCourses}> -->
					<form id="confirmedClasses" class="min-w-[400px] w-full" on:submit|preventDefault={handleUploadModal}>
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
				<!-- {/await} -->
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