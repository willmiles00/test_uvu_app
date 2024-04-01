<script>
    import { createEventDispatcher } from 'svelte'
    import {dataStore} from '../mongodbData.js'
    const dispatch = createEventDispatcher()

    function closeModal() {
        dispatch('closeEditModal')
    }

    let classListOpen = false
    let classSelected = ""
    let rotateClassChevron = ""
    let editClassName = null

     // removes duplicate names from the professor select elements
     $: onlyOneClass = [...new Set($dataStore.map(item => item.className))]

     // sort the onlyOneProfessor array into alphabetical order
     $: classList = onlyOneClass.sort((a, b) => a.localeCompare(b))

    function openClassesList() {
        classListOpen = !classListOpen
        if (classListOpen) {
            classSelected = "shadow-sm"
            rotateClassChevron = "transform rotate-180 transition-transform duration-300 ease-in-out"
        } else if (!classListOpen) {
            classSelected = ""
            rotateClassChevron = "transform rotate-0 transition-transform duration-300 ease-in-out"
        }
    }

    function changeClassNameInDatabase() {
        console.log('changeClassNameInDatabase')
    }

</script>

<div class="w-full h-full flex items-center justify-center">
    <div class=" border border-primary bg-white rounded-md shadow-md shadow-gray-400 h-4/6 w-5/6 p-4">
        <div class="w-full flex justify-end">
            <button on:click={closeModal} class="fa-solid fa-circle-xmark text-xl text-primary hover:text-opacity-70"></button>
        </div>
        <h1 class="text-4xl bg-white text-center text-primary">Edit Events</h1>

        <div>
            <label for="course" class="mb-1 text-primary">Edit Class:</label>
            <button on:click={openClassesList} class="w-full border-b-4 border border-gray-300 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-b-primary text-primary flex justify-between items-center {classSelected}">
                <p>Select a Class</p>
                <i class="fa-solid fa-chevron-down {rotateClassChevron}"></i>
            </button>
            {#if classListOpen}
                <ul class="h-28 overflow-y-scroll bg-white shadow-md py-4 rounded-md mt-2 border border-gray-200">
                    {#each classList as classes, index}
                        {#if editClassName !== index}
                            <div class="flex justify-between items-center hover:bg-primary hover:bg-opacity-20 py-2 px-4">
                                <li>{classes}</li>
                                <button on:click={() => (editClassName = index)} class="py-1 px-4 bg-primary text-white rounded-md">Edit</button>
                            </div>
                        {/if}
                        {#if editClassName === index}
                            <div class="flex justify-between items-center hover:bg-primary hover:bg-opacity-20 py-2 px-4">
                                <input type="text" value={classList[index]} class="border-none bg-inherit bg-opacity-5">
                                <button on:click={changeClassNameInDatabase} class="py-1 px-4 bg-primary text-white rounded-md">Submit</button>
                                <button on:click={() => (editClassName = null)} class="py-1 px-4 bg-primary text-white rounded-md">Cancel</button>
                            </div>
                        {/if}
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
    
</div>