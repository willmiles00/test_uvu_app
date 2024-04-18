<script>
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()
    import {dataStore, courses, rooms} from '../mongodbData.js'
    import AddedClassModal from '../modals/classAddedModal.svelte'
    import Notifications from '../modals/addClassNotifications.svelte'
    import {notificationsTitle, notificationsDescription, notificationsWarning } from '../modals/messageModal.js'
    import { fly } from 'svelte/transition'
 
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

    let bgColor1 = 'bg-primary'
    let bgColor2 = 'bg-primary'
    let bgColor3 = 'bg-primary'
    let bgColor4 = 'bg-primary'

    let cc1 = 'bg-primary'
    let cc2 = 'bg-primary'
    let cc3 = 'bg-primary'
    let cc4 = 'bg-primary'
    let cc5 = 'bg-primary'

    let newClassAdded = false

    function timeSelected1() {
        bgColor1 = 'bg-primaryDark'
        bgColor2 = 'bg-primary'
        bgColor3 = 'bg-primary'
        bgColor4 = 'bg-primary'
        newClass.frequency = 'MTWR'
    }

    function timeSelected2() {
        bgColor2 = 'bg-primaryDark'
        bgColor1 = 'bg-primary'
        bgColor3 = 'bg-primary'
        bgColor4 = 'bg-primary'
        newClass.frequency = 'MWF'
    }

    function timeSelected3() {
        bgColor3 = 'bg-primaryDark'
        bgColor1 = 'bg-primary'
        bgColor2 = 'bg-primary'
        bgColor4 = 'bg-primary'
        newClass.frequency = 'TR'
    }

    function timeSelected4() {
        bgColor4 = 'bg-primaryDark'
        bgColor1 = 'bg-primary'
        bgColor2 = 'bg-primary'
        bgColor3 = 'bg-primary'
        newClass.frequency = 'MW'
    }

    

    function cTimeSelected1() {
        if (cc1 === 'bg-primary') {
            cc1 = 'bg-primaryDark'
        } else {
            cc1 = 'bg-primary'
        }
    }

    function cTimeSelected2() {
        if (cc2 === 'bg-primary') {
            cc2 = 'bg-primaryDark'
        } else {
            cc2 = 'bg-primary'
        }
    }

    function cTimeSelected3() {
        if (cc3 === 'bg-primary') {
            cc3 = 'bg-primaryDark'
        } else {
            cc3 = 'bg-primary'
        }
    }

    function cTimeSelected4() {
        if (cc4 === 'bg-primary') {
            cc4 = 'bg-primaryDark'
        } else {
            cc4 = 'bg-primary'
        }
    }

    function cTimeSelected5() {
        if (cc5 === 'bg-primary') {
            cc5 = 'bg-primaryDark'
        } else {
            cc5 = 'bg-primary'
        }
    }



    async function addNew(e) {
        e.preventDefault()
        let newData = newClass
        newClass.time = `${timeH}:${timeM1}${timeM2} ${timeAmPm}`
        newClass.profName = `${lastName}, ${firstName}`
        if (customClasses) {
            newClass.frequency = ''
            if (cc1 === 'bg-primaryDark') {
                newClass.frequency += 'M'
            }
            if (cc2 === 'bg-primaryDark') {
                newClass.frequency += 'T'
            }
            if (cc3 === 'bg-primaryDark') {
                newClass.frequency += 'W'
            }
            if (cc4 === 'bg-primaryDark') {
                newClass.frequency += 'R'
            }
            if (cc5 === 'bg-primaryDark') {
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
        bgColor1 = 'bg-primary'
        bgColor2 = 'bg-primary'
        bgColor3 = 'bg-primary'
        bgColor4 = 'bg-primary'
        cc1 = 'bg-primary'
        cc2 = 'bg-primary'
        cc3 = 'bg-primary'
        cc4 = 'bg-primary'
        cc5 = 'bg-primary'

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
        if (addNewCourse === '') {
            newCourseAddedModal = true
            notificationsWarning.set(true)
            notificationsTitle.set('No Input Detected')
            notificationsDescription.set('You didnt add anything to the course input field. Please add a course to the list.')
        } else {
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
            notificationsDescription.set('The new course has been added to the list successfully')
            addNewCourse = ''
        }
        
    }

    async function addNewRoomToList() {
        console.log("hello")

        if (addNewRoom === '') {
            newCourseAddedModal = true
            notificationsWarning.set(true)
            notificationsTitle.set('No Input Detected')
            notificationsDescription.set('You didnt add anything to the room input field. Please add a room to the list.')
        } else {
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
            notificationsDescription.set('The new room has been added to the list successfully')
            addNewRoom = ''
        }
    }

    function closeNotifications() {
        newCourseAddedModal = false
        courseAvailable = true
        roomAvailable = true
        notificationsWarning.set(false)
    }
</script>


<div class="w-full flex justify-center {normalClassH}"><!-- right here -->
  <div class="bg-white rounded-md shadow-lg w-4/6 border border-gray-300">

    {#if newClassAdded}
        <div class="fixed z-40 h-full w-4/6 flex items-center justify-center">
            <AddedClassModal on:closeAddedClassModal={closeTheModal}/>
        </div>
    {/if}

    {#if newCourseAddedModal}
        <div class="fixed z-40 h-full w-4/6 flex items-center justify-center">
            <Notifications on:closeNotificationsModal={closeNotifications}/>
        </div>
    {/if}

    <div class="">
        <div class="relative bg-secondary rounded-t-md">
            <div class="absolute z-10 right-4 w-full h-full flex justify-end items-center">
                <button on:click={closeModal} class="fa-solid fa-circle-xmark text-xl text-third hover:text-white"></button>
            </div>
            <div class="h-full flex items-center justify-center py-4">
                <h1 class="text-4xl text-white text-center font-raj">Add Schedules</h1>
            </div>
        </div>
        <div class="px-12">
            <div>
                <!-- <div class="flex justify-center translate-y-[-15px]">
                    <i class="fa-solid fa-circle-plus text-2xl bg-white px-4 text-primary"></i>
                </div> -->

                <form class="mt-4 mb-4" on:submit={e => addNew(e)}>

                    <!-- class and professor inputs -->
                    <div class="flex gap-16 mb-4">
                        <div class="basis-6/12">
                            <label for="className" class="mb-1 text-primary font-raj font-semibold">Class Name:</label>
                            <input bind:value={newClass.className} type="text" id="className" name="className" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary"  placeholder="Type class name (E.R. Web Languages II)" required>
                        </div>
    
                        <div class="basis-6/12 flex gap-4">
                            <div class="basis-6/12 pr-2">
                                <label for="firstName" class="mb-1 text-primary font-raj font-semibold">First Name:</label>
                                <input bind:value={firstName}  type="text" id="firstName" name="firstName" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary"  placeholder="Type professor name..." required>
                            </div>

                            <div class="basis-6/12 pl-2">
                                <label for="lastName" class="mb-1 text-primary font-raj font-semibold">Last Name:</label>
                                <input bind:value={lastName}  type="text" id="lastName" name="lastName" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary"  placeholder="Type professor name..." required>
                            </div>
                        </div>
                    </div>

                    <!-- course and room selectors -->
                    <div class="flex gap-16 mb-8">
                        <div class="basis-6/12">
                            {#if courseAvailable}
                                <label for="course" class="mb-1 text-primary font-raj font-semibold">Select Course:</label>
                                <select bind:value={newClass.course} id="course" name="course" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a course</option>
                                    {#each $courses as course (course)}
                                        <option value={course.course}>{course.course}</option>
                                    {/each}
                                </select>
                                <div class="flex text-sm mt-1 ml-1">
                                    <p class="font-raj">Course not in here?</p>
                                    <div on:click={switchToAddCourse} class="text-primary cursor-pointer ml-1 font-semibold hover:text-primaryDark font-raj">Add Course</div>
                                </div>
                            {/if}
                            {#if !courseAvailable}
                                <label for="newCourse" class="mb-1 text-primary font-raj font-semibold">Add New Course:</label>
                                <div class="flex gap-1">
                                    <input type="text" bind:value={addNewCourse} id="course" name="course" class="w-8/12 bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" />

                                    <div on:click={addNewCourseToList} class="py-2 bg-primary rounded-md w-2/12 text-white text-center cursor-pointer hover:bg-primaryDark bg-primary">
                                        <i class="fa-solid fa-circle-plus text-xl"></i>
                                    </div>

                                    <div on:click={switchToAddCourse} class="py-2 bg-third rounded-md w-2/12 text-primary text-center cursor-pointer hover:text-white hover:bg-primary">
                                        <i class="fa-solid fa-ban text-xl"></i>
                                    </div>
                                </div>
                            {/if}
                        </div>
    
                        <div class="basis-6/12">
                            {#if roomAvailable}
                                <label for="room" class="mb-1 text-primary font-raj font-semibold">Room #:</label>
                                <select bind:value={newClass.room} id="room" name="room" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a room number</option>
                                    {#each $rooms as room (room)}
                                        <option value={room.room}>{room.room}</option>
                                    {/each}
                                </select>
                                <div class="flex text-sm mt-1 ml-1">
                                    <p class="font-raj">Room not in here?</p>
                                    <div on:click={switchToAddRoom} class="text-primary cursor-pointer ml-1 font-semibold hover:text-primaryDark font-raj">Add Room</div>
                                </div>
                            {/if}
                            {#if !roomAvailable}
                                <label for="newRoom" class="mb-1 text-primary font-raj font-semibold">Add New Room:</label>
                                <div class="flex gap-1">
                                    <input type="text" bind:value={addNewRoom} id="room" name="room" class="w-8/12 bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" />

                                    <div on:click={addNewRoomToList} class="py-2 bg-primary rounded-md w-2/12 text-white text-center cursor-pointer hover:bg-primaryDark bg-primary">
                                        <i class="fa-solid fa-circle-plus text-xl"></i>
                                    </div>

                                    <div on:click={switchToAddRoom} class="py-2 bg-third rounded-md w-2/12 text-primary text-center cursor-pointer hover:text-white hover:bg-primary">
                                        <i class="fa-solid fa-ban text-xl"></i>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>

                    {#if normalClasses}
                        <!-- frequency selection buttons -->
                        <div in:fly={{ x:200, duration:300 }} out:fly={{ x:200, duration:400 }}>
                            <label for="frequency" class="mb-1 text-primary font-raj font-semibold">Select a Class Schedule:</label>
                            <div class="flex gap-4 justify-between mb-12">

                                <div class="basis-1/6 px-4 py-2 {bgColor1} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={timeSelected1}>
                                    <div>
                                        <p class="text-center text-lg font-raj">mtwr</p>
                                        <p class="text-center text-sm font-raj">50 min</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 px-4 py-2 {bgColor2} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={timeSelected2}>
                                    <div>
                                        <p class="text-center text-lg font-raj">mwf</p>
                                        <p class="text-center text-sm font-raj">50 min</p>
                                        <!-- <p class="text-center font-thin text-xs">50 min Friday</p> -->
                                    </div>
                                </div>

                                <div class="basis-1/6 px-4 py-2 {bgColor3} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={timeSelected3}>
                                    <div>
                                        <p class="text-center text-lg font-raj">tr</p>
                                        <p class="text-center text-sm font-raj">75 min</p>
                                        <!-- <p class="text-center font-thin text-xs">50 min Friday</p> -->
                                    </div>
                                </div>

                                <div class="basis-1/6 px-4 py-2 {bgColor4} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={timeSelected4}>
                                    <div>
                                        <p class="text-center text-lg font-raj">mw</p>
                                        <p class="text-center text-sm font-raj">75 min</p>
                                    </div>
                                </div>

                                <div on:click={switchToCustom} class="basis-1/6 px-4 py-2 bg-third rounded-lg text-primary font-bold uppercase flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-md border border-primary border-b-secondary border-b-4">

                                    <div class="flex justify-center items-center gap-4">
                                        <i class="fa-solid fa-wrench text-lg"></i>
                                        <div class="flex justify-center">
                                            <p class="text-lg font-raj ">custom schedule</p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div> <!-- end of button time selection -->
                    {/if}

                    <!-- CUSTOM CLASSES -->
                    {#if customClasses}
                        <div in:fly={{ x:200, duration:300 }} out:fly={{ x:200, duration:400 }} class="flex justify-start mb-12">
                            <div on:click={goBack} class="bg-primary px-4 py-2 rounded-lg text-white uppercase cursor-pointer hover:bg-primaryDark shadow-md font-raj font-medium text-sm transition-all duration-300">
                                <i class="fa-solid fa-chevron-left mr-2 text-white "></i>
                                Go Back
                            </div>
                        </div>

                        <div in:fly={{ x:200, duration:300 }} out:fly={{ x:200, duration:400 }}>
                            <label for="frequency" class="mb-1 text-primary font-raj font-semibold">Select Custom Schedule:</label>
                            <div class="flex gap-4 justify-between mb-12">
                                <div class="basis-1/6 p-4 {cc1} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={cTimeSelected1}>
                                    <div>
                                        <p class="text-center text-lg font-raj">mon</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc2} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={cTimeSelected2}>
                                    <div>
                                        <p class="text-center text-lg font-raj">tues</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc3} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={cTimeSelected3}>
                                    <div>
                                        <p class="text-center text-lg font-raj">wed</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc4} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={cTimeSelected4}>
                                    <div>
                                        <p class="text-center text-lg font-raj">thur</p>
                                    </div>
                                </div>

                                <div class="basis-1/6 p-4 {cc5} rounded-lg text-white font-bold uppercase flex items-center justify-center hover:bg-primaryDark transition-all duration-300 cursor-pointer shadow-md border-b-4 border-b-secondary hover:border-b-primary" on:click={cTimeSelected5}>
                                    <div>
                                        <p class="text-center text-lg font-raj">fri</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div> <!-- end of custom days -->
                    {/if}

                        
                    <!-- semester selectors -->
                    <div class="flex justify-center mb-8 flex-wrap">
                        <div class="basis-6/12">
                            <div class="pr-8">
                                <label for="semester" class="mb-1 text-primary font-raj font-semibold">Select Semester:</label>
                                <select bind:value={newClass.semester} id="semester" name="semester" class="w-full bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-4 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary" required>
                                    <option value="">Select a semester</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                </select>
                            </div>
                        </div>

                        <div class="basis-6/12">
                            <div class="ml-8">
                                <label for="semester" class="mb-1 text-primary font-raj font-semibold">Select Start Time: (HH:MM)</label>
                                <div class="flex gap-1 justify-start items-center">
                                    <div>
                                        <input type="number" bind:value={timeH} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 pl-1 pr-2 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-12" min="1" max="12" required />
                                    </div>

                                    <div class="text-3xl mb-2">:</div>

                                    <div class="flex">
                                        <div>
                                            <input type="number" bind:value={timeM1} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-0 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 px-2 py-2 outline-none placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary focus:border-b-primary text-primary w-11 rounded-tl-md rounded-bl-md focus:border-r-0" min="0" max="5" required />
                                        </div>
        
                                        <div>
                                            <input type="number" bind:value={timeM2} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-0 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 py-2 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary focus:border-l-0 text-primary w-10 rounded-tr-md rounded-br-md translate-x-[-5px] pr-2 pl-1 focus:ring-l-0" min="0" max="9" required />
                                        </div>
                                    </div>

                                    <div>
                                        <select bind:value={timeAmPm} id="semester" name="semester" class=" bg-gray-100 border-b-4 border-gray-300 border-l-1 border-r-1 border-t-1 border-t-gray-200 border-l-gray-200 border-r-gray-200 rounded-md py-2 px-2 placeholder-gray-400 focus:ring-primary focus:outline-none focus:border-primary text-primary w-16" required>
                                            <option value=""></option>
                                            <option class="uppercase" value="am">am</option>
                                            <option class="uppercase" value="pm">pm</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {#if customClasses}
                            <div in:fly={{ x:200, duration:300 }} out:fly={{ x:200, duration:400 }} class="basis-full mt-4">
                                <div class=" flex justify-start flex-wrap">
                                    <div class="basis-full flex justify-start">
                                        <label for="timeLength" class="mb-1 w-6/12 text-primary font-raj font-semibold">Class Length</label>
                                    </div>
                                    <div class=" basis-6/12 pr-8">
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
                        <button class="py-2 w-2/6 bg-primary text-white rounded-lg uppercase font-raj font-medium hover:bg-primary hover:bg-primaryDark transition-all duration-300">
                        <div class="flex justify-center items-center gap-2 text-sm">
                            <i class="fa-solid fa-circle-plus text-lg"></i>
                            Add Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
</div>

<style>
    /* input[type="number"]::-webkit-inner-spin-button, 
input[type="number"]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

input[type="number"] {
  -moz-appearance: textfield;
} */
</style>