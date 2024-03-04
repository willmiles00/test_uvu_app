<script>
    import { deleteProgressBarModal, deleteProgress, deleteProgressBarFinished, deleteProgressModal } from './messageModal.js'
  
    function close() {
        deleteProgressBarFinished.set(false)
        deleteProgressModal.set(false)
    }

</script>

{#if $deleteProgressModal}
    
        <div class="fixed flex justify-center z-50 w-full">
            <div class="bg-white border border-primary rounded-md  shadow-gray-400 shadow-md w-8/12 md:w-6/12">

                <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
                    {#if $deleteProgressBarModal}
                        <h1 class="font-bold text-gray-600 text-xl">Deleting Schedules...</h1>
                    {:else if $deleteProgressBarFinished}
                        <h1 class="font-bold text-gray-600 text-xl">Schedules Deleted</h1>
                    {/if}
                </div>

                {#if $deleteProgressBarModal}
                    <p class="mx-8 my-16">Please wait while the Schedules are being removed.</p>
                {:else if $deleteProgressBarFinished}
                    <p class="mx-8 my-16">Your schedules have been removed Sucessfully!</p>
                {/if}

                

                <!-- <p>Progress so far: {$progress}%</p> -->

                {#if $deleteProgressBarModal}
                    <div class="flex justify-center bg-gray-100 rounded-b-md py-4 px-2">
                        <div class="progressBar w-full border border-black rounded-full bg-white">
                            <div class="w-{$deleteProgress} progress bg-primary transition-all duration-1000 rounded-full"></div>
                        </div>
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
    .progressBar {
        height: 1rem;
    }
    .progress {
        height: .9rem;
    }
</style>