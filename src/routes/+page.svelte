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

	

  let fileInput: any;
  let csvData: string = '';

  onMount(() => {
    fileInput.addEventListener('change', handleFileChange);
  });

  function handleFileChange(event: { target: { files: any[]; }; }) {
    const file = event.target.files[0];
	if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            csvData = reader.result as string;
            console.log(csvData);
        };
        reader.readAsText(file);
    }

    // Process the file here
  }


</script>

<main>
	<h1>calendar</h1>
	<button on:click={handleAddEventModal}>Add Event</button>
	<input type="file" accept=".csv" bind:this={fileInput} />
	{#if $addEventModalActive}
		<AddEvent />
	{/if}
	<div>
        <h2>File Content:</h2>
        <pre>{csvData}</pre> <!-- Display the file content -->
    </div>
	<CalendarView />
</main>

<!-- papaparse -->