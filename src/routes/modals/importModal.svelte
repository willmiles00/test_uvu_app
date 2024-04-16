<script>
    import { messageModal, titleModal, showImportModal } from './messageModal.js'

    function closeModal() {
        showImportModal.set(false)
    }
  
</script>


{#if $showImportModal}
    <div class="fixed flex justify-center z-50 w-full top-1/4 mt-3">
        <div class="bg-white border border-primary rounded-md shadow-gray-400 shadow-md w-8/12 md:w-6/12">
            <div class="flex justify-start py-4 border-b border-gray-300 mx-8">
                <h1 class="font-bold text-primary font-raj text-xl">{$titleModal}</h1>
            </div>

            <p class="mx-8 my-16">{$messageModal}</p>

            <div class="flex justify-center bg-gray-100 rounded-b-md py-4">
                <button on:click={closeModal} class="py-2 px-6 bg-primary font-semibold text-white rounded-md hover:bg-primaryDark uppercase font-raj">Close</button>
            </div>
        </div>
    </div>
{/if}