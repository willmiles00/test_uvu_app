<script>
    import { deleteProgressBarModal, deleteProgress, deleteProgressBarFinished, deleteProgressModal } from './messageModal.js'
  
    function close() {
        deleteProgressBarFinished.set(false)
        deleteProgressModal.set(false)
        location.reload()
    }

</script>

{#if $deleteProgressModal}
    
        <div class="fixed z-30 w-full h-full flex justify-center items-center">
            <div class="bg-white border border-primary rounded-md  shadow-gray-400 shadow-md w-8/12 md:w-6/12">

                <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
                    {#if $deleteProgressBarModal}
                        <h1 class="font-bold text-gray-600 text-xl">Deleting Schedules...</h1>
                    {:else if $deleteProgressBarFinished}
                        <h1 class="font-bold text-gray-600 text-xl">Schedules Deleted</h1>
                    {/if}
                </div>

                {#if $deleteProgressBarModal}
                    <p class="mx-8 my-16 text-black">Please wait while the schedules are being removed.</p>
                {:else if $deleteProgressBarFinished}
                    <p class="mx-8 my-16 text-black">Your schedules have been removed Sucessfully!</p>
                {/if}

                

                <!-- <p>Progress so far: {$progress}%</p> -->

                {#if $deleteProgressBarModal}
                    <div class="flex justify-center bg-gray-100 rounded-b-md py-4 px-2">
                        <!-- <div class="progressBar w-full border border-black rounded-full bg-white">
                            <div class="w-{$deleteProgress} progress bg-primary transition-all duration-1000 rounded-full"></div>
                        </div> -->
                        <progress class=" h-[12px] rounded-full bg-red-800 progress-bar bg-white border border-gray-200" value={$deleteProgress}></progress>
                    </div>
                {:else if $deleteProgressBarFinished}
                    <div class="flex justify-center bg-gray-100 rounded-b-md py-4">
                        <button on:click={close} class="py-2 px-6 border border-primary text-primary rounded-md hover:text-white hover:bg-primary">Close</button>
                    </div>
                {/if}

                
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