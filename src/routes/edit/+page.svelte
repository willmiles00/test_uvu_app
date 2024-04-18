<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import {dataStore} from '../mongodbData.js'
    import DeleteEditModal from '../modals/deleteEditModal.svelte'
    import { editDeleteTitle, editDeleteDescription, dataToEditOrDelete } from '../modals/messageModal.js'
    import { writable } from 'svelte/store'
    const dispatch = createEventDispatcher()
    export const editDeleteData = writable([])

    // console.log($dataStore)

    let openModal = false
    let filteredEvents
    // this reactive statement filters out duplicates based on the instructor, course, building room, and class name
    $: filteredEvents = $dataStore && Array.isArray($dataStore) ? $dataStore.filter((event, index, self) => {
        const eventKey = `${event.className}-${event.instructor}-${event.course}-${event.extendedProps.building_room}`;
        const isUnique = index === self.findIndex(e => `${e.className}-${e.instructor}-${e.course}-${e.extendedProps.building_room}` === eventKey);
        return isUnique;
    }) : [];

    let classNameIndex: any[] = []
    let switchToEditClassName = null
    let tempClassName

    let instructorIndex: any[] = []
    let switchToEditInstructor = null
    let tempInstructor

    let courseIndex: any[] = []
    let switchToEditCourse = null
    let tempCourse

    let buildingRoomIndex: any[] = []
    let switchToEditRoom = null
    let tempRoom

    let deleteIndex = []

    // // display all the events in the database in the modal and allows us to make changes to show the changes without a rerender
    // $: currentEvents = $dataStore

    // sends to the parent component to close the whole modal we are in
    function closeModal() {
        dispatch('closeEditModal')
    }

    // closes the modal for notifications of actions
    function closeEditDeleteModal() {
        openModal = false
        // THESE ARE OPTIONAL, IF THE USER CANCELS THEIR ACTION TO SAVE CHANGES THEN THESE WILL CANCEL THEIR EDIT ALL TOGETHER, WITHOUT THEM YOU WILL GO BACK TO CHANGING THE INPUT (IT LOOKS BETTER WITHOUT THEM)
        // switchToEditClassName = null
        // switchToEditInstructor = null
        // switchToEditCourse = null  
        // switchToEditRoom = null
    }

    // closes the notifications modal AFTER you hit submit
    function closeAndMakeUpdate() {
        switchToEditClassName = null
        switchToEditInstructor = null
        switchToEditCourse = null
        switchToEditRoom = null
        openModal = false
    }

    //----------------- class name functions
    function cancelClassNameChange() {
        switchToEditClassName = null
    }

    function classNameToChange(oldName) {
        
        editDeleteTitle.set("Your Changing The Class Name")
        editDeleteDescription.set(`Are you sure you want to change "${oldName}" ?`)
        openModal = true
        dataToEditOrDelete.set({type: 'className', oldName: oldName, newName: tempClassName})
    }

    // ----------------- instructor functions
    function instructorToChange(oldInstructorName) {
        
        editDeleteTitle.set("Your Changing The Instructor's Name")
        editDeleteDescription.set(`Are you sure you want to change "${oldInstructorName}" ?`)
        openModal = true
        dataToEditOrDelete.set({type: 'instructor', oldName: oldInstructorName, newName: tempInstructor})
    }

    function cancelInstructorChange() {
        switchToEditInstructor = null
    }

    //-------------- course functions
    function courseToChange(oldCourseName) {
        
        editDeleteTitle.set("Your Changing The Course Name")
        editDeleteDescription.set(`Are you sure you want to change "${oldCourseName}" ?`)
        openModal = true
        dataToEditOrDelete.set({type: 'course', oldName: oldCourseName, newName: tempCourse})
    }

    function cancelCourseChange() {
        switchToEditCourse = null
    }

    //-------------- room number functions
     function roomToChange(oldRoomName) {
        
        editDeleteTitle.set("Your Changing The Room Name")
        editDeleteDescription.set(`Are you sure you want to change "${oldRoomName}" ?`)
        openModal = true
        dataToEditOrDelete.set({type: 'room', oldName: oldRoomName, newName: tempRoom})
    }

    function cancelRoomChange() {
        switchToEditRoom = null
    }

    function removeEvent(event) {
        editDeleteTitle.set("Your Deleting an Event")
        editDeleteDescription.set(`Are you sure you want to delete this Event?`)
        openModal = true
        dataToEditOrDelete.set({type: 'delete', event: event})
    }

</script>

<div class="w-full h-full flex items-center justify-center">

    <div class="relative border border-gray-300 bg-white rounded-md shadow-md shadow-gray-400 h-5/6 w-4/6">
        {#if openModal}
            <div class="absolute z-10 w-full h-full flex justify-center items-center">
                <DeleteEditModal on:closeEditDeleteModal={closeEditDeleteModal} on:closeAndMakeUpdate={closeAndMakeUpdate}/>
            </div>
        {/if}

        <div class="h-1/6">
            <div class="relative bg-secondary rounded-t-md">
                <div class="absolute z-10 right-4 w-full h-full flex justify-end items-center">
                    <button on:click={closeModal} class="fa-solid fa-circle-xmark text-xl text-third hover:text-white"></button>
                </div>
                <div class="h-full flex items-center justify-center py-4">
                    <h1 class="text-4xl text-white text-center font-raj">Edit Events</h1>
                </div>
            </div>
            <!-- <div class="flex justify-center">
                <i class="fa-solid fa-pen-to-square text-2xl text-primary bg-white px-4"><i/>
            </div> -->
        </div>

        <div class="h-5/6 overflow-y-scroll">
            {#if filteredEvents.length === 0}
                <div class="h-full w-full flex justify-center items-center">
                    <p class="text-center text-lg text-gray-500">There are no events currently in the scheduler</p>
                </div>
            {:else}
                {#each filteredEvents as event, index}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="flex justify-center">
                        <div class="w-11/12 relative border-2 border-l-8 border-l-primary border-gray-200 px-4 py-1 mb-4 shadow-md rounded-md mx-2" on:mouseenter={() => deleteIndex[index] = true} on:mouseleave={() => deleteIndex[index] = false}>
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="flex" on:mouseenter={() => classNameIndex[index] = true} on:mouseleave={() => classNameIndex[index] = false}>
                                {#if switchToEditClassName !== index}
                                    <p class="text-lg font-semibold text-black">{event.className}</p>
                                    <button on:click={() => {switchToEditClassName = index; tempClassName = event.className }} class="{classNameIndex[index] ? "block" : "hidden"} fa-solid fa-pencil text-primary text-lg hover:text-opacity-70 ml-8"></button>
                                {/if}
                                {#if switchToEditClassName === index}
                                    <input type="text" bind:value={tempClassName} class="border-b border-l-0 border-r-0 border-t-0 border-primary text-primary focus:ring-0 focus:outline-none p-0 text-lg mr-4 focus:border-primary" >
    
                                    <button on:click={classNameToChange(event.className)} class="{classNameIndex[index] ? "block" : "hidden"} fa-solid fa-check text-primary text-lg hover:text-opacity-70  ml-4"></button>
    
                                    <button on:click={cancelClassNameChange} class="{classNameIndex[index] ? "block" : "hidden"} fa-solid fa-ban text-primary text-lg hover:text-opacity-70  ml-4"></button>
                                {/if}
                            </div>
    
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="flex gap-4" on:mouseenter={() => instructorIndex[index] = true} on:mouseleave={() => instructorIndex[index] = false}>
                                {#if switchToEditInstructor !== index}
                                    <p class="text-lg font-medium">{event.instructor}</p>
                                    <button on:click={() => {switchToEditInstructor = index; tempInstructor = event.instructor }} class="{instructorIndex[index] ? "block" : "hidden"} fa-solid fa-pencil text-primary text-lg hover:text-opacity-70 ml-8"></button>
                                {/if}
                                {#if switchToEditInstructor === index}
                                    <input type="text" bind:value={tempInstructor} class="border-b border-l-0 border-r-0 border-t-0 border-primary text-primary focus:ring-0 focus:outline-none p-0 text-lg mr-0 focus:border-primary" >
    
                                    <button on:click={instructorToChange(event.instructor)} class="{instructorIndex[index] ? "block" : "hidden"} fa-solid fa-check text-primary text-lg hover:text-opacity-70  ml-4"></button>
    
                                    <button on:click={cancelInstructorChange} class="{instructorIndex[index] ? "block" : "hidden"} fa-solid fa-ban text-primary text-lg hover:text-opacity-70"></button>
                                {/if}
                            </div>
    
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="flex gap-4" on:mouseenter={() => courseIndex[index] = true} on:mouseleave={() => courseIndex[index] = false}>
                                {#if switchToEditCourse !== index}
                                    <p class="text-lg text-gray-600">{event.course}</p>
                                    <button on:click={() => {switchToEditCourse = index; tempCourse = event.course }} class="{courseIndex[index] ? "block" : "hidden"} fa-solid fa-pencil text-primary text-lg hover:text-opacity-70 ml-8"></button>
                                {/if}
                                {#if switchToEditCourse === index}
                                    <input type="text" bind:value={tempCourse} class="border-b border-l-0 border-r-0 border-t-0 border-primary text-primary focus:ring-0 focus:outline-none p-0 text-lg mr-0 focus:border-primary" >
    
                                    <button on:click={courseToChange(event.course)} class="{courseIndex[index] ? "block" : "hidden"} fa-solid fa-check text-primary text-lg hover:text-opacity-70  ml-4"></button>
    
                                    <button on:click={cancelCourseChange} class="{courseIndex[index] ? "block" : "hidden"} fa-solid fa-ban text-primary text-lg hover:text-opacity-70"></button>
                                {/if}
                            </div>
    
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="flex gap-4" on:mouseenter={() => buildingRoomIndex[index] = true} on:mouseleave={() => buildingRoomIndex[index] = false}>
                                {#if switchToEditRoom !== index}
                                    <p class="text-lg text-gray-600">{event.extendedProps?.building_room}</p>
                                    <button on:click={() => {switchToEditRoom = index; tempRoom = event.extendedProps?.building_room }} class="{buildingRoomIndex[index] ? "block" : "hidden"} fa-solid fa-pencil text-primary text-lg hover:text-opacity-70 ml-8"></button>
                                {/if}
                                {#if switchToEditRoom === index}
                                    <input type="text" bind:value={tempRoom} class="border-b border-l-0 border-r-0 border-t-0 border-primary text-primary focus:ring-0 focus:outline-none p-0 text-lg mr-0 focus:border-primary" >
    
                                    <button on:click={roomToChange(event.extendedProps.building_room)} class="{buildingRoomIndex[index] ? "block" : "hidden"} fa-solid fa-check text-primary text-lg hover:text-opacity-70  ml-4"></button>
    
                                    <button on:click={cancelRoomChange} class="{buildingRoomIndex[index] ? "block" : "hidden"} fa-solid fa-ban text-primary text-lg hover:text-opacity-70"></button>
                                {/if}
                            </div>
                            
                            <button on:click={removeEvent(event)} class="{deleteIndex[index] ? "w-1/12" : "w-0"} w-0 transition-all duration-300 absolute z-10 top-0 right-0 h-full bg-primary flex justify-center items-center rounded-r-md">
                                <i class="{deleteIndex[index] ? "block" : "hidden"} fa-solid fa-trash text-white text-xl"></i>
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
    
</div>