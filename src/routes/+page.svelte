<script lang="ts">
	// imports
	import CalendarView from "$lib/components/CalendarView.svelte";
	// import AddEvent from "$lib/components/modals/AddEvent.svelte";
	import { addEventModalActive } from "$lib/stores/modals";
	import { onMount } from 'svelte';
	import { events } from "$lib/stores/events";
	import Papa from 'papaparse';
	
	// modal setters
	let isUploadModalActive = false;
	function handleUploadModal() {
	isUploadModalActive = !isUploadModalActive;
	}

	$addEventModalActive = false;

	let	handleAddEventModal = () => {
		$addEventModalActive = true;
	}

	// clears events store for testing DELETE LATER
	events.set([]);

	// CSV file handling
  let fileInput: any;
  let csvData: any[] = ['default'];
  let file: any;

  onMount(() => {
	fileInput.addEventListener('change', grabFile);
  });

  function grabFile(event: { target: { files: any[]; }; }){
    file = event.target.files[0];
	handleFileChange();
  }

  function handleFileChange() {

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
					addImportedCourses(row["Course Title"]);
				}
			});
		
			// console.log('raw csv data:', csvData);
        };
        reader.readAsText(file);

    }
  }
//   end CSV file handling
function addImportedCourses(courseTitle: string) {

	events.update(newEvent => {
        newEvent.push({ title: courseTitle, start: '2023-01-01', end: '2023-01-02' });
        return newEvent;
    });

}

// add courses modal
events.subscribe(value => {
    console.log(value);
  });
</script>

<main>


	<!-- main functionality buttons -->
	<div class="flex">
		<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleAddEventModal}>Filter</button>
		<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleUploadModal}>Upload</button>
		<input class="input text-black" type="file" accept=".csv" bind:this={fileInput} />
		<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleAddEventModal}>Add Schedules</button>
		<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleAddEventModal}>Edit Schedules</button>
		</div>


		<!-- commented out add event modual until I get it to work -->
	<!-- {#if $addEventModalActive}
		<AddEvent />
	{/if} -->



	<!-- file upload and parse until I figure out another way -->
<div class="border-2">
<h2>File Content:</h2>
{#each csvData as row}
{#if row.CRN}
<div class="flex flex-wrap flex-col border-2">
	<p>Course Catalog Name: {row.Course}</p>
	<p>Course Title: {row["Course Title"]}</p>
	<p>Meeting Time: {row["Meeting Pattern"]}</p>
	<p>Professor: {row.Instructor}</p>
	<p>Room Number: {row["Building and Room"]}</p>
</div>
{/if}
{/each}
    </div>

	<!-- calendar view -->
	<CalendarView />

	<!-- modals -->

	<!-- upload modal -->
	{#if isUploadModalActive}
	<div class="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 min-h-full max-h-full">
		<div class="flex flex-wrap bg-white m-10">
			<p>Upload a Schedule</p>
			<input class="input text-black" type="file" accept=".csv" id="fileInput" />
			<button>Upload</button>
			<button on:click={handleUploadModal}>Cancel</button>
		</div>
	</div>
{/if}
</main>

