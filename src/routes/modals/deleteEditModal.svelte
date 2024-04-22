<script>
    import { createEventDispatcher } from 'svelte'
    import { editDeleteTitle, editDeleteDescription, dataToEditOrDelete, editDeleteWarning } from './messageModal.js'
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

<div class="w-full flex justify-center">
    {#if $editDeleteWarning}
        <div class="bg-white border border-gray-300 rounded-md w-9/12 md:w-8/12 lg:w-7/12 m-4 shadow-gray-400 shadow-md border-l-8 border-l-red-600">
            <div class="flex justify-start py-4 border-b border-gray-300 mx-4 items-center">
                <i class="fa-solid fa-triangle-exclamation text-red-600 text-xl mr-4"></i>
                <h1 class="font-bold text-red-600 text-xl font-raj">{$editDeleteTitle}</h1>
            </div>

            <p class="m-4 text-black">{$editDeleteDescription}</p>

            <div class="flex justify-start bg-gray-100 rounded-b-md py-2 gap-4 pl-4">
                <button on:click={initiateResponse} class="py-2 px-6 text-white bg-primary rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Submit</button>
                <button on:click={closeModal} class="py-2 px-6 bg-third text-primary rounded-md hover:bg-primary hover:text-white uppercase font-raj font-semibold">Cancel</button>
            </div>
        </div>
    {:else} 
        <div class="bg-white border border-gray-300 rounded-md w-9/12 md:w-8/12 lg:w-7/12 m-4 shadow-gray-400 shadow-md border-l-8 border-l-primary">
            <div class="flex justify-start py-4 border-b border-gray-300 mx-4 items-center">
                <i class="fa-solid fa-circle-exclamation text-primary text-xl mr-4"></i>
                <h1 class="font-bold text-primary text-xl font-raj">{$editDeleteTitle}</h1>
            </div>

            <p class="m-4 text-black">{$editDeleteDescription}</p>

            <div class="flex justify-start bg-gray-100 rounded-b-md py-2 gap-4 pl-4">
                <button on:click={initiateResponse} class="py-2 px-6 text-white bg-primary rounded-md hover:bg-primaryDark uppercase font-raj font-semibold">Submit</button>
                <button on:click={closeModal} class="py-2 px-6 bg-third text-primary rounded-md hover:bg-primary hover:text-white uppercase font-raj font-semibold">Cancel</button>
            </div>
        </div>
    {/if}
</div>

<!--  w-9/12 md:w-8/12 lg:w-7/12 -->