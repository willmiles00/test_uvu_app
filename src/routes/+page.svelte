<script lang="ts">
	// imports
	import CalendarView from '$lib/components/CalendarView.svelte';
	// import AddEvent from "$lib/components/modals/AddEvent.svelte";
	import { addEventModalActive } from '$lib/stores/modals';
	import { onMount } from 'svelte';
	import { events } from '$lib/stores/events';
	import Papa from 'papaparse';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	// modal setters
	let isUploadModalActive = false;
	function handleUploadModal() {
		isUploadModalActive = !isUploadModalActive;
	}

	$addEventModalActive = false;
	let handleAddEventModal = () => {
		$addEventModalActive = true;
	};

	// clears events store for testing DELETE LATER
	events.set([]);

	// CSV file handling
	let csvData: any[] = [];
	let file: any;
	let loadingPromise: Promise<number>;

	//   this submits the upload form and grabs the file
	function handleUpload(event: { target: any }) {
		file = event.target[0].files[0];
		parseCSV();
		// handleUploadModal();
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

				csvData.forEach((row) => {
					if (row.CRN) {
						addImportedCourses(row['Course Title']);
					}
				});

				// a promise to simulate loading time
				loadingPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(1);
                    }, 2000);
                });

				// console.log('raw csv data:', csvData);
			};
			reader.readAsText(file);
		}
	}
	//   end CSV file handling

	function addImportedCourses(courseTitle: string) {
		// eventually, this will be a loop that adds all of the courses in the csvData array to the events store
		events.update((newEvent) => {
			newEvent.push({ title: courseTitle, start: '2023-01-01', end: '2023-01-02' });
			return newEvent;
		});
	}

	// this is for testing
	events.subscribe((value) => {
		console.log(value);
	});

	console.log(csvData);

	
</script>

<main>
	<!-- main functionality buttons -->
	<div class="flex">
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleAddEventModal}>Filter</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleUploadModal}>Upload</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleAddEventModal}>Add Schedules</button
		>
		<button
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-secondary"
			on:click={handleAddEventModal}>Edit Schedules</button
		>
	</div>

	<!-- commented out add event modual until I get it to work -->
	<!-- {#if $addEventModalActive}
		<AddEvent />
	{/if} -->

	<!-- calendar view -->
	<CalendarView />

	<!-- modals -->

	<!-- upload modal -->
	{#if isUploadModalActive}
		<div
			class="bg-black bg-opacity-50 w-full h-fit absolute top-0 left-0 min-h-full  flex justify-center"
		>
			<div class="flex flex-wrap bg-gray-400 m-10 p-10 rounded-xl w-fit md:min-w-[620px] h-fit max-h-[600px] overflow-auto shadow-xl custom-scrollbar">
				{#if csvData.length < 1}
				<p class="w-full text-xl text-uvu-green font-bold text-center">Upload a Schedule</p>
				<form class="w-full" on:submit|preventDefault={handleUpload}>
					<input class="input text-black max-w-[620px]" type="file" accept=".csv" name="fileUpload" />
					<button class="btn bg-gradient-to-br variant-gradient-primary-secondary" type="submit"
						>Upload</button
					>
					<button on:click={handleUploadModal}>Cancel</button>
				</form>
				{/if}
				<!-- this is temporarily where the uploaded data is going -->
				{#if csvData.length > 0}
				{#await loadingPromise}
				<ProgressRadial />
				{:then}
				 <p class="w-full text-xl text-uvu-green font-bold text-center">Confirm Imported Data</p>
				<div class="border-2">
					{#each csvData as row}
						{#if row.CRN}
							<div class="flex flex-wrap flex-col border-2">
							<label for="name">Course Catalog Name:</label>
							<input class="input" type="text" id="name" name="name" required value="{row.Course}"/>
								<!-- <p>Course Catalog Name: {row.Course}</p> -->
								<p>Course Title: {row['Course Title']}</p>
								<p>Meeting Time: {row['Meeting Pattern']}</p>
								<p>Professor: {row.Instructor}</p>
								<p>Room Number: {row['Building and Room']}</p>
							</div>
						{/if}
					{/each}
				</div>
				{/await}
				{/if}
			
			</div>
		</div>
	{/if}
</main>

<style postcss>
	/* .custom-scrollbar {
	  scrollbar-color: red orange !important;
	  scrollbar-width: thick !important;
	} */
</style>