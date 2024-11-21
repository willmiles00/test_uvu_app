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
  let csvData: any[] = [];

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
			let csvData = Papa.parse(uploadedDataHeadersRemoved, { header: true });
		
		
			console.log(csvData);

        };
        reader.readAsText(file);
    }
  }
//   end CSV file handling


</script>

<main>
	<h1>calendar</h1>
	<button type="button" class="btn bg-gradient-to-br variant-gradient-primary-secondary" on:click={handleAddEventModal}>Add Event</button>
	<input class="input text-black" type="file" accept=".csv" bind:this={fileInput} />
	{#if $addEventModalActive}
		<AddEvent />
	{/if}
	<div class="border-2">
        <h2>File Content:</h2>
        <pre class="w-full">{csvData}</pre> <!-- Display the file content -->
    </div>
	<CalendarView />
</main>

<!-- papaparse -->