<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()
    import {dataStore, courses, rooms} from '../mongodbData.js'
    // import {courseList} from './courseList.js'

    function closeModal() {
      dispatch('closeModal')
    }

    let normalClasses = true
    let customClasses = false

    let timeH = ''
    let timeM1 = ''
    let timeM2 = ''
    let timeAmPm = ''

    let newClass = {
        className: '',
        profName: '',
        course: '',
        room: '',
        frequency: '', 
        semester: '',
        time: ''
    }

    let bgColor1 = 'bg-secondary'
    let bgColor2 = 'bg-secondary'
    let bgColor3 = 'bg-secondary'
    let bgColor4 = 'bg-secondary'

    function timeSelected1() {
        bgColor1 = 'bg-primary'
        bgColor2 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        newClass.frequency = 'MTWR'
    }

    function timeSelected2() {
        bgColor2 = 'bg-primary'
        bgColor1 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        newClass.frequency = 'MWF'
    }

    function timeSelected3() {
        bgColor3 = 'bg-primary'
        bgColor1 = 'bg-secondary'
        bgColor2 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        newClass.frequency = 'TR'
    }

    function timeSelected4() {
        bgColor4 = 'bg-primary'
        bgColor1 = 'bg-secondary'
        bgColor2 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        newClass.frequency = 'MW'
    }

    // console.log($dataStore)



    async function addNew(e) {
        e.preventDefault()
        let newData = newClass
        newClass.time = `${timeH}:${timeM1}${timeM2} ${timeAmPm}`

        const response = await fetch ('./addClass/add', {
            method: 'POST',
            body: JSON.stringify(newData),
        })
        const data = await response.json()
        console.log(data)
    }

    function switchToCustom() {
        normalClasses = false
        customClasses = true
    }

    function goBack() {
        normalClasses = true
        customClasses = false
    }
</script>

<div class="h-full w-full flex justify-center items-center">
  <div class="bg-white rounded-md shadow-lg w-5/6 border border-primary">
    <div class="p-4">
        <div class="w-full flex justify-end">
            <button on:click={closeModal} class="fa-solid fa-circle-xmark text-xl text-primary hover:text-opacity-70"></button>
        </div>
        <div class="">
            <div>
                <h1 class="text-4xl text-primary text-center">Add Class</h1>

                <form class="mt-8" on:submit={e => addNew(e)}>

                    <!-- class and professor inputs -->
                    <div class="flex gap-8 mb-4">
                        <div class="basis-6/12">
                            <label for="className" class="mb-1 text-primary">Class Name:</label>
                            <input bind:value={newClass.className} type="text" id="className" name="className" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required placeholder="Type class name (E.R. Web Languages II)">
                        </div>
    
                        <div class="basis-6/12">
                            <label for="profName" class="mb-1 text-primary">Prof. Name:</label>
                            <input bind:value={newClass.profName}  type="text" id="profName" name="profName" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required placeholder="Type professor name...">
                        </div>
                    </div>

                    <!-- course and room selectors -->
                    <div class="flex gap-8 mb-8">
                        <div class="basis-6/12">
                            <label for="course" class="mb-1 text-primary">Select Course:</label>
                            <select bind:value={newClass.course} id="course" name="course" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                <option value="">Select a course</option>
                                {#each $courses as course (course)}
                                    <option value={course.course}>{course.course}</option>
                                {/each}
                            </select>
                            <div class="flex text-sm mt-1 ml-1">
                                <p>Course not in here?</p>
                                <div class="text-primary cursor-pointer ml-1 font-semibold">Add Course</div>
                            </div>
                        </div>
    
                        <div class="basis-6/12">
                            <label for="room" class="mb-1 text-primary">Room #:</label>
                            <select bind:value={newClass.room} id="room" name="room" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                <option value="">Select a room number</option>
                                {#each $rooms as room (room)}
                                    <option value={room.room}>{room.room}</option>
                                {/each}
                            </select>
                            <div class="flex text-sm mt-1 ml-1">
                                <p>Room not in here?</p>
                                <div class="text-primary cursor-pointer ml-1 font-semibold">Add Room</div>
                            </div>
                        </div>
                    </div>

                    {#if normalClasses}
                        <!-- frequency selection buttons -->
                        <div>
                            <label for="frequency" class="mb-1">Class Schedule:</label>
                            <div class="flex gap-4 justify-between mb-12">
                                <div class="basis-1/6 p-4 {bgColor1} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected1}>
                                    <div>
                                        <p class="text-center text-lg">mtwr</p>
                                        <p class="text-center text-sm">50 min</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {bgColor2} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected2}>
                                    <div>
                                        <p class="text-center text-lg">mwf</p>
                                        <p class="text-center text-sm">50 min</p>
                                        <!-- <p class="text-center font-thin text-xs">50 min Friday</p> -->
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {bgColor3} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected3}>
                                    <div>
                                        <p class="text-center text-lg">tr</p>
                                        <p class="text-center text-sm">75 min</p>
                                        <!-- <p class="text-center font-thin text-xs">50 min Friday</p> -->
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {bgColor4} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected4}>
                                    <div>
                                        <p class="text-center text-lg">mw</p>
                                        <p class="text-center text-sm">75 min</p>
                                    </div>
                                </div>

                                <div on:click={switchToCustom} class="basis-1/6 p-4 border-4 border-secondary rounded-lg text-secondary font-bold uppercase flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 cursor-pointer">
                                    <div>
                                        <p class="text-center text-lg">custom</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div> <!-- end of button time selection -->

                        
                        <!-- semester selectors -->
                        <div class="flex justify-center mb-8 gap-8">
                            <div class="basis-6/12">
                                <label for="semester" class="mb-1">Select Semester:</label>
                                <select bind:value={newClass.semester} id="semester" name="semester" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a semester</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                </select>
                            </div>

                            <div class="basis-6/12 w-6/12">
                                <label for="semester" class="mb-1">Select Start Time:</label>
                                <div class="flex gap-1 justify-center items-center">
                                    <div>
                                        <input type="number" bind:value={timeH} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-14" min="1" max="12" required />
                                    </div>

                                    <div class="text-3xl mb-2">:</div>

                                    <div class="flex">
                                        <div>
                                            <input type="number" bind:value={timeM1} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-0 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-12 rounded-tl-md rounded-bl-md" min="0" max="5" required />
                                        </div>
        
                                        <div>
                                            <input type="number" bind:value={timeM2} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-0 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-12 rounded-tr-md rounded-br-md" min="0" max="9" required />
                                        </div>
                                    </div>

                                    <div>
                                        <select bind:value={timeAmPm} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-20" required >
                                            <option value=""></option>
                                            <option value="am">AM</option>
                                            <option value="pm">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}

                    {#if customClasses}
                        <div on:click={goBack} class="fa-solid fa-chevron-left"></div>
                    {/if}

                    <div class="flex justify-center mb-4">
                        <button class="py-2 w-2/6 border border-primary text-primary rounded-lg uppercase font-bold hover:bg-primary hover:text-white transition-all duration-300">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
</div>

<style>
    input[type="number"]::-webkit-inner-spin-button, 
input[type="number"]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>