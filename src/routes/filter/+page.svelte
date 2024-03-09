<script lang="ts">
    // export let data: any
    // $: console.log(data?.body?.fileName) 

    import {dataStore} from '../mongodbData.js'

    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition'
    const dispatch = createEventDispatcher()
    import Message from '../../routes/modals/modal.svelte'
    import { showModal, messageModal, titleModal, showOneOption, showTwoOptions, file } from '../modals/messageModal.js'
    import DeleteProgressModal from '../modals/deleteprogressModal.svelte'


    let tempEventList
    // let message = ""
    let searchProfessor = ""
    let searchRoom = ""
    let searchCourse = ""
    let selectedProfessors = []
    let selectedRooms = []
    let selectedCourses = []
    let openProfessorList = false
    let openRoomList = false
    let openCourseList = false

    

    // -------------------------------------------- PROFESSOR FUNCTIONS ---------------------------------------------------
    // Open and closes the professor list
    function toggleProfessorList() {
    openProfessorList = !openProfessorList
        if (openProfessorList) {
            searchProfessor = ""
        }
    }


    // removes duplicate names from the professor select elements
    $: onlyOneProfessor = [...new Set($dataStore.map(item => item.instructor))]

    // sort the onlyOneProfessor array into alphabetical order
    $: professorList = onlyOneProfessor.sort((a, b) => a.localeCompare(b))


    // allows the user to select the whole row when clicking on the name for each checkbox
    function toggleProfessor(professor) {
        if (selectedProfessors.includes(professor)) {
        selectedProfessors = selectedProfessors.filter((selected) => selected !== professor);
        } else {
        selectedProfessors = [...selectedProfessors, professor];
        }
    }

    // filters the NEW professor list based on the search input
    $: filteredProfessors = professorList.filter((professor) => {
        return professor.toLowerCase().includes(searchProfessor.toLowerCase())
    })


    // -------------------------------------------- ROOM FUNCTIONS ---------------------------------------------------
    // opens and closes the room list
    function toggleRoomsList() {
        openRoomList = !openRoomList

        if (openRoomList) {
            searchRoom = ""
        }
    }


    // removes duplicate names from the rooms select elements
    $: onlyOneRoom = [...new Set($dataStore.map(item => item.extendedProps.building_room))]

    // sort the onlyOneRoom array into alphabetical order
    $: roomList = onlyOneRoom.sort((a, b) => a.localeCompare(b))


    // allows the user to select the whole row when clicking on the name for each checkbox
    function toggleRoom(room) {
        if (selectedRooms.includes(room)) {
        selectedRooms = selectedRooms.filter((selected) => selected !== room);
        } else {
        selectedRooms = [...selectedRooms, room];
        }
    }

    // filters the NEW room list based on the search input
    $: filteredRooms = roomList.filter((room) => {
        return room.toLowerCase().includes(searchRoom.toLowerCase())
    })


    // // -------------------------------------------- COURSE FUNCTIONS ---------------------------------------------------
    // opens and closes the course list
    function toggleCourseList() {
        openCourseList = !openCourseList

        if (openCourseList) {
            searchCourse = ""
        }
    }
    

    // removes duplicate names from the course select elements
    $: onlyOneCourse = [...new Set($dataStore.map(item => item.course))]

    // sort the onlyOneCourse array into alphabetical order
    $: courseList = onlyOneCourse.sort((a, b) => a.localeCompare(b))


    // allows the user to select the whole row when clicking on the name for each checkbox
    function toggleCourse(course) {
        if (selectedCourses.includes(course)) {
        selectedCourses = selectedCourses.filter((selected) => selected !== course);
        } else {
        selectedCourses = [...selectedCourses, course];
        }
    }

    // filters the NEW course list based on the search input
    $: filteredCourses = courseList.filter((course) => {
        return course.toLowerCase().includes(searchCourse.toLowerCase())
    })
    
    
    // -------------------------------------------- FILTER DATA FUNCTION THAT WILL SEND THE FINAL FILTERED DATA TO THE SCHEDULER ---------------------------------------------------
    function filterData() {

        let filterListProfessors
        let filterListRooms 
        let filterListCourses

        // This conditioning allows the user to select individual filters without it grabbing all the data for select elements that have not been selected
        // If none of the filters are selected then a modal will popup
        if (selectedProfessors.length === 0 && selectedCourses.length === 0 && selectedRooms.length > 0) {
            filterListRooms = $dataStore.filter((event) => selectedRooms.includes(event.extendedProps.building_room))
        } 
        else if (selectedProfessors.length > 0 && selectedCourses.length === 0 && selectedRooms.length === 0) {
            filterListProfessors = $dataStore.filter((event) => selectedProfessors.includes(event.instructor))
        } 
        else if (selectedProfessors.length === 0 && selectedCourses.length > 0 && selectedRooms.length === 0) {
            filterListCourses = $dataStore.filter((event) => selectedCourses.includes(event.course))
        } 
        else if (selectedProfessors.length === 0 && selectedRooms.length === 0 && selectedCourses.length === 0) {
            showTwoOptions.set(false)
            showOneOption.set(true)
            messageModal.set("Please select at least one filter.")
            titleModal.set("No Filters Selected")
            showModal.set(true)
        } 
        else {
            // if none of those conditions are met then it will filter the data based on the selected filters
            filterListProfessors = $dataStore.filter((event) => selectedProfessors.includes(event.instructor))
            filterListRooms = $dataStore.filter((event) => selectedRooms.includes(event.extendedProps.building_room))
            filterListCourses = $dataStore.filter((event) => selectedCourses.includes(event.course))
        }

        // We then will combine all the arrays into one single array and remove any arrays that are undefined
        let combinedLists = [filterListProfessors, filterListRooms, filterListCourses].filter(Boolean).flat()

        // We then remove any duplicate events from the combinedLists array
        tempEventList = [...new Set(combinedLists.map(item => item))]

        // console.log(tempEventList)

        // the data is then pushed up to the scheduler
        dispatch('filteredData', { filteredData: tempEventList })

        // then we reset the filters and close the lists
        selectedProfessors = []
        selectedRooms = []
        selectedCourses = []
        openProfessorList = false
        openRoomList = false
        openCourseList = false
    }

    function resetFilters() {
        tempEventList = []
        dispatch('filteredData', { filteredData: tempEventList })
    }

    function removeData() {
        showTwoOptions.set(true)
        showOneOption.set(false)
        titleModal.set("You are about to remove all schedules...")
        messageModal.set("Are you sure you want to remove all schedules? This action will delete all data and cannot be undone.")
        showModal.set(true)
    }
</script>

<Message />
<DeleteProgressModal />

<div class="">
    <div class="w-full border border-primary border-l-8 mb-12 rounded-md">
        <p class="text-center text-black py-1 font-bold text-primary">Current File:</p>
        <p class="text-center text-sm py-1 px-4 text-gray-700">{$file.fileName}</p> 
    </div>

    <div class="rounded-lg bg-primary py-4 w-full pl-3 text-white">
        <h1>Filter By...</h1>
    </div>

    <!--------------------------------------------------- Professors List -------------------------------------------------->
    <div class="mt-6">
        {#if !openProfessorList}
            <button on:click={toggleProfessorList} class="flex justify-between py-2 bg-white rounded-md border border-gray-300 w-full">
                <div class="pl-3">Professors</div>
                <i class="fa-solid fa-chevron-down px-3 pt-1 {openProfessorList ? 'rotated' : 'rotateAgain'}"></i>
            </button>
        {:else } 
            <button on:click={toggleProfessorList} class="flex justify-between py-2 bg-white rounded-md shadow-md border border-gray-300 w-full">
                <div class="pl-3">Professors</div>
                <i class="fa-solid fa-chevron-down px-3 mt-1 {openProfessorList ? 'rotated' : 'rotateAgain'}"></i>
            </button>
        {/if}
    
        {#if openProfessorList}
            <div transition:slide class="shadow-md rounded-b-md">
                
                <div class="px-2 rounded-t-md mt-1 border-gray-300 border-t border-l border-r bg-white pb-2">
                    <input 
                    bind:value={searchProfessor} 
                    type="text" 
                    class="h-10 focus:border-b-gray-300 px-2 w-full border-gray-300 border-b border-l-0 border-r-0 border-t-0 focus:ring-0 placeholder-gray-300 highlight" placeholder="Filter Professor..." 
                    />
                </div>

                <ul class="h-40 overflow-y-scroll border-b border-l border-r border-gray-300 rounded-b-md bg-white">
                    {#if filteredProfessors.length === 0}
                        <li class="pl-4 py-1">There are no professors listed...</li>
                    {:else}
                        {#each filteredProfessors as professor}
                            <li class="mx-1 pl-2 py-1 hover:bg-primary hover:bg-opacity-30 hover:border hover:border-primary rounded-md hover:font-semibold transition-all duration-100 text-gray-700 hover:text-black">
                                <button on:click={() => toggleProfessor(professor)} class="flex justify-between w-full cursor-pointer rounded-b-md">
                                    <p>{professor}</p>
                                    <input type="checkbox" value={professor} bind:group={selectedProfessors} class="mr-2 mt-1 text-primary appearance-none border-none ring-none rounded-full"/>
                                </button>
                            </li>
                        {/each}
                    {/if}
                </ul>
            </div>
        {/if}
    </div>


    <!--------------------------------------------------- Rooms List -------------------------------------------------->
    <div class="mt-2">
        {#if !openRoomList}
            <button on:click={toggleRoomsList} class="flex justify-between py-2 bg-white rounded-md border border-gray-300 w-full">
                <div class="pl-3">Rooms</div>
                <i class="fa-solid fa-chevron-down px-3 pt-1 {openRoomList ? 'rotated' : 'rotateAgain'}"></i>
            </button>
        {:else } 
            <button on:click={toggleRoomsList} class="flex justify-between py-2 bg-white rounded-md shadow-md border border-gray-300 w-full">
                <div class="pl-3">Rooms</div>
                <i class="fa-solid fa-chevron-down px-3 mt-1 {openRoomList ? 'rotated' : 'rotateAgain'}"></i>
            </button>
        {/if}

    
        {#if openRoomList}
            <div transition:slide class="shadow-md rounded-b-md">
                
                <div class="px-2 rounded-t-md mt-1 border-gray-300 border-t border-l border-r bg-white pb-2">
                    <input 
                    bind:value={searchRoom} 
                    type="text" 
                    class="h-10 focus:border-b-gray-300 px-2 w-full border-gray-300 border-b border-l-0 border-r-0 border-t-0 focus:ring-0 placeholder-gray-300 highlight" placeholder="Filter Room..." />
                </div>

                <ul class="h-40 overflow-y-scroll border-b border-l border-r border-gray-300 rounded-b-md bg-white">
                    {#if filteredRooms.length === 0}
                        <li class="pl-4 py-1">There are no rooms listed...</li>
                    {:else}
                        {#each filteredRooms as room}
                            <li class="mx-1 pl-2 py-1 hover:bg-primary hover:bg-opacity-30 hover:border hover:border-primary rounded-md hover:font-semibold  transition-all duration-100 text-gray-700 hover:text-black">
                                <button on:click={() => toggleRoom(room)} class="flex justify-between w-full cursor-pointer rounded-b-md">
                                    <p>{room}</p>
                                    <input type="checkbox" value={room} bind:group={selectedRooms} class="mr-2 mt-1 text-primary appearance-none border-none ring-none rounded-full"/>
                                </button>
                            </li>
                        {/each}
                    {/if}
                </ul>
            </div>
        {/if}
    </div>


    <!--------------------------------------------------- Course List -------------------------------------------------->
    <div class="mt-2">
        {#if !openCourseList}
            <button on:click={toggleCourseList} class="flex justify-between py-2 bg-white rounded-md border border-gray-300 w-full">
                <div class="pl-3">Course</div>
                <i class="fa-solid fa-chevron-down px-3 pt-1 {openCourseList ? 'rotated' : 'rotateAgain'}"></i>
            </button>
        {:else } 
            <button on:click={toggleCourseList} class="flex justify-between py-2 bg-white rounded-md shadow-md border border-gray-300 w-full">
                <div class="pl-3">Course</div>
                <i class="fa-solid fa-chevron-down px-3 mt-1 {openCourseList ? 'rotated' : 'rotateAgain'}"></i>
            </button>
        {/if}

    
        {#if openCourseList}
            <div transition:slide class="shadow-md rounded-b-md">
                
                <div class="px-2 rounded-t-md mt-1 border-gray-300 border-t border-l border-r bg-white pb-2">
                    <input 
                    bind:value={searchCourse} 
                    type="text" 
                    class="h-10 focus:border-b-gray-300 px-2 w-full border-gray-300 border-b border-l-0 border-r-0 border-t-0 focus:ring-0 placeholder-gray-300 highlight" placeholder="Filter Course..." />
                </div>

                <ul class="h-40 overflow-y-scroll border-b border-l border-r border-gray-300 rounded-b-md bg-white">
                    {#if filteredCourses.length === 0}
                        <li class="pl-4 py-1">There are no courses listed...</li>
                    {:else}
                        {#each filteredCourses as course}
                            <li class="mx-1 pl-2 py-1 hover:bg-primary hover:bg-opacity-30 hover:border hover:border-primary rounded-md hover:font-semibold  transition-all duration-100 text-gray-700 hover:text-black">
                                <button on:click={() => toggleCourse(course)} class="flex justify-between w-full cursor-pointer rounded-b-md">
                                    <p>{course}</p>
                                    <input type="checkbox" value={course} bind:group={selectedCourses} class="mr-2 mt-1 text-primary appearance-none border-none ring-none rounded-full"/>
                                </button>
                            </li>
                        {/each}
                    {/if}
                </ul>
            </div>
        {/if}
    </div>

    <!------------------------------------------------- Submit Button ------------------------------------------------------->
    <div class="w-full flex gap-4 mt-6">
        <button on:click={filterData} class="py-2 w-full text-white bg-primary rounded-md border border-primary hover:bg-inherit hover:text-primary" >Show Results</button> 
        <button on:click={resetFilters} class="py-2 w-full text-primary rounded-md border border-primary hover:bg-primary hover:text-white" >Reset Filters</button>
    </div>

   <button on:click={removeData} class="py-2 w-full text-red-600 rounded-md mt-12 border border-red-600 hover:bg-red-600 hover:text-white" >Remove All Schedules</button>
</div>

<style>
    .rotated {
        transform: rotate(180deg);
    }
    .rotateAgain {
        transform: rotate(360deg);
    }
    .highlight::selection {
        background: rgb(229 231 235);
    }
</style>

