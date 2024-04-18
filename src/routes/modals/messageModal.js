/* writable stores for our modal */

import { writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

// shows the title of the modal
export const titleModal = writable('')

// shows the message of the modal
export const messageModal = writable('')

// unhides the modal to show the modal
export const showModal = writable(false)
// shows the first type of modal with one button
export const showOneOption = writable(false)
// shows the second type of modal with two buttons and different styled title
export const showTwoOptions = writable(false)

// this gives us animation for the progress bar
export const progress = tweened(0, {
        duration: 800,
        easing: cubicOut
});

// stores for the progress bar and modal for uploading files
export const progressBarModal = writable(false) // gives us the modal with the progress bar
export const progressBarFinished = writable(false) // text modal when it has been uploaded
export const progressModal = writable(false) // opens the actual modal for both

// store for the importCSV modals (invalid file)
export const showImportModal = writable(false)

// store for the "remove all Schedules" button and its modal
export const deleteProgress = tweened(0, {
    duration: 800,
    easing: cubicOut
});

// stores for the progress bar and modal for deleting all schedules
export const deleteProgressBarModal = writable(false)
export const deleteProgressBarFinished = writable(false)
export const deleteProgressModal = writable(false)


// store for the file that gets uploaded
export const file = writable({})

// store for the filtered modal to show it has been selected
export const filteredModal = writable(false)
export const filteredModalS = writable(false)


export const closeFilterSelectors = writable(false)

export const notificationsTitle = writable('')
export const notificationsDescription = writable('')
export const notificationsWarning = writable(false)

export const editDeleteTitle = writable('')
export const editDeleteDescription = writable('')
export const dataToEditOrDelete = writable()
export const editDeleteWarning = writable(false)

export const classNameToBeDeleted = writable('')