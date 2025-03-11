<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	// Props
	export let isOpen = false;
	
	// Event dispatcher
	const dispatch = createEventDispatcher();
	
	// Variables
	let file: any;
	let fileName = 'No file chosen';
	
	// Handle file selection
	function handleFileChange(event: any) {
	  file = event.target.files[0];
	  if (file) {
		fileName = file.name;
	  } else {
		fileName = 'No file chosen';
	  }
	}
	
	// Handle modal close
	function close() {
	  dispatch('close');
	}
	
	// Handle form submission
	function submitForm() {
	  if (file) {
		dispatch('submit', { file });
	  } else {
		console.log('No file chosen');
	  }
	}
  </script>
  
  {#if isOpen}
	<div
	  class="bg-black bg-opacity-50 w-full h-fit fixed top-0 left-0 min-h-full flex justify-center z-40"
	>
	  <div class="relative">
		<div
		  class="flex flex-wrap bg-white m-10 rounded-[8px] w-fit md:min-w-[486px] max-w-[486px] h-fit max-h-[600px] overflow-auto shadow-xl custom-scrollbar upload-modal min-h-[226px] "
		>
		  <p
			class="w-full text-white uppercase bg-[#00843D] text-[24px] flex items-center px-[24px] py-[12px] font-primary-semibold h-[55px]"
		  >
			Import .CSV
		  </p>
		  <form class="w-full" on:submit|preventDefault={submitForm}>
			<div class="flex flex-wrap justify-center items-center">
			  <label
				for="file-upload"
				class="custom-file-upload flex flex-wrap justify-start items-center mt-2 w-[438px] rounded-[8px]"
			  >

				<p
				  class="flex flex-wrap justify-center items-center btn bg-[#275D38] text-white p-2 uppercase text-[16px] font-semibold rounded-tl-[8px] rounded-bl-[8px] rounded-tr-none rounded-br-none  font-roboto relative"
				>
				  Choose File
				</p>
				<div class="absolute top-[119px] left-[64px] mt-2 w-[438px] border-[#DDDDDD] border rounded-[8px] h-[43px]">
				  {#if fileName === 'No file chosen'}
					<p
					  class="text-[#DDDDDD] p-2 pl-[140px]"
					>
					  {fileName}
					</p>
				  {:else}
					<p class="p-2 pl-[140px]">
					  {fileName}
					</p>
				  {/if}
				</div>
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
			<div class="flex m-2 justify-end mr-6 mt-[24px]">
			  <button
				class="bg-[#DDDDDD] p-2 rounded-md flex flex-col justify-center items-center text-uvu-green mr-2 uppercase text-sm font-rajdhani h-[40px] font-semibold w-[92px]"
				type="button"
				on:click={close}>Cancel</button
			  >
			  <button
				class="bg-uvu-green p-2 rounded-md flex flex-col justify-center items-center text-white uppercase text-sm font-rajdhani h-[40px] w-[122px] font-semibold"
				type="submit">Upload .CSV</button
			  >
			</div>
		  </form>
		</div>
	  </div>
	</div>
  {/if}
  
  <style lang="postcss">
	input[type='file'] {
	  display: none;
	}
  
	.upload-modal {
	  overflow: scroll !important;
	  overflow-y: scroll;
	}

	.font-roboto {
	  font-family: 'Roboto', sans-serif;
	}
  </style>