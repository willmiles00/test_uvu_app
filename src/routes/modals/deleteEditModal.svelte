<script>
    import { createEventDispatcher } from 'svelte'
    import { editDeleteTitle, editDeleteDescription, dataToEditOrDelete } from './messageModal.js'
    import {dataStore} from '../mongodbData.js'
    let dispatch = createEventDispatcher()

    function closeModal() {
        dispatch('closeEditDeleteModal')
    }

    async function initiateResponse() {
        
        const response = await fetch('../edit/changeEvents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify($dataToEditOrDelete)
        })
        let data = await response.json()
    
        dataStore.set(data) /* ----------- this needs to be turned off when editing so it doesn't cause errors in other places */

        dispatch('closeAndMakeUpdate')
    }
</script>

<div class="bg-white border border-gray-300 rounded-md w-6/12 m-4 shadow-gray-400 shadow-md border-l-8 border-l-primary">
    <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
        <i class="fa-solid fa-circle-exclamation text-primary text-xl mr-4"></i>
        <h1 class="font-bold text-primary text-xl font-raj">{$editDeleteTitle}</h1>
    </div>

    <p class="mx-8 my-8 text-black">{$editDeleteDescription}</p>

    <div class="flex justify-center bg-gray-100 rounded-b-md py-4 gap-4">
        <button on:click={initiateResponse} class="py-2 px-6 text-white bg-primary rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Submit</button>
        <button on:click={closeModal} class="py-2 px-6 bg-third text-primary rounded-md hover:bg-primary hover:text-white uppercase font-raj font-semibold">Cancel</button>
    </div>
</div>