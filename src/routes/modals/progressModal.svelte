<script>
    import { progressBarModal, progress, progressBarFinished, progressModal } from './messageModal.js'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
  
    function close() {
        progressBarFinished.set(false)
        progressModal.set(false)
        dispatch('closeCSV')
    }

</script>

{#if $progressModal}
    
        <div class="fixed flex justify-center z-50 w-full top top-1/4 mt-3">
            <div class="bg-white border border-primary rounded-md w-8/12 md:w-6/12 shadow-gray-400 shadow-md ">

                <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
                    {#if $progressBarModal}
                        <h1 class="font-bold text-gray-600 text-xl">Loading...</h1>
                    {:else if $progressBarFinished}
                        <h1 class="font-bold text-gray-600 text-xl">Upload Successful</h1>
                    {/if}
                </div>

                {#if $progressBarModal}
                    <p class="mx-8 my-16">Please wait while the file is being processed.</p>
                {:else if $progressBarFinished}
                    <p class="mx-8 my-16">Your file has been uploaded Sucessfully!</p>
                {/if}

                

                <!-- <p>Progress so far: {$progress}%</p> -->

                {#if $progressBarModal}
                    <div class="flex justify-center bg-gray-100 rounded-b-md py-4 px-2">
                        <div class="progressBar w-full border border-black rounded-full bg-white">
                            <div class="w-{$progress} progress bg-primary transition-all duration-1000 rounded-full"></div>
                        </div>
                    </div>
                {:else if $progressBarFinished}
                    <div class="flex justify-center bg-gray-100 rounded-b-md py-4">
                        <button on:click={close} class="py-2 px-6 border border-primary text-primary rounded-md hover:text-white hover:bg-primary">Close</button>
                    </div>
                {/if}

                
            </div>
        </div>
{/if}

<style>
    .progressBar {
        height: 1rem;
    }
    .progress {
        height: .9rem;
    }
</style>