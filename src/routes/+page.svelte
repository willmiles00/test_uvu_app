<script lang="ts">
	// imports
	import CalendarView from "$lib/components/CalendarView.svelte";
	import AddEvent from "$lib/components/modals/AddEvent.svelte";
	import { addEventModalActive } from "$lib/stores/modals";
	import { onMount } from 'svelte';
	import Papa from 'papaparse';
	
	// modal setters
	$addEventModalActive = false;

	let	handleAddEventModal = () => {
		$addEventModalActive = true;
	}

	

	// CSV file handling
  let fileInput: any;
  let csvData: any[] = ['default'];

  onMount(() => {
    fileInput.addEventListener('change', handleFileChange);
  });

  function handleFileChange(event: { target: { files: any[]; }; }) {
    const file = event.target.files[0];
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
		
		
			console.log(csvData);

        };
        reader.readAsText(file);

    }
  }
//   end CSV file handling


</script>

<main>
	<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleAddEventModal}>Add Event</button>
	<input class="input text-black" type="file" accept=".csv" bind:this={fileInput} />
	{#if $addEventModalActive}
		<AddEvent />
	{/if}
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
	<CalendarView />
</main>

