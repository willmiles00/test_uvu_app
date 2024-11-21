<script lang="ts">
	// imports
	import CalendarView from "$lib/components/CalendarView.svelte";
	import AddEvent from "$lib/components/modals/AddEvent.svelte";
	import { addEventModalActive } from "$lib/stores/modals";
	import Papa from 'papaparse';
	
	// modal setters
	$addEventModalActive = false;

	let	handleAddEventModal = () => {
		$addEventModalActive = true;
	}

	import { onMount } from 'svelte';

  let fileInput: any;

  onMount(() => {
    fileInput.addEventListener('change', handleFileChange);
  });

  function handleFileChange(event: { target: { files: any[]; }; }) {
	console.log(event.target.files[0]);
    const file = event.target.files[0];
	if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const csvData = reader.result;
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
	
	<CalendarView />
</main>

<!-- papaparse -->