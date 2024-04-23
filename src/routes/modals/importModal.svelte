<script>
    import { messageModal, titleModal, showImportModal } from './messageModal.js'

    function closeModal() {
        showImportModal.set(false)
    }
  
</script>


{#if $showImportModal}
    <div class="fixed flex justify-center items-center z-50 w-full h-full">
        <div class="w-full flex justify-center">
            <div class="bg-white border border-gray-300 rounded-md shadow-gray-400 shadow-md w-7/12 md:w-6/12 lg:w-5/12 border-l-8 border-l-primary">
                <div class="flex justify-start py-4 border-b border-gray-300 mx-4 gap-4 items-center">
                    <i class="fa-solid fa-circle-exclamation text-primary text-xl"></i>
                    <h1 class="font-bold text-primary font-raj text-xl">{$titleModal}</h1>
                    <!-- <h1 class="font-bold text-primary font-raj text-xl">No File Selected</h1> -->
                </div>
    
                <p class="mx-4 my-6">{$messageModal}</p>
                <!-- <p class="mx-8 my-8">No file was detected at import. Please try again.</p> -->
    
                <div class="flex justify-start bg-gray-100 rounded-b-md py-2 pl-4">
                    <button on:click={closeModal} class="py-2 px-6 bg-primary text-white rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Close</button>
                </div>
            </div>
        </div>
    </div>
{/if}