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
	import { convertTo24Hour } from '$lib/functions/24HrConversion.ts';
	export const courses: any = [];
	import type { Timeblock } from '$lib/types/Timeblock.ts';
	let uploadedCourses: any[] = [];



	let csvFinal: any[] = [];
	// modal setters
	let isUploadModalActive = false;
	function handleUploadModal() {
		isUploadModalActive = !isUploadModalActive;
	}


	// CSV file handling
	let csvData: any[] = [];
	let file: any;
	let loadingPromise: Promise<number>;
	let fileName = 'No file chosen';

	// this function handles the file change event, so that parsing can be done
	function handleFileChange(event: any) {
		file = event.target.files[0];
		if (file) {
			fileName = file.name;
		} else {
			fileName = 'No file chosen';
		}
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

			//we need to filter out any rows that don't have a CRN, as they do not have a meeting pattern
			csvFinal = csvData.filter((row) => row.hasOwnProperty('CRN'));

			//Since the data has meeting patterns that are abbreviated, we need to map the abbreviations to the preset days we specified in the vkurko calendar
			const dayMapping = {
			m: '2024-07-01T',
   			t: '2024-07-02T',
    		w: '2024-07-03T',
    		r: '2024-07-04T',
    		f: '2024-07-05T'
		};

	


		//splits up the meeting pattern into days and times
		csvData.forEach((row) => {
			if (row.CRN && row['Meeting Pattern'] !== 'Does Not Meet') {
				const [meetingDays, meetingTime] = row['Meeting Pattern'].split(' ', 2);
				row.meetingDays = meetingDays
					.split('')
					.map((day: string) => dayMapping[day.toLowerCase() as keyof typeof dayMapping]);
					row.meetingTime = meetingTime.split('-').map(convertTo24Hour);
			}
		});

	

		  // due to the way the vkurko calendar works, every event has a title, start, and end property. We need to cram the data into this format
		
			
			//let's add the courses to the uploadedCourses array
			csvFinal.forEach((course) => {
				// if the course meets on more than one day, we need to create a separate event for each day
				if (course.meetingDays.length > 1){
				course.meetingDays.forEach((day:any)=>{

					// course.meetingTime = course.meetingTime.map((time: string) => convertTimeTo24Hour(time));

					

					const newCourse = {
						
						title: course.Course + ' ' + course['Building and Room'],
						start: day + course.meetingTime[0],
						end: day + course.meetingTime[1],
						buildingAndRoom: course['Building and Room'],
						CRN: course.CRN,
						Course: course.Course,
						Instructor: course.Instructor,
						meetingDays: course.meetingDays,
						meetingTime: course.meetingTime,
				
					};
					uploadedCourses.push(newCourse);
					// console.log('uploadedCourses:', uploadedCourses);

				});
				
				}
				else{
					const newCourse = {
						title: course.Course + ' ' + course['Building and Room'],
						start: '2024-07-01T' + course.meetingTime[0],
						end: '2024-07-01T' + course.meetingTime[1],
						buildingAndRoom: course['Building and Room'],
						CRN: course.CRN,
						Course: course.Course,
						Instructor: course.Instructor,
						meetingDays: course.meetingDays,
						meetingTime: course.meetingTime,
					};
					uploadedCourses.push(newCourse);
					// console.log('uploadedCourses:', uploadedCourses);

				}
			});



		// add timeblocks to the events store, which communicates with the calendar
		// timeblocks.forEach((timeblock) => {
		// 	courses.push(timeblock);
		// 	events.update((value: any) => {
		// 		return [...value, timeblock];
		// 	});
		// });

		uploadedCourses.forEach((course) => {
			events.update((value: any) => {
				return [...value, course];
			});
		});

		


		} // end if(file)
		else {
			console.log('No file chosen');
		}

		

		

		fileName = 'No file chosen';

		

		handleUploadModal();
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
				on:click={handleUploadModal}>Edit Schedules</button
			>
				<button
					type="button"
					class="addAndEditBtn"
					on:click={handleUploadModal}>Add Schedules</button
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
