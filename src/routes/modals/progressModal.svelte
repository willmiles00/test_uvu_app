<script>
    import { progressBarModal, progress, progressBarFinished, progressModal } from './messageModal.js'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
  
    function close() {
        progressBarFinished.set(false)
        progressModal.set(false)
        dispatch('closeCSV')
        location.reload()
    }

</script>

{#if $progressModal}
    
    <div class="h-full w-full fixed flex justify-center items-center z-50">
        <div class="w-full flex justify-center ">
            <div class="bg-white border border-gray-300 rounded-md w-7/12 md:w-6/12 lg:w-5/12 shadow-gray-400 shadow-md ">
    
                <div class="flex justify-start py-4 border-b border-gray-300 mx-4 gap-4 items-center">
                    {#if $progressBarModal}
                        <i class="fa-solid fa-arrow-rotate-right fa-spin text-primary text-xl"></i>
                        <h1 class="font-bold text-primary text-xl font-raj ">Loading...</h1>
                    {:else if $progressBarFinished}
                        <h1 class="font-bold text-primary text-xl font-raj">Upload Successful</h1>
                    {/if}
                </div>
    
                {#if $progressBarModal}
                    <p class="m-4 text-black">Please wait while the file is being processed.</p>
                {:else if $progressBarFinished}
                    <p class="m-4 text-black">Your file has been uploaded Sucessfully!</p>
                {/if}
    
    
    
                {#if $progressBarModal}
                    <div class="flex justify-center bg-gray-100 rounded-b-md p-4">
                        <!-- <div class="progressBar w-full border border-black rounded-full bg-white"> -->
                        <div class="w-full">
                            <!-- <div class="w-{$progress} progress bg-primary transition-all duration-1000 rounded-full"></div> -->
                            <progress value={$progress} class=" h-[12px] rounded-full progress-bar bg-white border border-gray-200"/>
                        </div>
                    </div>
                {:else if $progressBarFinished}
                    <div class="flex justify-start bg-gray-100 rounded-b-md py-2 pl-4">
                        <button on:click={close} class="py-2 px-6 bg-primary text-white rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Close</button>
                    </div>
                {/if}
    
                
            </div>
        </div>
    </div>
{/if}

<style>
    .progress-bar::-webkit-progress-bar {
      @apply bg-white;
    }
    
    .progress-bar::-webkit-progress-value {
      @apply bg-primary;
    }
    
    .progress-bar::-moz-progress-bar {
      @apply bg-primary;
    }
    </style>