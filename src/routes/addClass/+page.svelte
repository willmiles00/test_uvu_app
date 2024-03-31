<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()
    import {dataStore, courses, rooms} from '../mongodbData.js'
    import AddedClassModal from '../modals/classAddedModal.svelte'
    import Notifications from '../modals/addClassNotifications.svelte'
    import {notificationsTitle, notificationsDescription} from '../modals/messageModal.js'
 
    function closeModal() {
      dispatch('closeModal')
    }

    let normalClasses = true
    let customClasses = false
    let normalClassH = "h-full items-center"

    let courseAvailable = true
    let addNewCourse = ''
    let newCourseAddedModal = false

    let roomAvailable = true
    let addNewRoom = ''

    let timeH = ''
    let timeM1 = ''
    let timeM2 = ''
    let timeAmPm = ''

    let firstName = ''
    let lastName = ''

    let newClass = {
        className: '',
        profName: '',
        course: '',
        room: '',
        frequency: '', 
        semester: '',
        time: '',
        isCustomClass: false
    }
    let timeLength = ''

    let bgColor1 = 'bg-secondary'
    let bgColor2 = 'bg-secondary'
    let bgColor3 = 'bg-secondary'
    let bgColor4 = 'bg-secondary'

    let cc1 = 'bg-secondary'
    let cc2 = 'bg-secondary'
    let cc3 = 'bg-secondary'
    let cc4 = 'bg-secondary'
    let cc5 = 'bg-secondary'

    let newClassAdded = false

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

    

    function cTimeSelected1() {
        if (cc1 === 'bg-secondary') {
            cc1 = 'bg-primary'
        } else {
            cc1 = 'bg-secondary'
        }
        // STILL NEED TO FIND A WAY TO ADD THE CUSTOM FREQUENCY DETAILS TO SEND TO THE SERVER
    }

    function cTimeSelected2() {
        if (cc2 === 'bg-secondary') {
            cc2 = 'bg-primary'
        } else {
            cc2 = 'bg-secondary'
        }
    }

    function cTimeSelected3() {
        if (cc3 === 'bg-secondary') {
            cc3 = 'bg-primary'
        } else {
            cc3 = 'bg-secondary'
        }
    }

    function cTimeSelected4() {
        if (cc4 === 'bg-secondary') {
            cc4 = 'bg-primary'
        } else {
            cc4 = 'bg-secondary'
        }
    }

    function cTimeSelected5() {
        if (cc5 === 'bg-secondary') {
            cc5 = 'bg-primary'
        } else {
            cc5 = 'bg-secondary'
        }
    }



    async function addNew(e) {
        e.preventDefault()
        let newData = newClass
        newClass.time = `${timeH}:${timeM1}${timeM2} ${timeAmPm}`
        newClass.profName = `${lastName}, ${firstName}`
        if (customClasses) {
            newClass.frequency = ''
            if (cc1 === 'bg-primary') {
                newClass.frequency += 'M'
            }
            if (cc2 === 'bg-primary') {
                newClass.frequency += 'T'
            }
            if (cc3 === 'bg-primary') {
                newClass.frequency += 'W'
            }
            if (cc4 === 'bg-primary') {
                newClass.frequency += 'R'
            }
            if (cc5 === 'bg-primary') {
                newClass.frequency += 'F'
            }
            newClass.timeLength = timeLength
            newClass.isCustomClass = true
        }

        const response = await fetch ('./addClass/add', {
            method: 'POST',
            body: JSON.stringify(newData),
        })

        timeH = ''
        timeM1 = ''
        timeM2 = ''
        timeAmPm = ''
        firstName = ''
        lastName = ''
        newClass.className = ''
        newClass.profName = ''
        newClass.course = ''
        newClass.room = ''
        newClass.frequency = ''
        newClass.semester = ''
        newClass.time = ''
        newClass.isCustomClass = false
        timeLength = ''
        bgColor1 = 'bg-secondary'
        bgColor2 = 'bg-secondary'
        bgColor3 = 'bg-secondary'
        bgColor4 = 'bg-secondary'
        cc1 = 'bg-secondary'
        cc2 = 'bg-secondary'
        cc3 = 'bg-secondary'
        cc4 = 'bg-secondary'
        cc5 = 'bg-secondary'

        const data = await response.json()
        let pushingNewData = $dataStore
        pushingNewData.push(...data)
        dataStore.set(pushingNewData)
        console.log($dataStore)

        newClassAdded = true
    }

    function switchToCustom() {
        normalClasses = false
        customClasses = true
        normalClassH = ""
    }

    function goBack() {
        normalClasses = true
        customClasses = false
        normalClassH = "h-full items-center"
    }

    function closeTheModal() {
        newClassAdded = false
        dispatch('closeModal')
        // location.reload()
    }
    function switchToAddCourse() {
        courseAvailable = !courseAvailable
    }

    function switchToAddRoom() {
        roomAvailable = !roomAvailable
    }

    async function addNewCourseToList() {
        console.log("hello")
        let newCourse = {
            course: addNewCourse
        }
        const response = await fetch ('./addClass/addCourseList', {
            method: 'POST',
            body: JSON.stringify(newCourse),
        })
        const data = await response.json()

        let theCourses = $courses
        let addingTheNewCourse = theCourses = [...theCourses, newCourse] 
        courses.set(addingTheNewCourse)
        
        newCourseAddedModal = true
        notificationsTitle.set('Course Added')
        notificationsDescription.set('The new course has been added successfully')
        addNewCourse = ''
    }

    async function addNewRoomToList() {
        console.log("hello")
        let newRoom = {
            room: addNewRoom
        } 

        const response = await fetch ('./addClass/addRoomList', {
            method: 'POST',
            body: JSON.stringify(newRoom),
        })
        const data = await response.json()

        let theRooms = $rooms
        let addingTheNewRoom = theRooms = [...theRooms, newRoom]
        rooms.set(addingTheNewRoom)

        newCourseAddedModal = true
        notificationsTitle.set('Room Added')
        notificationsDescription.set('The new room has been added successfully')
        addNewRoom = ''
    }

    function closeNotifications() {
        newCourseAddedModal = false
        courseAvailable = true
        roomAvailable = true
    }
</script>


<div class="w-full flex justify-center {normalClassH}"><!-- right here -->
  <div class="bg-white rounded-md shadow-lg w-5/6 border border-primary">

    {#if newClassAdded}
        <div class="fixed z-40 h-5/6 w-5/6 flex items-center justify-center">
            <AddedClassModal on:closeAddedClassModal={closeTheModal}/>
        </div>
    {/if}

    {#if newCourseAddedModal}
        <div class="fixed z-40 h-5/6 w-5/6 flex items-center justify-center">
            <Notifications on:closeNotificationsModal={closeNotifications}/>
        </div>
    {/if}

    <div class="p-4">
        <div class="w-full flex justify-end">
            <button on:click={closeModal} class="fa-solid fa-circle-xmark text-xl text-primary hover:text-opacity-70"></button>
        </div>
        <div class="">
            <div>
                <h1 class="text-4xl text-primary text-center">Add Class</h1>

                <form class="mt-8 mb-4" on:submit={e => addNew(e)}>

                    <!-- class and professor inputs -->
                    <div class="flex gap-8 mb-4">
                        <div class="basis-6/12">
                            <label for="className" class="mb-1 text-primary">Class Name:</label>
                            <input bind:value={newClass.className} type="text" id="className" name="className" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary"  placeholder="Type class name (E.R. Web Languages II)" required>
                        </div>
    
                        <div class="basis-6/12 flex">
                            <div class="basis-6/12 pr-2">
                                <label for="firstName" class="mb-1 text-primary">First Name:</label>
                                <input bind:value={firstName}  type="text" id="firstName" name="firstName" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary"  placeholder="Type professor name..." required>
                            </div>

                            <div class="basis-6/12 pl-2">
                                <label for="lastName" class="mb-1 text-primary">Last Name:</label>
                                <input bind:value={lastName}  type="text" id="lastName" name="lastName" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary"  placeholder="Type professor name..." required>
                            </div>
                        </div>
                    </div>

                    <!-- course and room selectors -->
                    <div class="flex gap-8 mb-8">
                        <div class="basis-6/12">
                            {#if courseAvailable}
                                <label for="course" class="mb-1 text-primary">Select Course:</label>
                                <select bind:value={newClass.course} id="course" name="course" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a course</option>
                                    {#each $courses as course (course)}
                                        <option value={course.course}>{course.course}</option>
                                    {/each}
                                </select>
                                <div class="flex text-sm mt-1 ml-1">
                                    <p>Course not in here?</p>
                                    <div on:click={switchToAddCourse} class="text-secondary cursor-pointer ml-1 font-semibold hover:text-primary">Add Course</div>
                                </div>
                            {/if}
                            {#if !courseAvailable}
                                <label for="newCourse" class="mb-1 text-primary">Add New Course:</label>
                                <div class="flex gap-1">
                                    <input type="text" bind:value={addNewCourse} id="course" name="course" class="w-8/12 bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" />

                                    <div on:click={addNewCourseToList} class="py-2 border border-primary rounded-md w-2/12 text-center shadow-md uppercase text-primary font-bold hover:bg-primary hover:text-white cursor-pointer">Submit</div>

                                    <div on:click={switchToAddCourse} class="py-2 bg-primary rounded-md w-2/12 text-white shadow-md uppercase font-bold border border-primary hover:bg-white hover:text-primary text-center cursor-pointer">Cancel</div>
                                </div>
                            {/if}
                        </div>
    
                        <div class="basis-6/12">
                            {#if roomAvailable}
                                <label for="room" class="mb-1 text-primary">Room #:</label>
                                <select bind:value={newClass.room} id="room" name="room" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a room number</option>
                                    {#each $rooms as room (room)}
                                        <option value={room.room}>{room.room}</option>
                                    {/each}
                                </select>
                                <div class="flex text-sm mt-1 ml-1">
                                    <p>Room not in here?</p>
                                    <div on:click={switchToAddRoom} class="text-secondary cursor-pointer ml-1 font-semibold hover:text-primary">Add Room</div>
                                </div>
                            {/if}
                            {#if !roomAvailable}
                                <label for="newRoom" class="mb-1 text-primary">Add New Room:</label>
                                <div class="flex gap-1">
                                    <input type="text" bind:value={addNewRoom} id="room" name="room" class="w-8/12 bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" />

                                    <div on:click={addNewRoomToList} class="py-2 border border-primary rounded-md w-2/12 text-center shadow-md uppercase text-primary font-bold hover:bg-primary hover:text-white cursor-pointer">Submit</div>

                                    <div on:click={switchToAddRoom} class="py-2 bg-primary rounded-md w-2/12 text-white shadow-md uppercase font-bold border border-primary hover:bg-white hover:text-primary text-center cursor-pointer">Cancel</div>
                                </div>
                            {/if}
                        </div>
                    </div>

                    {#if normalClasses}
                        <!-- frequency selection buttons -->
                        <div>
                            <label for="frequency" class="mb-1 text-primary">Class Schedule:</label>
                            <div class="flex gap-4 justify-between mb-12">
                                <div class="basis-1/6 p-4 {bgColor1} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={timeSelected1}>
                                    <div>
                                        <p class="text-center text-lg">mtwr</p>
                                        <p class="text-center text-sm">50 min</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {bgColor2} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={timeSelected2}>
                                    <div>
                                        <p class="text-center text-lg">mwf</p>
                                        <p class="text-center text-sm">50 min</p>
                                        <!-- <p class="text-center font-thin text-xs">50 min Friday</p> -->
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {bgColor3} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={timeSelected3}>
                                    <div>
                                        <p class="text-center text-lg">tr</p>
                                        <p class="text-center text-sm">75 min</p>
                                        <!-- <p class="text-center font-thin text-xs">50 min Friday</p> -->
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {bgColor4} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={timeSelected4}>
                                    <div>
                                        <p class="text-center text-lg">mw</p>
                                        <p class="text-center text-sm">75 min</p>
                                    </div>
                                </div>

                                <div on:click={switchToCustom} class="basis-1/6 p-4 border-4 border-secondary rounded-lg text-secondary font-bold uppercase flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 cursor-pointer shadow-md">
                                    <div>
                                        <p class="text-center text-lg">custom</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div> <!-- end of button time selection -->
                    {/if}

                    {#if customClasses}
                        <div class="flex justify-start mb-12">
                            <div on:click={goBack} class="bg-primary px-4 py-2 rounded-lg text-white uppercase cursor-pointer hover:bg-opacity-90 shadow-md">
                                <i class="fa-solid fa-chevron-left mr-2 text-white"></i>
                                Go Back
                            </div>
                        </div>

                        <div>
                            <label for="frequency" class="mb-1 text-primary">Occurs Every:</label>
                            <div class="flex gap-4 justify-between mb-12">
                                <div class="basis-1/6 p-4 {cc1} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={cTimeSelected1}>
                                    <div>
                                        <p class="text-center text-lg">m</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc2} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={cTimeSelected2}>
                                    <div>
                                        <p class="text-center text-lg">t</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc3} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={cTimeSelected3}>
                                    <div>
                                        <p class="text-center text-lg">w</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc4} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={cTimeSelected4}>
                                    <div>
                                        <p class="text-center text-lg">r</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc5} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primary transition-all duration-300 cursor-pointer shadow-md" on:click={cTimeSelected5}>
                                    <div>
                                        <p class="text-center text-lg">f</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div> <!-- end of custom days -->
                    {/if}

                        
                    <!-- semester selectors -->
                    <div class="flex justify-center mb-8 flex-wrap">
                        <div class="basis-6/12">
                            <div class="pr-4">
                                <label for="semester" class="mb-1 text-primary">Select Semester:</label>
                                <select bind:value={newClass.semester} id="semester" name="semester" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a semester</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                </select>
                            </div>
                        </div>

                        <div class="basis-6/12">
                            <div class="ml-4">
                                <label for="semester" class="mb-1 text-primary">Select Start Time:</label>
                                <div class="flex gap-1 justify-start items-center">
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
                                        <select bind:value={timeAmPm} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-20" required>
                                            <option value=""></option>
                                            <option value="am">AM</option>
                                            <option value="pm">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {#if customClasses}
                            <div class="basis-full mt-4">
                                <div class=" flex justify-start flex-wrap">
                                    <div class="basis-full flex justify-start">
                                        <label for="timeLength" class="mb-1 w-6/12 text-primary">Class Length</label>
                                    </div>
                                    <div class=" basis-6/12 pr-4">
                                        <select bind:value={timeLength} class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-full" required>
                                            <option value="">Select length</option>
                                            <option value="50">50 min</option>
                                            <option value="75">75 min</option>
                                            <option value="120">120 min</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                    

                    <div class="flex justify-center">
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