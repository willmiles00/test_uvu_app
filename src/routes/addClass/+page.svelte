<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()
    import {dataStore, courses, rooms} from '../mongodbData.js'
    // import {courseList} from './courseList.js'

    function closeModal() {
        timeValue = ''
      dispatch('closeModal')
    }

    let timeValue = ''

    let bgColor1 = 'bg-secondary'
    let bgColor2 = 'bg-secondary'
    let bgColor3 = 'bg-secondary'
    let bgColor4 = 'bg-secondary'

    function timeSelected1() {
        bgColor1 = 'bg-primary'
        bgColor2 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        timeValue = 'MTWR'
    }

    function timeSelected2() {
        bgColor2 = 'bg-primary'
        bgColor1 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        timeValue = 'MWF'
    }

    function timeSelected3() {
        bgColor3 = 'bg-primary'
        bgColor1 = 'bg-secondary'
        bgColor2 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        timeValue = 'TRF'
    }

    function timeSelected4() {
        bgColor4 = 'bg-primary'
        bgColor1 = 'bg-secondary'
        bgColor2 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        timeValue = 'MW'
    }

    $: console.log(timeValue)
</script>

<div class="h-full w-full flex justify-center items-center">
  <div class="bg-white rounded-md shadow-lg h-5/6 w-5/6 border border-primary">
    <div class="p-4">
        <div class="w-full flex justify-end">
            <button on:click={closeModal} class="fa-solid fa-circle-xmark text-xl text-primary hover:text-opacity-70"></button>
        </div>
        <div class="">
            <div>
                <h1 class="text-4xl text-primary text-center">Add Class</h1>

                <form class="mt-8">
                    <!-- class and professor inputs -->
                    <div class="flex gap-8 mb-4">
                        <div class="basis-6/12">
                            <label for="className" class="mb-1">Class Name:</label>
                            <input type="text" id="className" name="className" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required placeholder="Type class name (E.R. Web Languages II)">
                        </div>
    
                        <div class="basis-6/12">
                            <label for="profName" class="mb-1">Prof. Name:</label>
                            <input type="text" id="profName" name="profName" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required placeholder="Type professor name...">
                        </div>
                    </div>

                    <!-- course and room selectors -->
                    <div class="flex gap-8 mb-8">
                        <div class="basis-6/12">
                            <label for="course" class="mb-1">Select Course:</label>
                            <select id="course" name="course" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                <option value="">Select a course</option>
                                {#each $courses as course (course)}
                                    <option value={course.course}>{course.course}</option>
                                {/each}
                            </select>
                        </div>
    
                        <div class="basis-6/12">
                            <label for="room" class="mb-1">Room #:</label>
                            <select id="room" name="room" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                <option value="">Select a room number</option>
                                {#each $rooms as room (room)}
                                    <option value={room.room}>{room.room}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <!-- time selection buttons -->
                    <div>
                        <label for="time" class="mb-1">Class Schedule:</label>
                        <div class="flex gap-4 justify-between mb-12">
                            <div class="basis-1/6 py-2 {bgColor1} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected1}>
                                <div>
                                    <p class="text-center text-lg">mtwr</p>
                                    <p class="text-center text-sm">50 min</p>
                                </div>
                            </div>

                            <div class="basis-1/6 py-2 {bgColor2} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected2}>
                                <div>
                                    <p class="text-center text-lg">mwf</p>
                                    <p class="text-center text-sm">75 min</p>
                                    <p class="text-center font-thin text-xs">50 min Friday</p>
                                </div>
                            </div>

                            <div class="basis-1/6 py-2 {bgColor3} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected3}>
                                <div>
                                    <p class="text-center text-lg">trf</p>
                                    <p class="text-center text-sm">75 min</p>
                                    <p class="text-center font-thin text-xs">50 min Friday</p>
                                </div>
                            </div>

                            <div class="basis-1/6 py-2 {bgColor4} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer" on:click={timeSelected4}>
                                <div>
                                    <p class="text-center text-lg">mw</p>
                                    <p class="text-center text-sm">100 min</p>
                                </div>
                            </div>

                            <div class="basis-1/6 py-2 border-4 border-secondary rounded-lg text-secondary font-bold uppercase flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 cursor-pointer">
                                <div>
                                    <p class="text-center text-lg">custom</p>
                                </div>
                            </div>
                            
                        </div>
                    </div> <!-- end of button time selection -->

                    <div class="flex justify-center">
                        <button class="py-2 w-2/6 border border-primary text-primary rounded-lg uppercase font-bold hover:bg-primary hover:text-white transition-all duration-300">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
</div>