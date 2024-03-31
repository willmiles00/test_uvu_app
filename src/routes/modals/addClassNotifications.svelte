<script>
    import { createEventDispatcher } from 'svelte'
    import { notificationsTitle, notificationsDescription } from './messageModal.js'
    let dispatch = createEventDispatcher()

    function closeModal() {
        dispatch('closeNotificationsModal')
    }
</script>

<div class="bg-white border border-primary rounded-md w-6/12 m-4 shadow-gray-400 shadow-md">
    <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
        <h1 class="font-bold text-gray-600 text-xl">{$notificationsTitle}</h1>
    </div>

    <p class="mx-8 my-16 text-black">{$notificationsDescription}</p>

    <div class="flex justify-center bg-gray-100 rounded-b-md py-4">
        <button on:click={closeModal} class="py-2 px-6 border border-primary text-primary rounded-md hover:text-white hover:bg-primary">Close</button>
    </div>
</div>