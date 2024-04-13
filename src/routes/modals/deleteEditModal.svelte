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

<div class="bg-white border border-primary rounded-md w-6/12 m-4 shadow-gray-400 shadow-md">
    <div class="flex justify-start py-6 border-b border-gray-300 mx-8">
        <h1 class="font-bold text-gray-600 text-xl">{$editDeleteTitle}</h1>
    </div>

    <p class="mx-8 my-16 text-black">{$editDeleteDescription}</p>

    <div class="flex justify-center bg-gray-100 rounded-b-md py-4 gap-4">
        <button on:click={initiateResponse} class="py-2 px-6 border border-primary text-white bg-primary rounded-md hover:text-primary hover:bg-inherit">Submit</button>
        <button on:click={closeModal} class="py-2 px-6 border border-primary text-primary rounded-md hover:text-white hover:bg-primary">Cancel</button>
    </div>
</div>