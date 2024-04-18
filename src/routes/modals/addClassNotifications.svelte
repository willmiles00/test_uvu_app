<script>
    import { createEventDispatcher } from 'svelte'
    import { notificationsTitle, notificationsDescription, notificationsWarning } from './messageModal.js'
    let dispatch = createEventDispatcher()

    function closeModal() {
        dispatch('closeNotificationsModal')
    }
</script>

{#if $notificationsWarning}
    <div class="border-l-8 border-l-primary bg-white border border-gray-300 rounded-md w-6/12 m-4 shadow-gray-400 shadow-md">
        <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
            <i class="fa-solid fa-circle-exclamation text-primary text-xl mr-4"></i>
            <h1 class="font-bold text-primary text-xl font-raj ">{$notificationsTitle}</h1>
        </div>

        <p class="mx-8 my-8 text-black">{$notificationsDescription}</p>

        <div class="flex justify-center bg-gray-100 rounded-b-md py-4">
            <button on:click={closeModal} class="py-2 px-6 bg-primary text-white rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Close</button>
        </div>
    </div>
{:else}
    <div class="bg-white border border-gray-300 rounded-md w-6/12 m-4 shadow-gray-400 shadow-md">
        <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
            <h1 class="font-bold text-primary text-xl font-raj ">{$notificationsTitle}</h1>
        </div>

        <p class="mx-8 my-8 text-black">{$notificationsDescription}</p>

        <div class="flex justify-center bg-gray-100 rounded-b-md py-4">
            <button on:click={closeModal} class="py-2 px-6 bg-primary text-white rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Close</button>
        </div>
    </div>
{/if}